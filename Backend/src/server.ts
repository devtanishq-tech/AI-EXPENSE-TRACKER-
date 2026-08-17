import express from "express";
import cors from "cors";
import { agents } from "./agent";
import type { streamResponse } from "./type";
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
//=====================================================================================
app.post("/chat/postrequest", async (req, res) => {
  const bodydata = req.body;
  const query = bodydata?.query;
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
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
      streamMode: ["messages", "custom"],
      configurable: { thread_id: "1-1-" },
    },
  );
  for await (const [eventype, chunks] of finalINoke) {
    console.log(`EventType:`, eventype);
    console.log(`Chunks:`, chunks);
    let messages: streamResponse = {} as streamResponse;
    if (eventype === "custom") {
      console.log(`custom event data `);
      console.log(chunks);
      console.log(`custom event data `);
      messages = chunks as streamResponse;
    }
    if (eventype === "messages") {
      const messageChunk = chunks[0];
      console.log(`Message Content :`, messageChunk.content);
      if (chunks[0].type === "ai") {
        messages = {
          type: "ai",
          payload: {
            text: messageChunk.content as string,
          },
        };
      }
    }

    // ================tool calling start //=======================
    // if (chunks[0].type === "tooCall:start") {
    //   messages = {
    //     type: "tooCall:start",
    //     payload:{
    //       name:
    //     }
    //   };
    // }
    res.write(`event:${eventype}\n`);
    res.write(`data:${JSON.stringify(messages)}\n\n`);
  }
  res.end();
});
app.listen(port, () => {
  console.log(`Server has started on ${port}`);
});
