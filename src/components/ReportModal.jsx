import { useState } from "react";
import { X, ShieldAlert, Send } from "lucide-react";

export const ReportModal = ({
  item,
  currentUser,
  onClose,
  onReportSubmitted
}) => {
  const [reason, setReason] = useState("Inappropriate content or spam");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          itemTitle: item.title,
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          reason,
          details
        })
      });
      onReportSubmitted();
      onClose();
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100">
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Report Campus Listing</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-200 block mb-1.5">Reason for Report *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="Inappropriate content or spam" className="bg-slate-900">Inappropriate content or spam</option>
              <option value="Fake or misleading post" className="bg-slate-900">Fake or misleading post</option>
              <option value="Harassment or abuse" className="bg-slate-900">Harassment or abuse</option>
              <option value="Item already returned/resolved" className="bg-slate-900">Item already returned/resolved</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-200 block mb-1.5">Additional Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Provide any context to help moderators review..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
