import { useState, useEffect, useRef } from "react";
import { X, Send, MapPin, CheckCircle2, ShieldCheck, MessageSquare, Sparkles, Bot, Clock } from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const MessagingDrawer = ({
  claim,
  currentUser,
  onClose,
  onStatusChange
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSimulatingReply, setIsSimulatingReply] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (showLoading = false) => {
    if (!claim) return;
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/messages/${claim.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (!claim) return;
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [claim?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!claim) return null;

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: claim.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text
        })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setInputText("");
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSimulateReply = async () => {
    setIsSimulatingReply(true);
    try {
      const isMePoster = claim.posterId === currentUser.id;
      const otherPersonName = isMePoster ? claim.claimantName : "Campus Finder";
      const otherPersonId = isMePoster ? claim.claimantId : claim.posterId;

      const sampleReplies = [
        "Sounds good! I can meet you right outside the Central Library front desk at 3:30 PM today.",
        "Verified! The description matches perfectly. I have handed it to the front counter with reference ID " + claim.id.slice(-4),
        "Thanks for getting back to me! I have my student ID card ready for verification.",
        "Great! Let's do the handover near the Student Union Information Desk."
      ];
      const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

      await new Promise((r) => setTimeout(r, 900));

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: claim.id,
          senderId: otherPersonId,
          senderName: otherPersonName,
          text: randomReply
        })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to simulate reply:", err);
    } finally {
      setIsSimulatingReply(false);
    }
  };

  const isPoster = claim.posterId === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l sm:border border-slate-800 w-full sm:max-w-xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/90 text-white rounded-xl shadow-md border border-indigo-500/40">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 truncate max-w-[200px] sm:max-w-[260px]">
                  {claim.itemTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Encrypted Thread
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isPoster
                  ? `Finder (You) ↔ Claimant (${claim.claimantName})`
                  : `Claimant (You) ↔ Item Finder`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim Status & Actions Bar */}
        <div className="bg-slate-950/50 border-b border-slate-800/80 p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                claim.status === "approved"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : claim.status === "returned"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                  : claim.status === "rejected"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}
            >
              {claim.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPoster && claim.status === "pending" && (
              <>
                <button
                  onClick={() => onStatusChange(claim.id, "approved")}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onStatusChange(claim.id, "rejected")}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            {(claim.status === "approved" || isPoster) && claim.status !== "returned" && (
              <button
                onClick={() => onStatusChange(claim.id, "returned")}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Returned
              </button>
            )}
          </div>
        </div>

        {/* Verification Summary Info Card */}
        <div className="bg-indigo-950/40 p-3 px-4 border-b border-indigo-900/40 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="font-bold text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Claimant Answer:
            </p>
            <span className="text-[10px] text-indigo-300 font-medium bg-slate-900 px-2 py-0.5 rounded border border-indigo-800/60">
              Submitted by {claim.claimantName}
            </span>
          </div>
          <p className="text-slate-200 italic bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 font-medium">
            "{claim.answer}"
          </p>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Connecting real-time chat...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">No messages yet in this thread</p>
              <p className="text-slate-500 max-w-xs mx-auto text-[11px]">
                Say hello or propose a safe campus meetup spot below.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              if (m.isSystem) {
                return (
                  <div
                    key={m.id}
                    className="my-2 text-center text-[11px] text-cyan-300 bg-cyan-950/40 p-2 px-3 rounded-xl border border-cyan-800/50 max-w-md mx-auto font-medium flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{m.text}</span>
                  </div>
                );
              }
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-semibold">
                    <span>{m.senderName}</span>
                    <span
                      id={getUserHtmlId({ id: m.senderId, name: m.senderName })}
                      className="px-1 py-0.2 bg-slate-800 text-cyan-400 font-mono text-[9px] font-bold rounded"
                    >
                      {getUserTag({ id: m.senderId, name: m.senderName })}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-md font-medium"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-md"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Meetup Location Chips & Simulate Reply Action */}
        <div className="p-2.5 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 shrink-0 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> Quick Meet:
            </span>
            <button
              onClick={() =>
                handleSendMessage("📍 Proposal: Let's meet at Central Library Info Desk for the item handover.")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700 font-medium transition-colors"
            >
              📚 Library Desk
            </button>
            <button
              onClick={() =>
                handleSendMessage("📍 Proposal: Let's meet at Student Union Food Court near Starbucks.")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700 font-medium transition-colors"
            >
              🥪 Student Union
            </button>
            <button
              onClick={() =>
                handleSendMessage("Hi! When are you free on campus today for the item handover?")
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg whitespace-nowrap border border-slate-700 font-medium transition-colors"
            >
              ⏰ Check Time
            </button>
          </div>

          <button
            onClick={handleSimulateReply}
            disabled={isSimulatingReply}
            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg whitespace-nowrap border border-cyan-500/40 font-bold transition-all flex items-center gap-1 shrink-0"
            title="Test real-time conversation response"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isSimulatingReply ? "Replying..." : "Simulate Response"}</span>
          </button>
        </div>

        {/* Message Input Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Write a message to coordinate item return..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl shadow-md transition-all"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
