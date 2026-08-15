import { PackageSearch, CheckCircle2, PlusCircle, RefreshCw, Filter } from "lucide-react";
import { ItemCard } from "./ItemCard";
const CATEGORIES = [
  "all",
  "Electronics",
  "Keys & Cards",
  "Bags & Backpacks",
  "Clothing & Accessories",
  "Books & Notebooks",
  "Other"
];
export const FoundItemsPage = ({
  items,
  currentUser,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenPostFound,
  onRefresh,
  onSelectItem,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport
}) => {
  const foundItems = items.filter((item) => {
    if (item.type !== "found") return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
    }
    return true;
  });
  return <div className="space-y-6">
      {
    /* Page Header Banner */
  }
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dedicated Found & Logged Belongings Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Found Items on Campus
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Browse items turned in or discovered across campus. If you found a lost item, log it here to help reunite it with its rightful owner securely using custom verification questions.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
    onClick={onOpenPostFound}
    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
  >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Category Pills & Search Controls */
  }
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? "bg-emerald-600 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"}`}
  >
              {cat === "all" ? "All Found" : cat}
            </button>)}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <span className="text-xs font-bold text-slate-700 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg">
            {foundItems.length} Found Listed
          </span>
          <button
    onClick={onRefresh}
    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
    title="Refresh Found Items"
  >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {
    /* Grid of Found Items */
  }
      {loading ? <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Fetching found items from campus database...</p>
        </div> : foundItems.length === 0 ? <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Found Items Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No found reports match the selected category or search query. Found something on campus? Log it now to help a student.
          </p>
          <button
    onClick={onOpenPostFound}
    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700"
  >
            <PlusCircle className="w-4 h-4" />
            <span>Post Found Item</span>
          </button>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foundItems.map((item) => <ItemCard
    key={item.id}
    item={item}
    currentUser={currentUser}
    onSelect={onSelectItem}
    onOpenMatch={onOpenMatch}
    onOpenClaim={onOpenClaim}
    onOpenQR={onOpenQR}
    onReport={onReport}
  />)}
        </div>}
    </div>;
};
