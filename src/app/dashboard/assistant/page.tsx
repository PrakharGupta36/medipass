/* eslint-disable react-hooks/purity */
"use client";

import { toast } from "@/lib/toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  LockKeyhole,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

// Fluid Awwwards-style Spring Physics
const springPhysics = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.8,
};

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPhysics,
  },
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Array<{ title: string; recordType: string }>;
  isStreaming?: boolean;
};

const suggestions = [
  {
    icon: FileText,
    title: "Summarize my history",
    description: "Give me a brief overview of my medical record",
    prompt: "Can you summarize my overall medical history and major records?",
  },
  {
    icon: Stethoscope,
    title: "Prepare for my next visit",
    description: "Create a medical brief for my doctor",
    prompt:
      "Generate a concise medical brief to share with my physician during my next checkup.",
  },
  {
    icon: History,
    title: "What changed recently?",
    description: "Review recent events in my health timeline",
    prompt:
      "What changes or updates have been logged in my health timeline recently?",
  },
  {
    icon: Search,
    title: "Find a record",
    description: "Find information inside my medical history",
    prompt:
      "Search my records for recent lab reports and diagnostic summaries.",
  },
];

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordDrawerOpen, setRecordDrawerOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSend(textToSend?: string) {
    const query = (textToSend || message).trim();
    if (!query || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsGenerating(true);

    setTimeout(scrollToBottom, 100);

    // Simulate AI Stream Response Grounded in Medical Vault
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your decrypted MediPass Vault records, your recent blood work from August 2026 shows optimal lipid levels and normal HbA1c (5.4%). Your active prescriptions remain updated with no noted adverse interactions.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        citations: [
          { title: "Metabolic Panel - Aug 2026", recordType: "Lab Report" },
          { title: "Current Prescription Index", recordType: "Medication Log" },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
      toast.success("Response generated from encrypted vault");
      setTimeout(scrollToBottom, 100);
    }, 1200);
  }

  function resetChat() {
    setMessages([]);
    setMessage("");
    toast.info("Assistant conversation cleared");
  }

  return (
    <main className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F0EDE6] text-[#121312] selection:bg-[#18392B] selection:text-[#F0EDE6]">
      {/* Dynamic Ambient Grid Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#18392B]/[0.035] blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#121312 1px, transparent 1px), linear-gradient(90deg, #121312 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* ASSISTANT HEADER */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-[#121312]/10 bg-[#F0EDE6]/80 px-3.5 backdrop-blur-xl sm:h-[72px] sm:px-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18392B] text-white shadow-xs sm:h-10 sm:w-10 sm:rounded-xl"
          >
            <Bot size={16} strokeWidth={1.7} className="sm:hidden" />
            <Bot size={18} strokeWidth={1.7} className="hidden sm:block" />
          </motion.div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs font-semibold text-[#121312] sm:text-sm">
                MediPass Assistant
              </h1>
              <span className="hidden rounded-full border border-[#18392B]/15 bg-[#18392B]/5 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#18392B] sm:inline-block">
                Vault Intelligence
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18392B] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#18392B]" />
              </span>
              <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#121312]/50">
                End-to-End Grounded
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={resetChat}
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-[#121312]/10 bg-white/60 p-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#121312]/60 transition hover:bg-white sm:rounded-xl sm:px-3 sm:py-2"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Reset Session</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRecordDrawerOpen(!recordDrawerOpen)}
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#121312]/10 bg-white px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#121312] shadow-xs transition hover:bg-[#18392B] hover:text-[#F0EDE6] sm:rounded-xl sm:px-3 sm:py-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#18392B]" />
            <span className="hidden xs:inline">Record Context</span>
            <span className="xs:hidden">Context</span>
            <ChevronRight
              size={12}
              className={`transition-transform duration-200 ${recordDrawerOpen ? "rotate-90" : ""}`}
            />
          </motion.button>
        </div>
      </header>

      {/* MAIN CHAT & DRAWER STAGE */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <section className="relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
          {/* MESSAGES & EMPTY STATE CONTEXT */}
          <div className="relative min-h-0 flex-1 overflow-y-auto px-3.5 py-4 sm:px-8 sm:py-6 lg:px-12">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                /* EMPTY STATE SUITE */
                <motion.div
                  key="empty-state"
                  variants={containerStagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="mx-auto flex min-h-full max-w-4xl flex-col justify-center py-4 sm:py-6"
                >
                  {/* AI MARK */}
                  <motion.div
                    variants={itemAnim}
                    className="mb-3 flex justify-center sm:mb-5"
                  >
                    <div className="relative flex h-[60px] w-[60px] items-center justify-center sm:h-[76px] sm:w-[76px]">
                      <div className="absolute inset-0 animate-pulse rounded-[20px] border border-[#18392B]/15 sm:rounded-[25px]" />
                      <div className="absolute inset-[5px] rounded-[17px] border border-[#18392B]/10 sm:inset-[7px] sm:rounded-[21px]" />
                      <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[14px] bg-[#18392B] text-[#F0EDE6] shadow-[0_12px_35px_rgba(24,57,43,0.18)] sm:h-[48px] sm:w-[48px] sm:rounded-[16px]">
                        <Sparkles
                          size={18}
                          strokeWidth={1.5}
                          className="sm:hidden"
                        />
                        <Sparkles
                          size={20}
                          strokeWidth={1.5}
                          className="hidden sm:block"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* TITLE */}
                  <motion.div variants={itemAnim} className="px-2 text-center">
                    <p className="mb-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.22em] text-[#18392B]">
                      Sovereign Medical Intelligence
                    </p>
                    <h2 className="font-serif text-[clamp(1.5rem,5vw,3.25rem)] leading-[1.1] tracking-[-0.035em]">
                      How can I query your
                      <br className="hidden xs:inline" /> encrypted record?
                    </h2>
                    <p className="mx-auto mt-2.5 max-w-[520px] text-[11px] leading-5 text-[#121312]/60 sm:mt-4 sm:text-sm sm:leading-6">
                      Queries remain zero-knowledge, strictly referencing your
                      verified medical history, diagnostic reports, and current
                      prescriptions.
                    </p>
                  </motion.div>

                  {/* SUGGESTIONS GRID */}
                  <motion.div
                    variants={containerStagger}
                    className="mx-auto mt-6 grid w-full max-w-3xl gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3"
                  >
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon;
                      return (
                        <motion.button
                          key={suggestion.title}
                          variants={itemAnim}
                          whileHover={{ y: -3, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSend(suggestion.prompt)}
                          type="button"
                          className="group flex min-h-[64px] items-center gap-3 rounded-xl border border-[#121312]/10 bg-white/50 p-3 text-left shadow-xs backdrop-blur-sm transition-all hover:border-[#18392B]/20 hover:bg-white hover:shadow-[0_10px_30px_rgba(18,19,18,0.04)] sm:min-h-[72px] sm:rounded-2xl sm:p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18392B]/[0.07] text-[#18392B] transition-colors group-hover:bg-[#18392B] group-hover:text-white sm:h-10 sm:w-10 sm:rounded-xl">
                            <Icon
                              size={16}
                              strokeWidth={1.7}
                              className="sm:hidden"
                            />
                            <Icon
                              size={18}
                              strokeWidth={1.7}
                              className="hidden sm:block"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-[#121312] sm:text-[12px]">
                              {suggestion.title}
                            </p>
                            <p className="mt-0.5 truncate text-[9px] leading-3.5 text-[#121312]/50 sm:text-[10px] sm:leading-4">
                              {suggestion.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ) : (
                /* CHAT STREAM LIST */
                <motion.div
                  key="chat-list"
                  variants={containerStagger}
                  initial="hidden"
                  animate="show"
                  className="mx-auto max-w-3xl space-y-4 pb-6 sm:space-y-6"
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={itemAnim}
                      className={`flex gap-2.5 sm:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#18392B] text-white shadow-xs sm:h-8 sm:w-8 sm:rounded-xl">
                          <Bot size={14} className="sm:hidden" />
                          <Bot size={15} className="hidden sm:block" />
                        </div>
                      )}

                      <div
                        className={`relative max-w-[90%] rounded-2xl p-3.5 sm:max-w-[85%] sm:p-5 ${
                          msg.role === "user"
                            ? "bg-[#18392B] text-[#F0EDE6] shadow-sm"
                            : "border border-[#121312]/10 bg-white/80 backdrop-blur-md shadow-xs"
                        }`}
                      >
                        <p className="text-xs leading-relaxed sm:text-sm">
                          {msg.content}
                        </p>

                        {/* Citations Grounding Badge */}
                        {msg.citations && (
                          <div className="mt-3 border-t border-[#121312]/10 pt-2.5 sm:mt-4 sm:pt-3">
                            <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40">
                              Grounded In Vault Records:
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5">
                              {msg.citations.map((cite, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1 rounded-md bg-[#F0EDE6] px-2 py-0.5 font-mono text-[8px] font-medium text-[#18392B] sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[9px]"
                                >
                                  <FileText size={10} />
                                  <span>{cite.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <span
                          className={`mt-1.5 block font-mono text-[8px] sm:mt-2 ${
                            msg.role === "user"
                              ? "text-[#F0EDE6]/50 text-right"
                              : "text-[#121312]/30"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.role === "user" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#121312]/10 text-[#121312] sm:h-8 sm:w-8 sm:rounded-xl">
                          <User size={14} className="sm:hidden" />
                          <User size={15} className="hidden sm:block" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Streaming Loader Bubble */}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 sm:gap-3"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#18392B] text-white sm:h-8 sm:w-8 sm:rounded-xl">
                        <Bot size={14} className="sm:hidden" />
                        <Bot size={15} className="hidden sm:block" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl border border-[#121312]/10 bg-white px-3.5 py-2.5 shadow-xs sm:px-4 sm:py-3">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#18392B]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#18392B] [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#18392B] [animation-delay:0.4s]" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatBottomRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COMPOSER INPUT */}
          <div className="relative shrink-0 border-t border-[#121312]/10 bg-[#F0EDE6]/90 p-3 backdrop-blur-xl sm:p-4">
            <div className="mx-auto max-w-3xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div className="overflow-hidden rounded-xl border border-[#121312]/15 bg-white shadow-xs transition-all focus-within:border-[#18392B] focus-within:shadow-sm sm:rounded-2xl">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about medical history, medications, or lab diagnostics..."
                    rows={2}
                    className="block min-h-[52px] w-full resize-none bg-transparent px-3 pt-2.5 text-xs text-[#121312] outline-none placeholder:text-[#121312]/30 sm:min-h-[64px] sm:px-4 sm:pt-3.5 sm:text-sm"
                  />

                  <div className="flex items-center justify-between border-t border-[#121312]/5 px-2.5 py-1.5 sm:px-3 sm:py-2">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          toast.info("Record upload context drawer coming soon")
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-[#121312]/40 hover:bg-[#121312]/5 hover:text-[#121312] sm:h-7 sm:w-7"
                      >
                        <Plus size={15} />
                      </motion.button>
                      <div className="hidden items-center gap-1.5 xs:flex">
                        <LockKeyhole size={10} className="text-[#18392B]" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#121312]/40">
                          Encrypted Session
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!message.trim() || isGenerating}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#18392B] text-white shadow-xs transition hover:bg-[#122A20] disabled:cursor-not-allowed disabled:bg-[#121312]/10 disabled:text-[#121312]/30 sm:h-8 sm:w-8 sm:rounded-xl"
                    >
                      <ArrowUp
                        size={14}
                        strokeWidth={2}
                        className="sm:hidden"
                      />
                      <ArrowUp
                        size={15}
                        strokeWidth={2}
                        className="hidden sm:block"
                      />
                    </motion.button>
                  </div>
                </div>
              </form>

              <div className="mt-1.5 flex items-center justify-center gap-1.5 font-mono text-[7px] uppercase tracking-wider text-[#121312]/30 sm:mt-2 sm:gap-2 sm:text-[8px]">
                <span>Zero Knowledge AI</span>
                <span>•</span>
                <span>Not Medical Advice</span>
              </div>
            </div>
          </div>
        </section>

        {/* SIDE RECORD CONTEXT DRAWER */}
        <AnimatePresence>
          {recordDrawerOpen && (
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={springPhysics}
              className="absolute right-0 top-0 z-30 h-full w-full border-l border-[#121312]/10 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl sm:w-80 sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-[#121312]/10 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#18392B]" />
                  <h3 className="font-serif text-sm font-semibold text-[#121312]">
                    Active Record Scope
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRecordDrawerOpen(false)}
                  className="rounded-lg p-1 text-[#121312]/40 hover:bg-[#121312]/5 hover:text-[#121312]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
                <p className="font-mono text-[8px] uppercase tracking-wider text-[#121312]/40 sm:text-[9px]">
                  Grounded Vault Categories
                </p>

                {[
                  {
                    label: "Lab Diagnostic Panel",
                    count: "14 Records",
                    status: "Active",
                  },
                  {
                    label: "Prescription Index",
                    count: "3 Medications",
                    status: "Active",
                  },
                  {
                    label: "Immunization History",
                    count: "8 Vaccines",
                    status: "Active",
                  },
                  {
                    label: "Physician Consult Notes",
                    count: "5 Briefs",
                    status: "Active",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[#121312]/10 bg-[#F0EDE6]/50 p-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#121312]">
                        {item.label}
                      </p>
                      <p className="font-mono text-[9px] text-[#121312]/40">
                        {item.count}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#18392B]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#18392B]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
