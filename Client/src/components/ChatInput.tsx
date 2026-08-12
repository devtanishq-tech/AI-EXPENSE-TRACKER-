import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend(trimmedMessage);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full px-4 pb-5 pt-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 focus-within:border-white/20">
          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How are you?"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center hover:opacity-90 transition"
          >
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
