import { useState } from "react";
import { X, HelpCircle, ShieldCheck, Send, Sparkles } from "lucide-react";

export const ClaimModal = ({
  item,
  currentUser,
  onClose,
  onClaimSubmitted
}) => {
  const [answer, setAnswer] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please answer the verification question to prove ownership.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          claimantId: currentUser.id,
          claimantName: currentUser.name,
          claimantEmail: currentUser.email,
          answer,
          additionalNotes
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit claim.");
      }
      const claimData = await res.json();
      onClaimSubmitted(claimData);
      onClose();
    } catch (err) {
      setError(err.message || "Error submitting claim");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Item Ownership Verification</h2>
              <p className="text-xs text-slate-400">Prove ownership for "{item.title}"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
              {error}
            </div>
          )}

          {/* Poster's Verification Question Box */}
          <div className="bg-indigo-950/30 p-4 rounded-2xl border border-indigo-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Finder's Verification Question:</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              "{item.claimQuestion ||
                "Please describe any distinguishing stickers, scratches, or serial details."}"
            </p>
          </div>

          {/* Answer Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-200">Your Verification Answer *</label>
              <button
                type="button"
                onClick={() =>
                  setAnswer(
                    "Has my initials engraved on bottom left corner and student ID card inside sleeve."
                  )
                }
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
              >
                ⚡ Insert Sample Answer
              </button>
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              placeholder="Be as specific as possible (e.g., sticker logos, lock screen wallpaper, specific keychains)..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="font-bold text-slate-200 block mb-1.5">
              Meetup Preference & Availability (Optional)
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. I can meet at the Library Desk or Student Union today after 2 PM."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            🔒 Submitting this claim will unlock an encrypted direct chat thread between you and the item poster.
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Claim & Unlock Chat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
