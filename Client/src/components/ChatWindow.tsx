import type { Message } from "../App";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatWindowProps = {
  messages: Message[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        // ================= EMPTY STATE =================
        <div className="h-full flex items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center">
            {/* Logo */}
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl">⚡</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold mb-3">
              How can I help you today?
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
              Ask me anything, and I'll do my best to assist you with
              information, analysis, and creative solutions.
            </p>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SuggestionCard
                icon="💡"
                title="Get ideas"
                description="Brainstorm creative solutions"
              />

              <SuggestionCard
                icon="📊"
                title="Analyze data"
                description="Extract insights from information"
              />

              <SuggestionCard
                icon="✍️"
                title="Write content"
                description="Create engaging text and copy"
              />

              <SuggestionCard
                icon="🔧"
                title="Solve problems"
                description="Find answers to your questions"
              />
            </div>
          </div>
        </div>
      ) : (
        // ================= MESSAGES =================
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {/* ================= USER MESSAGE ================= */}
              {message.role === "user" && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-orange-500 px-4 py-3">
                    {message.content}
                  </div>
                </div>
              )}

              {/* ================= TOOL MESSAGE ================= */}
              {message.role === "tool" && (
                <div className="flex justify-start">
                  <div className="ml-12 max-w-[90%] rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
                    {/* Tool Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <p> 🤖----- Information Fetched from</p>
                      <hr></hr>
                      <span className="text-orange-400">🔧</span>

                      <span className="text-sm font-semibold text-orange-300">
                        {message.toolname}
                      </span>

                      <span className="text-xs text-gray-500">Tool</span>
                    </div>

                    {/* Tool Arguments */}
                    {message.args && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Arguments
                        </div>

                        <pre className="text-xs text-gray-400 bg-black/20 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(message.args, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Tool Result */}
                    {message.result && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Result</div>

                        <pre className="text-xs text-gray-300 bg-black/20 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(message.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= AI MESSAGE ================= */}
              {message.role === "ai" && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[90%]">
                    {/* AI LOGO */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
                      <span className="text-lg">⚡</span>
                    </div>

                    {/* AI RESPONSE */}
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type SuggestionCardProps = {
  icon: string;
  title: string;
  description: string;
};

function SuggestionCard({ icon, title, description }: SuggestionCardProps) {
  return (
    <button
      type="button"
      className="text-left rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06] hover:border-white/20"
    >
      <div className="text-xl mb-3">{icon}</div>

      <h3 className="text-sm font-semibold mb-1">{title}</h3>

      <p className="text-xs text-gray-500">{description}</p>
    </button>
  );
}

export default ChatWindow;
