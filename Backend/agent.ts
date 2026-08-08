import { MessagesAnnotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

const graph = new StateGraph(MessagesAnnotation);
async function LLMnode(state: typeof MessagesAnnotation.State) {}
