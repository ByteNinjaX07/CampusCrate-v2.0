import { useState, useEffect, useRef } from "react";
import { X, Send, MapPin, CheckCircle2, ShieldCheck, MessageSquare, Sparkles } from "lucide-react";
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
    }, 2500);
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
  const handleQuickMeetup = (spotName) => {
    handleSendMessage(`\u{1F4CD} Safe Meetup Proposal: Let's meet at ${spotName} for item verification & handover.`);
  };
  const isPoster = claim.posterId === currentUser.id;
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-l sm:border border-slate-200 w-full sm:max-w-xl h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900">

        {
    /* Drawer Header */
  }
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-950 truncate max-w-[220px] sm:max-w-[280px]">
                  {claim.itemTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  Claim Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct Thread: {isPoster ? `Finder (You) \u2194 Claimant (${claim.claimantName})` : `Claimant (You) \u2194 Item Finder`}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Claim Status & Workflow Banner */
  }
        <div className="bg-slate-100/90 border-b border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Claim Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${claim.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : claim.status === "returned" ? "bg-blue-50 text-blue-700 border-blue-300" : claim.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>
              {claim.status}
            </span>
          </div>

          {
    /* Action Buttons for Poster / Claimant */
  }
          <div className="flex items-center gap-2">
            {isPoster && claim.status === "pending" && <>
                <button
    onClick={() => onStatusChange(claim.id, "approved")}
    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] shadow-2xs transition-colors"
  >
                  Approve Claim
                </button>
                <button
    onClick={() => onStatusChange(claim.id, "rejected")}
    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-[11px] shadow-2xs transition-colors"
  >
                  Reject
                </button>
              </>}

            {(claim.status === "approved" || isPoster) && claim.status !== "returned" && <button
    onClick={() => onStatusChange(claim.id, "returned")}
    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
  >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Item Returned
              </button>}
          </div>
        </div>

        {
    /* Verification Summary Info Card */
  }
        <div className="bg-indigo-50/60 p-3 px-4 border-b border-indigo-100 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Claimant Answer:
            </p>
            <span className="text-[10px] text-indigo-700 font-medium bg-white px-2 py-0.5 rounded border border-indigo-200">
              Submitted by {claim.claimantName}
            </span>
          </div>
          <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-indigo-100 font-medium">
            "{claim.answer}"
          </p>
          {claim.additionalNotes && <p className="text-slate-600 text-[11px] pt-0.5">
              <strong>Notes:</strong> {claim.additionalNotes}
            </p>}
        </div>

        {
    /* Real-time Messages Body */
  }
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
          {loading ? <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Connecting real-time thread...</span>
            </div> : messages.length === 0 ? <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No messages yet</p>
              <p className="text-slate-400 max-w-xs mx-auto text-[11px]">
                Say hello or propose a safe campus meeting location below.
              </p>
            </div> : messages.map((m) => {
    const isMe = m.senderId === currentUser.id;
    if (m.isSystem) {
      return <div key={m.id} className="my-2 text-center text-[11px] text-slate-600 bg-white p-2 px-3 rounded-xl border border-slate-200 max-w-md mx-auto font-medium shadow-2xs flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{m.text}</span>
                  </div>;
    }
    return <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-semibold">
                    <span>{m.senderName}</span>
                    <span
                      id={getUserHtmlId({ id: m.senderId, name: m.senderName })}
                      className="px-1 py-0.2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[9px] font-bold rounded"
                      title={`Sender ID Tag`}
                    >
                      {getUserTag({ id: m.senderId, name: m.senderName })}
                    </span>
                    {m.senderId === claim.posterId && <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold text-[9px]">Finder</span>}
                    {m.senderId === claim.claimantId && <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold text-[9px]">Claimant</span>}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${isMe ? "bg-indigo-600 text-white rounded-tr-none shadow-2xs font-medium" : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-2xs"}`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>;
  })}
          <div ref={messagesEndRef} />
        </div>

        {
    /* Quick Meetup Locations Suggestion Bar */
  }
        <div className="p-2 px-3 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 shrink-0 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" /> Quick Spots:
          </span>
          <button
    onClick={() => handleQuickMeetup("Library Info Desk")}
    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg whitespace-nowrap border border-slate-200 font-medium text-[11px] transition-colors shadow-2xs"
  >
            📚 Library Desk
          </button>
          <button
    onClick={() => handleQuickMeetup("Campus Security Office")}
    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg whitespace-nowrap border border-slate-200 font-medium text-[11px] transition-colors shadow-2xs"
  >
            🛡️ Security Office
          </button>
          <button
    onClick={() => handleQuickMeetup("Student Union Food Court")}
    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg whitespace-nowrap border border-slate-200 font-medium text-[11px] transition-colors shadow-2xs"
  >
            🍔 Student Union
          </button>
          <button
    onClick={() => handleSendMessage("Hi, when are you available to meet on campus today?")}
    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-indigo-700 rounded-lg whitespace-nowrap border border-indigo-200 font-medium text-[11px] transition-colors shadow-2xs"
  >
            ⏰ Check Availability
          </button>
        </div>

        {
    /* Input Footer */
  }
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
    type="text"
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleSendMessage();
    }}
    placeholder="Write a message to coordinate item return..."
    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
  />
          <button
    onClick={() => handleSendMessage()}
    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-xs transition-all"
    title="Send Message"
  >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>;
};
