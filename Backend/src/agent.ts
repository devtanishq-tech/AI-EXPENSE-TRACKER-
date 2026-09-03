import { MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { getWriter } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { initializeDB } from "./import.ts";
import { databaseFunction, weatherTool, webSearchtool } from "./tools.ts";
import dotenv from "dotenv";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { llmSystemPrompt } from "./prompt.ts";
import type { AIMessage, ToolMessage } from "@langchain/core/messages";
import type { streamResponse } from "./type.ts";

dotenv.config();
console.log(process.env.GROQ_API_KEY);
// initalize data
const databasee = initializeDB("../expense.db");
const tool = databaseFunction(databasee);
const tools = [
  tool.addexpensive,
  tool.getExpense,
  tool.generateChart,
  webSearchtool,
  weatherTool,
];
//========================================================
const toolNode = new ToolNode(tools);
//========================================================
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
  streaming: true,
});
//----------------------------------LLM NODE ---------------------
async function LLMnode(state: typeof MessagesAnnotation.State) {
  const llmwithTool = llm.bindTools([
    tool.addexpensive,
    tool.getExpense,
    tool.generateChart,
    webSearchtool,
    weatherTool,
  ]);
  const llminvoke = await llmwithTool.invoke([
    llmSystemPrompt,
    ...state.messages,
  ]);
  return {
    messages: [llminvoke],
  };
}
//==================================GRAPHS ========================
async function condition1(
  state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig,
) {
  const lastmessage = state.messages.at(-1) as AIMessage;
  if (lastmessage.tool_calls?.length) {
    const toolcall = lastmessage.tool_calls[0];
    const writer = getWriter(config);
    //============Send one more cusotom event here //======
    //================Custom event ----1//===============
    writer?.({
      type: "tool:status",
      payload: {
        text: `Wait - calling tool ${toolcall!.name}...`,
      },
    });
    //=======================================
    //==============custom event -2 //==================

    const toolresponse: streamResponse = {
      type: "tooCall:start",
      payload: {
        name: toolcall?.name!,
        args: toolcall?.args!,
      },
    };

    writer?.(toolresponse);
    return "toolNode";
  }
  return "__end__";
}
async function condition2(
  state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig,
) {
  const lastmessage = state.messages.at(-1) as ToolMessage;
  const messagess = JSON.parse(lastmessage.content as string);
  const writer = getWriter(config);
  writer?.({
    type: "tool",
    payload: {
      name: lastmessage.name,
      result: messagess,
    },
  });
  if (messagess.type === "chart") {
    return "__end__";
  }
  return "llmNode";
}
const graph = new StateGraph(MessagesAnnotation)
  .addNode("llmNode", LLMnode)
  .addNode("toolNode", toolNode)
  .addEdge("__start__", "llmNode")
  .addConditionalEdges("toolNode", condition2)
  .addConditionalEdges("llmNode", condition1);
export const agents = graph.compile({ checkpointer: new MemorySaver() });
//=======================================
