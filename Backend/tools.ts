import { tool } from "@langchain/core/tools";
import { success, z } from "zod";
const addexpensive = tool(
  async () => {
    return JSON.stringify({ status: success });
  },
  {
    name: "addexpense",
    description: " used to add expense in the database",
    schema: z.object({
      title: z.string().describe("Title of the expense we need to add "),
      amount: z.number().describe("the amount spend"),
    }),
  },
);
