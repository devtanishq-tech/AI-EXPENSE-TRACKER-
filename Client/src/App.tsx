import { useState } from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
export type Message = {
  role: string;
  content: string;
};
function App() {
  const [messages, setmessages] = useState<Message[]>([]);
  const handleSendMessage = (messages: string) => {
    setmessages((prev) => [
      ...prev,
      {
        role: "user",
        content: messages,
      },
    ]);
  };
  return (
    <>
      <div className="h-screen bg-[#0b0a12] text-white flex flex-col">
        <Navbar />

        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </>
  );
}

export default App;
