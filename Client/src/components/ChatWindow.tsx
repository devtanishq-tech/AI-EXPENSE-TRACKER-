import { useEffect, useRef, useState } from "react";
import type { Message } from "../App";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Expensechart } from "./Expensechart";

type ChatWindowProps = {
  messages: Message[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  const [openToolIndex, setOpenToolIndex] = useState<number | null>(null);
  const messageScrool = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messageScrool.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
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

              {/* ================= TOOLCall Result  ================= */}
              {message.role === "toolCall" && (
                <div className="flex justify-start">
                  <div className="ml-12 w-full max-w-[90%] space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenToolIndex((current) =>
                          current === index ? null : index,
                        )
                      }
                      className="group inline-flex max-w-full items-center gap-2 rounded-lg border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-left text-sm text-orange-100 shadow-sm shadow-black/20 transition hover:border-orange-300/60 hover:bg-orange-500/15"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-400/15 text-orange-300">
                        {openToolIndex === index ? "-" : "+"}
                      </span>

                      <span className="min-w-0 truncate">
                        Information fetched from{" "}
                        <span className="font-semibold text-orange-300">
                          {message.toolname}
                        </span>
                      </span>

                      <span className="shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                        Tool
                      </span>
                    </button>

                    {openToolIndex === index && message.args && (
                      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Arguments
                        </div>

                        <pre className="text-xs text-gray-400 bg-black/20 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(message.args, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/*----------------------------------Tool Result ---------------------------*/}
              {message.role === "toolResult" && (
                <div className="flex justify-start">
                  <div className="ml-12 w-full max-w-[90%] space-y-2">
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                      {/*------------------tool Header --------------*/}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/20 text-green-400">
                          ✓
                        </span>

                        <span className="text-sm text-green-100">
                          Tool result from{" "}
                          <span className="font-semibold text-green-400">
                            {message.toolname}
                          </span>
                        </span>

                        <span className="rounded-md border border-green-500/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-green-400">
                          Result
                        </span>
                      </div>
                      {/*----------------------------------------------------------*/}
                      {/* ================= CHART ================= */}

                      <div>
                        <div className="text-xs text-green-500/70 mb-1">
                          Result
                        </div>

                        <pre className="text-xs text-green-100 bg-black/20 rounded-lg p-3 overflow-x-auto">
                          {JSON.stringify(message.result, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <br></br>
                    <br></br>
                    {message.toolname === "generateChart" && (
                      <div className="mb-4">
                        <Expensechart
                          data={message.result.data}
                          labelKey={message.result.labelKey}
                        />
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
          <div ref={messageScrool} />
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
