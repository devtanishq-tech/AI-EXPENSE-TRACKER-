import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { fetchEventSource } from "@microsoft/fetch-event-source";
export type Message =
  | {
      role: "ai" | "user";
      content: string;
    }
  | {
      role: "toolCall";
      toolname: string;
      args?: Record<string, any>;
    }
  | {
      role: "toolResult";
      toolname: string;
      result?: any;
    };
//----------- ui Type needed to write here //============
//============================================
export type streamResponse =
  | {
      type: "ai";
      payload: { text: string };
    }
  | {
      type: "tooCall:start";
      payload: {
        name: string;
        args: Record<string, any>;
      };
    }
  | {
      type: "tool:status";
      payload: {
        text: string;
      };
    }
  | {
      type: "tool";
      payload: {
        name: string;
        result: unknown;
      };
    };
//================================================

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const handleSendMessage = async (message: string) => {
    // Add user's message to UI
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    // Send message to backend
    await fetchEventSource("http://localhost:8080/chat/postrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
      }),
      //============================================ this is the updation we do //======================
      onmessage(event) {
        console.log("Event type:", event.event);
        console.log("Event data Printend", event.data);
        let parseData = JSON.parse(event.data) as streamResponse;
        //============ai type //==========
        if (parseData.type === "ai") {
          const textt = parseData.payload.text;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage?.role === "ai") {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: lastMessage.content + textt,
                },
              ];
            }
            // nhi to new message  h to
            return [
              ...prev,
              {
                role: "ai",
                content: textt,
              },
            ];
          });
        }
        if (parseData.type === "tooCall:start") {
          setMessages((prev) => [
            ...prev,
            {
              role: "toolCall",
              toolname: parseData.payload.name,
              args: parseData.payload.args,
            },
          ]);
        }
        if (parseData.type === "tool:status") {
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: parseData.payload.text,
            },
          ]);
        }
        if (parseData.type === "tool") {
          // ================= TOOL RESULT =================
          setMessages((prev) => [
            ...prev,
            {
              role: "toolResult",
              toolname: parseData.payload.name,
              result: parseData.payload.result,
            },
          ]);
        }
        //============data type is
      },
    });
  };

  return (
    <div className="h-screen bg-[#0b0a12] text-white flex flex-col">
      <Navbar />

      <ChatWindow messages={messages} />

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

export default App;
