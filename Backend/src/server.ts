import express from "express";
import cors from "cors";
import { agents } from "./agent";
const app = express();
app.use(express.json());
app.use(cors());
const port = 8080;
app.get("/", (req, res) => {
  res.json("Hi there ");
});
app.get("/chat", (req, res) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
  });
  setInterval(() => {
    res.write("event:PING1\n");
    res.write("data: Fuck You! \n\n");
  }, 1000);
});
//-============== this is request where we are sending to the llm /====================
app.post("/chat/postrequest", async (req, res) => {
  const bodydata = req.body;
  const query = bodydata?.query;
  res.writeHead(200, {
    "content-type": "text/event-stream",
  });
  const finalINoke = await agents.stream(
    {
      messages: [
        {
          role: "human",
          content: query,
        },
      ],
    },
    {
      streamMode: ["messages"],
      configurable: { thread_id: "1-1-" },
    },
  );
  for await (const [eventype, chunks] of finalINoke) {
    console.log(`EventType:`, eventype);
    console.log(`Chunks:`, chunks[0].content);
    let messages = {
      type: "ai",
      payload: chunks[0].content,
    };
    res.write(`end:${eventype}\n`);
    res.write(`data:${JSON.stringify(messages)}\n\n`);
  }
  res.end();
});
app.listen(port, () => {
  console.log(`Server has started on ${port}`);
});
