import { tool } from "@langchain/core/tools";
import { date, success, z } from "zod";
import { initializeDB } from "./import";
import { Database } from "bun:sqlite";
import { da } from "zod/locales";
//============================================//
export function databaseFunction(Database: Database) {
  const addexpensive = tool(
    async ({ title, amount }) => {
      // inside the add expensive tool , we need to sql lite database , to insert some value
      const date = new Date().toISOString().split("T")[0];
      console.log(date);
      const query = Database.prepare(
        `INSERT INTO expense (title,amount,date) VALUES (?,?,?)`,
      );
      query.run(title, amount, date);
      console.log(amount);
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
  //======================get tool ..=========================
  const getExpense = tool(
    async ({ from, to }) => {
      const query = Database.prepare(
        `SELECT * FROM expense WHERE date BETWEEN ? AND ?`,
      );

      const row = query.all(from, to);
      console.log(`Fetched data from database -`, row);
      return JSON.stringify(row);
    },
    {
      name: "getExpense",

      description: `
Use this tool to fetch the user's expenses from the SQLite database
for a specific date range.

The tool returns all expenses whose date is between the provided
"from" and "to" dates, including both dates.

Use this tool when the user asks to:
- view or list their expenses
- see expenses for a specific day
- see expenses between two dates
- check their spending for a date range
- retrieve previously stored expenses

The dates must be provided in YYYY-MM-DD format.
For a single day, use the same date for both "from" and "to".
`,
      schema: z.object({
        from: z
          .string()
          .describe(
            "Start date of the expense search range in YYYY-MM-DD format. This date is included in the search.",
          ),

        to: z
          .string()
          .describe(
            "End date of the expense search range in YYYY-MM-DD format. This date is included in the search.",
          ),
      }),
    },
  );
  return {
    addexpensive,
    getExpense,
  };
}
