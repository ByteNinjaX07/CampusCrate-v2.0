import { Sparkles, ArrowRight, QrCode, CheckCircle } from "lucide-react";
export const HeroBanner = ({
  onOpenPostLost,
  onOpenPostFound,
  onOpenQRGenerator,
  selectedCategory,
  setSelectedCategory,
  stats
}) => {
  const categories = [
    { id: "all", label: "All Items" },
    { id: "Electronics", label: "\u{1F4BB} Electronics" },
    { id: "Keys & Cards", label: "\u{1F511} Keys & Cards" },
    { id: "Bags & Backpacks", label: "\u{1F392} Backpacks" },
    { id: "Clothing & Accessories", label: "\u{1F9E5} Clothing" },
    { id: "Books & Stationery", label: "\u{1F4DA} Books" },
    { id: "Other", label: "\u{1F3F7}\uFE0F Other" }
  ];
  return <div className="relative overflow-hidden bg-white border-b border-slate-200 text-slate-900 pt-8 pb-8 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {
    /* Left Hero Message & Call-To-Actions */
  }
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus AI Matching Engine Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Lost something on campus? <br />
              <span className="text-indigo-600">
                Find it in seconds with AI.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              CampusCrate intelligently compares lost & found reports across dorms, lecture halls, and libraries. Use AI photo analysis, automated verification questions, and smart QR tags to reclaim your belongings securely.
            </p>

            {
    /* Main Action Buttons */
  }
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
    onClick={onOpenPostLost}
    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors"
  >
                <span>+ Report Lost Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
    onClick={onOpenPostFound}
    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
  >
                <span>+ Report Found Item</span>
              </button>

              <button
    onClick={onOpenQRGenerator}
    className="px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors"
  >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </div>

          {
    /* Right Stats & Live Metrics */
  }
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Active Listings</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">📍 Campus</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activePosts}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Reported in last 7 days</p>
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-200 transition-all shadow-sm">
              <div className="flex items-center justify-between text-indigo-700 text-xs font-medium">
                <span>AI Accuracy</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{stats.matchRate}%</span>
                <p className="text-[11px] text-indigo-600/80 mt-0.5">High confidence matches</p>
              </div>
            </div>

            <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-xl flex flex-col justify-between hover:border-rose-200 transition-all shadow-sm">
              <div className="flex items-center justify-between text-rose-700 text-xs font-medium">
                <span>Lost Reports</span>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">{stats.totalLost}</span>
                <p className="text-[11px] text-rose-600/80 mt-0.5">Students looking</p>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-200 transition-all shadow-sm">
              <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
                <span>Found & Logged</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{stats.totalFound}</span>
                <p className="text-[11px] text-emerald-600/80 mt-0.5">Safely returned</p>
              </div>
            </div>
          </div>

        </div>

        {
    /* Category Pills Bar */
  }
        <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2">
            Filters:
          </span>
          {categories.map((cat) => <button
    key={cat.id}
    onClick={() => setSelectedCategory(cat.id)}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${selectedCategory === cat.id ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
  >
              {cat.label}
            </button>)}
        </div>

      </div>
    </div>;
};
