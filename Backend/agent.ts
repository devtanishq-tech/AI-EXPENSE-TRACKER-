import { MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { initializeDB } from "./import.ts";
import { databaseFunction } from "./tools.ts";
import dotenv from "dotenv";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { llmSystemPrompt } from "./prompt.ts";
import type { AIMessage, ToolMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import { waitForDebugger } from "inspector";
dotenv.config();
// initalize data
const databasee = initializeDB("./expense.db");
const tool = databaseFunction(databasee);
const tools = [tool.addexpensive, tool.getExpense, tool.generateChart];
//========================================================
const toolNode = new ToolNode(tools);
//========================================================
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
});
//----------------------------------LLM NODE ---------------------
async function LLMnode(state: typeof MessagesAnnotation.State) {
  const llmwithTool = llm.bindTools([
    tool.addexpensive,
    tool.getExpense,
    tool.generateChart,
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
async function condition1(state: typeof MessagesAnnotation.State) {
  const lastmessage = state.messages.at(-1) as AIMessage;
  if (lastmessage.tool_calls?.length) {
    return "toolNode";
  }
  return "__end__";
}
async function condition2(state: typeof MessagesAnnotation.State) {
  const lastmessage = state.messages.at(-1) as ToolMessage;
  const messagess = JSON.parse(lastmessage.content as string);

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
const agent = graph.compile({ checkpointer: new MemorySaver() });
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const question = await rl.question("ASK :");
    if (question === "bye") break;
    const finalINoke = await agent.stream(
      {
        messages: [
          {
            role: "human",
            content: question,
          },
        ],
      },
      {
        streamMode: ["messages", "custom"],
        configurable: { thread_id: "1-1-" },
      },
    );
    //============
    for await (const chunk of finalINoke) {
      console.log(`Each Node response :`, chunk);
    }

    //==========
    // console.log(`Ai reply :`);
    // console.log(finalINoke.messages.at(-1)?.content);
    // console.log(finalINoke);
  }
  rl.close();
}
main();
