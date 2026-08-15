import { X, Bell, Sparkles, ShieldCheck } from "lucide-react";
export const NotificationDrawer = ({
  notifications,
  onClose,
  onMarkRead,
  onOpenMatchForId
}) => {
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4">
      <div className="bg-white border-l sm:border border-slate-200 w-full sm:max-w-md h-full sm:h-[80vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900">

        {
    /* Header */
  }
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-950">Campus Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={onMarkRead}
    className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
  >
              Mark Read
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* List */
  }
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? <p className="py-12 text-center text-xs text-slate-500">No notifications yet.</p> : notifications.map((n) => <div
    key={n.id}
    className={`p-3.5 rounded-xl border transition-all text-xs space-y-1 ${n.read ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white border-indigo-200 shadow-sm text-slate-900"}`}
  >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-950 flex items-center gap-1.5">
                    {n.type === "match" && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                    {n.type === "claim" && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">{n.message}</p>

                {n.itemId && onOpenMatchForId && <button
    onClick={() => {
      onClose();
      onOpenMatchForId(n.itemId);
    }}
    className="mt-2 text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
  >
                    <span>View AI Match Radar →</span>
                  </button>}
              </div>)}
        </div>

      </div>
    </div>;
};
