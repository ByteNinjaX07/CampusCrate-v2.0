import { useState } from "react";
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
  Lock,
  Share2,
  Copy,
  ExternalLink
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
  const [copied, setCopied] = useState(false);
  if (!item) return null;

  const isLost = item.type === "lost";
  const existingClaim = claims.find(
    (c) =>
      c.itemId === item.id &&
      (c.claimantId === currentUser.id || c.posterId === currentUser.id)
  );
  const isPoster = item.postedBy.id === currentUser.id;
  const isEdu =
    item.postedBy.email &&
    (item.postedBy.email.toLowerCase().endsWith(".ac.in") ||
      item.postedBy.email.toLowerCase().endsWith(".edu"));

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide border ${
                isLost
                  ? "bg-rose-600/30 text-rose-300 border-rose-500/40"
                  : "bg-emerald-600/30 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {item.type}
            </span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="Copy link to item"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Photo Showcase */}
          <div className="h-64 sm:h-80 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative group">
            <img
              src={item.photoUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={() => onOpenQR(item)}
              className="absolute bottom-3 right-3 px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-cyan-300 rounded-xl border border-cyan-500/40 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold shadow-lg transition-all"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Smart QR Tag</span>
            </button>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{item.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Posted by <strong className="text-slate-200">{item.postedBy.name}</strong>
                </span>
                <span
                  id={getUserHtmlId(item.postedBy)}
                  className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-cyan-400 font-mono font-bold text-[10px] rounded"
                  title={`User ID Tag: ${getUserTag(item.postedBy)}`}
                >
                  {getUserTag(item.postedBy)}
                </span>
              </span>
            </div>
          </div>

          {/* Direct Messaging & Claim Status Banner */}
          <div
            className={`p-4 rounded-2xl border space-y-2.5 ${
              existingClaim
                ? "bg-indigo-950/40 border-indigo-500/40 text-slate-100"
                : "bg-slate-950/60 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {existingClaim ? (
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className="font-bold text-xs text-slate-200">
                  {existingClaim
                    ? "💬 Direct Real-Time Chat Unlocked"
                    : "🔒 Direct Chat Privacy Lock"}
                </span>
              </div>

              {existingClaim ? (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    existingClaim.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  }`}
                >
                  Status: {existingClaim.status}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  Claim Required
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {existingClaim
                ? `Verification claim initiated on ${new Date(
                    existingClaim.createdAt
                  ).toLocaleDateString()}. You can chat directly with the item ${
                    isPoster ? "claimant" : "finder"
                  } to coordinate safe handover.`
                : "Direct chat between finder and claimant is enabled strictly after submitting an ownership answer to prevent spam."}
            </p>

            {existingClaim && onOpenThreadChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenThreadChat(existingClaim);
                }}
                className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Direct Chat Thread</span>
              </button>
            )}
          </div>

          {/* Student Identity Trust Check */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isEdu
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                : "bg-amber-950/30 border-amber-500/30 text-amber-200"
            }`}
          >
            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0 mt-0.5">
              {isEdu ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">
                  {isEdu
                    ? "Verified Campus Email (.edu / .ac.in)"
                    : "Standard Campus Account"}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isEdu
                  ? `Poster (${item.postedBy.email}) is authenticated using an accredited university domain. Always meet at campus security desks or the central library.`
                  : `Always meet in well-lit public campus hubs like the Student Union or Library front counter.`}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Item Details & Description
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{item.description}</p>
          </div>

          {/* Verification Question Preview */}
          <div className="bg-indigo-950/30 p-4 rounded-2xl border border-indigo-900/40 space-y-1.5">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Finder's Ownership Verification Question:
            </h4>
            <p className="text-xs text-slate-200 font-medium italic">
              "{item.claimQuestion ||
                "Please describe any distinguishing stickers, scratches, or serial details."}"
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Tags & Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onReport(item);
            }}
            className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all"
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
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Run AI Match</span>
            </button>

            {item.status === "active" && !isPoster && !existingClaim && (
              <button
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Initiate Claim</span>
              </button>
            )}

            {existingClaim && onOpenThreadChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenThreadChat(existingClaim);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
