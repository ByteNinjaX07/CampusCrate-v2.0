import { MessageSquare, ShieldCheck, Lock, UserCheck } from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const ClaimsPage = ({
  claims,
  onOpenThreadChat
}) => {
  return <div className="space-y-6">
      {
    /* Page Header Banner */
  }
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Claim-Gated Direct Messaging System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Claims & Threaded Chat Hub
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Direct chat between item finders and losers is enabled strictly after a claim is initiated. Review submitted verification details and open real-time thread chats to coordinate safe campus handovers.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Active Claim Threads ({claims.length})</h2>
          <p className="text-xs text-slate-500">Real-time chat threads unlocked upon claim submission</p>
        </div>
      </div>

      {claims.length === 0 ? <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-800 font-bold text-base">No active claim threads yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Direct chat is locked until a claim is initiated. Find a lost/found item in the catalog and click <strong>"Claim Item"</strong> to initiate a claim and unlock real-time direct chat with the poster.
          </p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((claim) => <div key={claim.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Claim Thread Active</span>
                    <h3 className="font-bold text-slate-900 text-base">{claim.itemTitle}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-slate-500">Claimant: <strong className="text-slate-800">{claim.claimantName}</strong></span>
                      <span
                        id={getUserHtmlId({ id: claim.claimantId, name: claim.claimantName, email: claim.claimantEmail })}
                        className="px-1.5 py-0.2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[9px] rounded"
                        title={`Claimant User ID Tag`}
                      >
                        {getUserTag({ id: claim.claimantId, name: claim.claimantName, email: claim.claimantEmail })}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${claim.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : claim.status === "returned" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : claim.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {claim.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold flex items-center gap-1 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Claimant Answer:
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
                    "{claim.answer}"
                  </p>
                </div>
              </div>

              <button
    onClick={() => onOpenThreadChat(claim)}
    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors mt-2"
  >
                <MessageSquare className="w-4 h-4" />
                <span>Open Real-Time Chat Thread</span>
              </button>
            </div>)}
        </div>}
    </div>;
};
