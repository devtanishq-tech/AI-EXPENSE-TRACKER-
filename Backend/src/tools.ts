import { tool } from "@langchain/core/tools";
import { date, string, success, z } from "zod";
import { initializeDB } from "./import";
import { Database } from "bun:sqlite";
import { da } from "zod/locales";
import { group } from "console";
import { TavilySearch } from "@langchain/tavily";
import axios from "axios";
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
      description:
        " Add an expense to the database with a title and amount. Date is set automatically to today.",
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

      description:
        "Fetch expenses between two dates (inclusive), format YYYY-MM-DD. Use the same date for from/to for a single day.",
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
  //=======================================GenerateChart //=========================

  const generateChart = tool(
    async ({ from, to, groupby }) => {
      // inside the add expensive tool , we need to sql lite database , to insert some value
      console.log(`Generating ${groupby} chart from ${from} to ${to}`);
      let dateFormat: string;
      switch (groupby) {
        case "month":
          dateFormat = "%Y-%m";
          break;
        case "week":
          dateFormat = "%Y-W%W";
          break;
        case "day":
          dateFormat = "%Y-%m-%d";
          break;
        default:
          throw new Error("Invalid groupby. Use month, week, or day.");
      }
      const date = new Date().toISOString().split("T")[0];
      const query = Database.prepare(
        `SELECT
          strftime('${dateFormat}', date) AS period,
          SUM(amount) AS total
        FROM expense
        WHERE date BETWEEN ? AND ?
        GROUP BY period
        ORDER BY period`,
      );
      const rows = query.all(from, to);
      console.log(`--------------------------------`);
      console.log(`Row is printed below `);

      console.log(JSON.stringify(rows));
      // const row1 = (rows[0] as rowtype).period;
      // console.log(row1);
      const result = rows.map((current) => {
        return {
          [groupby]: current.period,
          amount: current.total,
        };
      });
      console.log(`------------------------Result data of GenerateCHart`);
      console.log(result);
      console.log(`-------------------------------------------------------`);

      return JSON.stringify({ type: `chart`, data: result, labelKey: groupby });
    },
    {
      name: "generateChart",
      description: `
Return expense totals grouped by day, week, or month for a date range (YYYY-MM-DD).
`,
      schema: z.object({
        to: z.string().describe("End date, YYYY-MM-DD"),
        from: z.string().describe("Start date, YYYY-MM-DD"),
        groupby: z
          .enum(["month", "week", "day"])
          .describe("How to group the data :by month,week or day "),
      }),
    },
  );
  return {
    addexpensive,
    getExpense,
    generateChart,
  };
}
export const webSearchtool = new TavilySearch({
  maxResults: 4,
  topic: "general",
});
async function weather_FNC(city: string) {
  const response = await axios.get(
    " http://api.weatherapi.com/v1/current.json",
    {
      params: {
        key: process.env.weather_api,
        q: city,
      },
    },
  );
  return JSON.stringify({
    type: "weatherChart",
    name: response.data.location.name,
    country: response.data.location.country,
    TemperatureinCelsius: response.data.current.temp_c,
    temperatureINfarenhite: response.data.current.temp_f,
    humidity: response.data.current.humidity,
    condition: response.data.current.humidity,
  });
}
export const weatherTool = tool(
  async ({ city }) => {
    return await weather_FNC(city);
  },
  {
    name: "weather_Fnc",
    description:
      "Get the current weather for a city. Use this only when the user asks about weather, temperature, humidity, or current weather conditions for a specific place.",
    schema: z.object({
      city: z
        .string()
        .describe(
          "The city name to get current weather for, such as 'Delhi', 'Mumbai', or 'London'.",
        ),
    }),
  },
);
