import { X, Bell, Sparkles, ShieldCheck } from "lucide-react";

export const NotificationDrawer = ({
  notifications = [],
  onClose,
  onMarkRead,
  onOpenMatchForId
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-end p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l sm:border border-slate-800 w-full sm:max-w-md h-full sm:h-[85vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white">Campus Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkRead}
              className="px-3 py-1.5 text-[11px] bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors"
            >
              Mark Read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No notifications yet. You're all caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                  n.read
                    ? "bg-slate-950/40 border-slate-800/80 text-slate-400"
                    : "bg-slate-950/90 border-cyan-500/40 shadow-lg text-slate-200 ring-1 ring-cyan-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {n.type === "match" && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                    {n.type === "claim" && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">{n.message}</p>

                {n.itemId && onOpenMatchForId && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMatchForId(n.itemId);
                    }}
                    className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>View AI Match Radar →</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
