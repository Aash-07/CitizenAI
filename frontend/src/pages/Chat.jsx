import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Bot, User as UserIcon, FileText, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ErrorBanner from "../components/ui/ErrorBanner";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { sendChatMessage, getErrorMessage } from "../lib/api";
import { SCHEME_META, slugify } from "../data/schemes";

const STARTER_PROMPTS = Object.values(SCHEME_META).map((m) => m.sampleQuestion);

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  // Scheme cards link here as /chat?scheme=<slug>; match it back to a sample question.
  const schemeSlug = searchParams.get("scheme");
  const schemeName = Object.keys(SCHEME_META).find((name) => slugify(name) === schemeSlug);
  const initialPrompt = schemeName ? SCHEME_META[schemeName].sampleQuestion : "";

  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content:
        "Hi! I'm the CitizenAI assistant. Ask me about PM-KISAN, PM-JAY, NSP scholarships, or Mudra loans, and I'll answer from the official guideline documents.",
    },
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const message = text.trim();
    if (!message || loading) return;
    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    try {
      // Backend contract: POST /chat { message } -> { answer, sources: [{ pdf, page }] }
      const data = await sendChatMessage(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources || [] },
      ]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Chat</h1>
          <p className="text-sm text-slate-500">
            Answers are grounded in official scheme documents, with sources cited.
          </p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} userName={user?.name} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 pl-10">
              <Spinner label="Thinking…" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 p-3">
            <span className="flex w-full items-center gap-1 text-xs font-medium text-slate-400">
              <Sparkles className="h-3.5 w-3.5" /> Try asking
            </span>
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:bg-brand-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 pt-3 sm:px-6">
            <ErrorBanner message={error} offline />
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-slate-100 p-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about eligibility, documents needed, how to apply…"
            className="max-h-32 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
          />
          <Button type="submit" disabled={!input.trim()} loading={loading} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

function ChatBubble({ message, userName }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-slate-200 text-slate-700" : "bg-brand-600 text-white"
        }`}
        aria-hidden="true"
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>
      <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
            isUser ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-800"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.sources?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.sources.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-slate-500 ring-1 ring-inset ring-slate-200"
              >
                <FileText className="h-3 w-3" /> {s.pdf}
                {s.page != null ? `, p.${s.page}` : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
