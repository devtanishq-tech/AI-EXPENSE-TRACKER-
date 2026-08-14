import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export type Message = {
  role: string;
  content: string;
};

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

      onmessage(event) {
        console.log("Event type:", event.event);
        console.log("Data:", event.data);
        console.log("ID:", event.id);
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
