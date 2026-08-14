import express from "express";
import cors from "cors";
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
    res.write("data: Hello there\n\n");
  }, 1000);
});
app.listen(port, () => {
  console.log(`Server has started on ${port}`);
});
