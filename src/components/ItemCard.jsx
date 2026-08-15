import { useState } from "react";
import {
  MapPin,
  Calendar,
  Sparkles,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Clock,
  UserCheck,
  Eye,
  Tag
} from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const ItemCard = ({
  item,
  currentUser,
  onSelect,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport
}) => {
  const [imgError, setImgError] = useState(false);
  const isLost = item.type === "lost";
  const isReturned = item.status === "returned";
  const isClaimed = item.status === "claimed";
  const posterTag = getUserTag(item.postedBy);
  const posterHtmlId = getUserHtmlId(item.postedBy);

  return (
    <div
      id={`item-card-${item.id}`}
      className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
    >
      {/* Image Header with Interactive Badges */}
      <div
        className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onSelect(item)}
      >
        <img
          src={
            imgError
              ? "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
              : item.photoUrl
          }
          alt={item.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide uppercase shadow-md ${
              isLost
                ? "bg-rose-600/90 text-white border border-rose-500/50"
                : "bg-emerald-600/90 text-white border border-emerald-500/50"
            }`}
          >
            {item.type}
          </span>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700 shadow-md">
            {item.category}
          </span>
        </div>

        {/* Right Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {item.status === "expired" ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 backdrop-blur-md shadow-md">
              Expired
            </span>
          ) : item.status === "archived" ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 text-slate-500 border border-slate-800 backdrop-blur-md shadow-md">
              Archived
            </span>
          ) : isReturned ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white flex items-center gap-1 shadow-md border border-indigo-400/40">
              <CheckCircle2 className="w-3 h-3" /> Returned
            </span>
          ) : isClaimed ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md font-extrabold">
              <Clock className="w-3 h-3" /> Claimed
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-md">
              Active
            </span>
          )}
        </div>

        {/* Hover Quick View Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] pointer-events-none">
          <span className="px-3.5 py-1.5 bg-slate-900/90 text-slate-100 border border-slate-700 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Inspect Details
          </span>
        </div>

        {/* QR Code Tag Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQR(item);
          }}
          className="absolute bottom-3 right-3 p-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all backdrop-blur-md flex items-center gap-1 text-[11px] shadow-md font-semibold z-10"
          title="Generate / View Smart QR Tag"
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[10px] hidden sm:inline">QR Tag</span>
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            onClick={() => onSelect(item)}
            className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {item.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Date Info */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-slate-400 text-[10px] font-medium truncate max-w-[85px]">
                by {item.postedBy.name}
              </span>
              <span
                id={`${posterHtmlId}-${item.id}`}
                className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold rounded-md flex items-center gap-0.5"
                title={`User Tag: ${posterTag}`}
              >
                <UserCheck className="w-2.5 h-2.5 text-cyan-400" />
                {posterTag}
              </span>
              {item.postedBy.email &&
              (item.postedBy.email.toLowerCase().endsWith(".ac.in") ||
                item.postedBy.email.toLowerCase().endsWith(".edu")) ? (
                <span
                  className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold rounded flex items-center gap-0.5"
                  title="Verified Campus Student"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  .edu
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Tags Pills */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/80"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* AI Match Button */}
          <button
            onClick={() => onOpenMatch(item)}
            className="flex-1 py-1.5 px-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            title="Compare with opposite items using Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Match</span>
          </button>

          {/* Claim Button */}
          {item.status === "active" && item.postedBy.id !== currentUser.id && (
            <button
              onClick={() => onOpenClaim(item)}
              className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Claim</span>
            </button>
          )}

          {/* Report Button */}
          <button
            onClick={() => onReport(item)}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
            title="Report item or abuse"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
