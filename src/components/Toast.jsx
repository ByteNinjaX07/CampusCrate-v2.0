import { CheckCircle2, AlertCircle, Sparkles, Info, X } from "lucide-react";

export const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success" || !toast.type;
        const isError = toast.type === "error";
        const isAI = toast.type === "ai";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? "bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/40"
                : isError
                ? "bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-950/40"
                : isAI
                ? "bg-slate-900/95 border-cyan-500/40 text-slate-100 shadow-cyan-950/40"
                : "bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {isAI && <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />}
              {!isSuccess && !isError && !isAI && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}

              <div className="text-xs">
                {toast.title && <p className="font-bold text-slate-100">{toast.title}</p>}
                <p className="text-slate-300 font-medium">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
