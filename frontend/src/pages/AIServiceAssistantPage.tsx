import React, { useState } from "react";
import { Link } from "react-router-dom";
import { aiApi } from "../services/aiApi";
import { RecommendedService, AIChatResponse } from "../types";
import { Bot, Send, Sparkles, CheckCircle2, ArrowRight, Shield, Globe, Clock, Building2 } from "lucide-react";

export const AIServiceAssistantPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string; data?: AIChatResponse }[]
  >([
    {
      role: "assistant",
      content:
        "Namaste! I am the **GovConnect AI Assistant**. Tell me about yourself or what government assistance you need in English, Hindi, or Tamil. (e.g. *'I am a student with family income under ₹1.5 Lakhs looking for scholarship schemes'*).",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim() || isProcessing) return;

    const userMessageObj = { role: "user" as const, content: msg };
    setChatHistory((prev) => [...prev, userMessageObj]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      const response: AIChatResponse = await aiApi.chat(msg, selectedLanguage);
      const assistantMessageObj = {
        role: "assistant" as const,
        content: response.reply,
        data: response,
      };
      setChatHistory((prev) => [...prev, assistantMessageObj]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am unable to connect to the AI Service Engine at the moment.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const samplePrompts = [
    "I am a student with low income needing scholarship",
    "मुझे कृषि और फसल सब्सिडी योजना चाहिए (Hindi)",
    "எனக்கு என்ன அரசு திட்டங்கள் கிடைக்கும்? (Tamil)",
    "Senior citizen pension scheme requirements",
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Multi-Lingual Intent & Scheme Discovery Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">AI Government Service Assistant</h1>
          <p className="text-xs text-slate-300">
            Powered by deterministic eligibility evaluation rules to prevent hallucination of government schemes.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200">
          <Globe className="w-4 h-4 text-indigo-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs font-semibold"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
            <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 self-center mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Prompts:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt.split(" (")[0])}
            className="text-xs bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 px-3 py-1.5 rounded-xl shadow-sm font-medium transition"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${item.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  item.role === "user"
                    ? "bg-slate-900 text-amber-400"
                    : "bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md"
                }`}
              >
                {item.role === "user" ? "You" : <Bot className="w-5 h-5 text-white" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-3 text-xs leading-relaxed ${
                  item.role === "user"
                    ? "bg-slate-900 text-slate-100 rounded-tr-none"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className="prose prose-xs max-w-none font-sans"
                />

                {/* Recommendations Grid Cards */}
                {item.data?.recommendations && item.data.recommendations.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                      Matched & Ranked Government Schemes:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.data.recommendations.map((rec) => (
                        <div
                          key={rec.service_id}
                          className="bg-white border border-indigo-100 rounded-xl p-3.5 shadow-sm space-y-2 hover:border-indigo-300 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                              {rec.match_percentage}% Match
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ {rec.eligibility_status}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{rec.title}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{rec.explanation}</p>

                          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                            <span className="text-[10px] text-slate-500 font-semibold">{rec.department_name}</span>
                            <Link
                              to={`/application/apply/${rec.service_id}`}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow flex items-center gap-1 transition"
                            >
                              Apply Scheme <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 text-xs text-slate-500 italic">
              <Bot className="w-4 h-4 animate-spin text-indigo-600" />
              GovConnect AI analyzing query, extracting intent & verifying eligibility rules...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask about government schemes in English, Hindi, or Tamil..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
