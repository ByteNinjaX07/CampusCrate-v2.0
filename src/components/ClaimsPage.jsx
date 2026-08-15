import { MessageSquare, ShieldCheck, Lock, UserCheck, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const ClaimsPage = ({ claims = [], onOpenThreadChat, onSelectItem }) => {
  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-900/40 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Ownership Claim Verification & Chat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Claims & Secure Thread Hub
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Direct real-time messaging between item finders and losers is unlocked upon claim submission. Review submitted verification answers and open encrypted threads to coordinate safe campus handovers.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            Active Claim Threads ({claims.length})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time chat threads unlocked upon claim submission
          </p>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-4">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-100 font-bold text-base">No active claim threads yet</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Direct chat is gated until a claim is initiated to protect student privacy. Find a lost/found item in the catalog and click <strong>"Claim"</strong> to answer the security question and unlock instant chat.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Claim Thread
                    </span>
                    <h3 className="font-bold text-slate-100 text-base line-clamp-1">
                      {claim.itemTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs text-slate-400">
                        Claimant: <strong className="text-slate-200">{claim.claimantName}</strong>
                      </span>
                      <span
                        id={getUserHtmlId({
                          id: claim.claimantId,
                          name: claim.claimantName,
                          email: claim.claimantEmail
                        })}
                        className="px-1.5 py-0.2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-[9px] rounded"
                      >
                        {getUserTag({
                          id: claim.claimantId,
                          name: claim.claimantName,
                          email: claim.claimantEmail
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shrink-0 ${
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

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Verification Answer:
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-200 italic bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 font-medium">
                    "{claim.answer}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenThreadChat(claim)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Real-Time Chat Thread</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
