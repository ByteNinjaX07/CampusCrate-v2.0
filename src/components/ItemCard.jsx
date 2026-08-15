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
  UserCheck
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
      className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >

      {
    /* Image Header with Badges */
  }
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelect(item)}>
        <img
    src={imgError ? "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80" : item.photoUrl}
    alt={item.title}
    onError={() => setImgError(true)}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />

        {
    /* Top Badges */
  }
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${isLost ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}
  >
            {item.type}
          </span>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 shadow-sm">
            {item.category}
          </span>
        </div>

        {
    /* Right Status Badge */
  }
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {item.status === "expired" ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300 backdrop-blur-md shadow-sm">
              Expired (30d+)
            </span> : item.status === "archived" ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md shadow-sm">
              Archived
            </span> : isReturned ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 text-white flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Returned
            </span> : isClaimed ? <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3" /> Claimed
            </span> : <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 backdrop-blur-md shadow-sm">
              Active
            </span>}
        </div>

        {
    /* QR Code Tag Button */
  }
        <button
    onClick={(e) => {
      e.stopPropagation();
      onOpenQR(item);
    }}
    className="absolute bottom-3 right-3 p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition-all backdrop-blur-md flex items-center gap-1 text-[11px] shadow-sm font-semibold"
    title="View Smart QR Tag"
  >
          <QrCode className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-mono text-[10px] hidden sm:inline">QR Tag</span>
        </button>
      </div>

      {
    /* Card Content Body */
  }
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
    onClick={() => onSelect(item)}
    className="text-base font-bold text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
  >
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {
    /* Location & Date Info */
  }
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate text-slate-700 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-slate-600 text-[10px] font-medium truncate max-w-[90px]">
                by {item.postedBy.name}
              </span>
              <span
                id={`${posterHtmlId}-${item.id}`}
                className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-mono font-bold rounded-md flex items-center gap-0.5 shadow-2xs"
                title={`User ID Tag: ${posterTag} (${item.postedBy.email || 'Campus User'})`}
              >
                <UserCheck className="w-2.5 h-2.5 text-indigo-600" />
                {posterTag}
              </span>
              {item.postedBy.email && (item.postedBy.email.toLowerCase().endsWith(".ac.in") || item.postedBy.email.toLowerCase().endsWith(".edu")) ? (
                <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded flex items-center gap-0.5" title="Verified official campus email (.ac.in/.edu)">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  .ac.in
                </span>
              ) : (
                <span className="px-1 py-0.2 bg-slate-100 text-slate-500 text-[9px] font-semibold rounded" title="Guest / Unverified Personal Email">
                  Guest
                </span>
              )}
            </div>
          </div>
        </div>

        {
    /* Tags Pills */
  }
        {item.tags && item.tags.length > 0 && <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.slice(0, 3).map((tag, idx) => <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/60">
                #{tag}
              </span>)}
            {item.tags.length > 3 && <span className="text-[10px] text-slate-400 self-center">+{item.tags.length - 3}</span>}
          </div>}

        {
    /* Action Buttons Footer */
  }
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">

          {
    /* AI Match Button */
  }
          <button
    onClick={() => onOpenMatch(item)}
    className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
    title="Compare with opposite items using Gemini AI"
  >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Match</span>
          </button>

          {
    /* Claim Button */
  }
          {item.status === "active" && item.postedBy.id !== currentUser.id && <button
    onClick={() => onOpenClaim(item)}
    className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors"
  >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Claim</span>
            </button>}

          {
    /* Report Button */
  }
          <button
    onClick={() => onReport(item)}
    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-all"
    title="Report item or abuse"
  >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
