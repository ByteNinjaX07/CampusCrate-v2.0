import { useState } from "react";
import { X, HelpCircle, ShieldCheck, Send } from "lucide-react";
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
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-900">

        {
    /* Header */
  }
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950">Item Ownership Verification</h2>
              <p className="text-xs text-slate-500">Prove ownership for "{item.title}"</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">

          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>}

          {
    /* Poster's Verification Question Box */
  }
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Finder's Verification Question:</span>
            </div>
            <p className="text-slate-800 text-sm font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-indigo-100">
              "{item.claimQuestion || "Please describe any distinguishing stickers, scratches, or serial details."}"
            </p>
          </div>

          {
    /* Answer Input */
  }
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Your Verification Answer *
            </label>
            <textarea
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    rows={3}
    placeholder="Be as specific as possible (e.g., sticker logos, lock screen wallpaper, specific keychains)..."
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
          </div>

          {
    /* Additional Notes */
  }
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Additional Notes & Meetup Preference (Optional)
            </label>
            <input
    type="text"
    value={additionalNotes}
    onChange={(e) => setAdditionalNotes(e.target.value)}
    placeholder="e.g. I can meet at the Student Union or Library Info Desk today after 3 PM."
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
          </div>

          {
    /* Footer Actions */
  }
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors"
  >
              Cancel
            </button>

            <button
    type="submit"
    disabled={submitting}
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
  >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Claim"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>;
};
