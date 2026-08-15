import { Sparkles, ArrowRight, QrCode, CheckCircle, Search, Compass, AlertTriangle, ShieldCheck } from "lucide-react";

export const HeroBanner = ({
  onOpenPostLost,
  onOpenPostFound,
  onOpenQRGenerator,
  selectedCategory,
  setSelectedCategory,
  stats,
  searchQuery,
  setSearchQuery
}) => {
  const categories = [
    { id: "all", label: "All Items" },
    { id: "Electronics", label: "💻 Electronics" },
    { id: "Keys & Cards", label: "🔑 Keys & Cards" },
    { id: "Bags & Backpacks", label: "🎒 Backpacks" },
    { id: "Clothing & Accessories", label: "🧥 Clothing" },
    { id: "Books & Notebooks", label: "📚 Books" },
    { id: "Other", label: "🏷️ Other" }
  ];

  const quickSearches = ["MacBook", "AirPods", "Water Bottle", "ID Card", "Calculator", "Keys"];

  return (
    <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Message & Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Gemini 3.6 Flash AI Matching Engine Online</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Lost something on campus? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Recover it in seconds with AI.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              CampusCrate continuously analyzes campus reports across dorms, lecture halls, and libraries. Powered by Gemini multimodal AI, automated ownership verification questions, and smart QR recovery tags.
            </p>

            {/* Quick Interactive Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  placeholder="Search item name, brand, location, or tag..."
                  className="w-full pl-10 pr-24 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery && setSearchQuery("")}
                    className="absolute right-3 px-2 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Search Suggestion Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-cyan-400" /> Try:
                </span>
                {quickSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      if (setSearchQuery) setSearchQuery(term);
                    }}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenPostLost}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>+ Report Lost Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPostFound}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>+ Report Found Item</span>
              </button>

              <button
                onClick={onOpenQRGenerator}
                className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Smart QR Tag</span>
              </button>
            </div>
          </div>

          {/* Right Live Campus Metrics Bento */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg group">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Active Listings</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  📍 Campus
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {stats?.activePosts || 0}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Available in catalog</p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-lg group">
              <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold">
                <span>AI Confidence</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400">
                  {stats?.matchRate || 92}%
                </span>
                <p className="text-[11px] text-cyan-300/70 mt-1">Accuracy score</p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-rose-500/40 transition-all shadow-lg group">
              <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
                <span>Lost Reports</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-rose-400">
                  {stats?.totalLost || 0}
                </span>
                <p className="text-[11px] text-rose-300/70 mt-1">Awaiting recovery</p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-lg group">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
                <span>Found & Logged</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {stats?.totalFound || 0}
                </span>
                <p className="text-[11px] text-emerald-300/70 mt-1">Safe & cataloged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Filter Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
