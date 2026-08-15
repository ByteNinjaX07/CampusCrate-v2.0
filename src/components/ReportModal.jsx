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
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-slate-900">

        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-950">Report Listing</h3>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">Reason for Report *</label>
            <select
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
              <option value="Inappropriate content or spam">Inappropriate content or spam</option>
              <option value="Fake or misleading post">Fake or misleading post</option>
              <option value="Harassment or abuse">Harassment or abuse</option>
              <option value="Item already returned/resolved">Item already returned/resolved</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-800 block mb-1">Additional Details</label>
            <textarea
    value={details}
    onChange={(e) => setDetails(e.target.value)}
    rows={3}
    placeholder="Provide any context to help moderators review..."
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
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
    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
  >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit Report"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>;
};
