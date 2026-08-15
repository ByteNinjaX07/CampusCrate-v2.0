import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  QrCode,
  ShieldAlert,
  HelpCircle,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Lock
} from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const ItemDetailModal = ({
  item,
  currentUser,
  claims = [],
  onClose,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport,
  onOpenThreadChat
}) => {
  if (!item) return null;
  const isLost = item.type === "lost";
  const existingClaim = claims.find(
    (c) => c.itemId === item.id && (c.claimantId === currentUser.id || c.posterId === currentUser.id)
  );
  const isPoster = item.postedBy.id === currentUser.id;
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-900">

        {
    /* Modal Header */
  }
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${isLost ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
  >
              {item.type}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800">
              {item.category}
            </span>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Modal Body */
  }
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {
    /* Photo Showcase */
  }
          <div className="h-64 sm:h-80 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
            <img
    src={item.photoUrl}
    alt={item.title}
    className="w-full h-full object-cover"
  />
            <button
    onClick={() => onOpenQR(item)}
    className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-indigo-700 rounded-xl border border-slate-200 backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold shadow-sm"
  >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Smart QR Tag</span>
            </button>
          </div>

          {
    /* Title & Posted By */
  }
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <strong className="text-slate-800">{item.location}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>{item.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Posted by <strong className="text-slate-800">{item.postedBy.name}</strong></span>
                <span
                  id={getUserHtmlId(item.postedBy)}
                  className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[10px] rounded"
                  title={`User ID Tag: ${getUserTag(item.postedBy)}`}
                >
                  {getUserTag(item.postedBy)}
                </span>
              </span>
            </div>
          </div>

          {
    /* Direct Messaging & Claim Status Banner */
  }
          <div className={`p-4 rounded-xl border space-y-2 ${existingClaim ? "bg-indigo-50/90 border-indigo-200 text-indigo-950" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {existingClaim ? <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Lock className="w-4 h-4 text-slate-400 shrink-0" />}
                <span className="font-bold text-xs">
                  {existingClaim ? "\u{1F4AC} Direct Messaging Unlocked (Claim Active)" : "\u{1F512} Messaging System Locked"}
                </span>
              </div>

              {existingClaim ? <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${existingClaim.status === "approved" ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"}`}>
                  Status: {existingClaim.status}
                </span> : <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                  Claim Required
                </span>}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {existingClaim ? `Verification claim initiated on ${new Date(existingClaim.createdAt).toLocaleDateString()}. You can chat directly with the item ${isPoster ? "claimant" : "finder"} to coordinate safe campus handover.` : `Direct chat between finder and claimant is enabled strictly after a claim is initiated to prevent spam and verify identity.`}
            </p>

            {existingClaim && onOpenThreadChat && <button
    onClick={() => {
      onClose();
      onOpenThreadChat(existingClaim);
    }}
    className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
  >
                <MessageSquare className="w-4 h-4" />
                <span>Open Direct Chat Thread</span>
              </button>}
          </div>

          {
    /* Identity & Campus Security Check Card */
  }
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? "bg-emerald-50/80 border-emerald-200 text-emerald-950" : "bg-amber-50/80 border-amber-200 text-amber-950"}`}>
            <div className="p-2 bg-white rounded-lg border shadow-xs shrink-0 mt-0.5">
              {item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ShieldAlert className="w-5 h-5 text-amber-600" />}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? "Verified Campus Email (.ac.in / .edu)" : "Unverified Email / Guest Account"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
                  {item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? "Official Campus Identity Verified" : "Exercise Caution"}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu") ? `Poster (${item.postedBy.email}) is authenticated using an accredited university domain. Always meet at campus security posts or public library desks.` : `Poster (${item.postedBy.email}) logged in via personal or unverified email. To prevent fake ID claims, verify ownership and exchange items strictly at campus security desks.`}
              </p>
            </div>
          </div>

          {
    /* Description */
  }
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details & Description</h3>
            <p className="text-sm text-slate-800 leading-relaxed">{item.description}</p>
          </div>

          {
    /* Claim Verification Question Box */
  }
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-1">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Finder's Ownership Verification Question:
            </h4>
            <p className="text-xs text-slate-800 font-medium italic">
              "{item.claimQuestion || "Please describe any distinguishing stickers, scratches, or serial details."}"
            </p>
          </div>

          {
    /* Tags */
  }
          {item.tags && item.tags.length > 0 && <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">Tags & Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, idx) => <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg">
                    #{t}
                  </span>)}
              </div>
            </div>}

        </div>

        {
    /* Modal Footer Actions */
  }
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
    onClick={() => {
      onClose();
      onReport(item);
    }}
    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-all"
    title="Report Item"
  >
            <ShieldAlert className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
    onClick={() => {
      onClose();
      onOpenMatch(item);
    }}
    className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
  >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Run AI Match</span>
            </button>

            {item.status === "active" && !isPoster && !existingClaim && <button
    onClick={() => {
      onClose();
      onOpenClaim(item);
    }}
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
  >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Initiate Claim & Unlock Chat</span>
              </button>}

            {existingClaim && onOpenThreadChat && <button
    onClick={() => {
      onClose();
      onOpenThreadChat(existingClaim);
    }}
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
  >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Chat</span>
              </button>}
          </div>
        </div>

      </div>
    </div>;
};
