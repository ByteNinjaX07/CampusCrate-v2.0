import { PackageSearch, RefreshCw } from "lucide-react";
import { ItemCard } from "./ItemCard";
import { HeroBanner } from "./HeroBanner";
export const AllItemsPage = ({
  items,
  currentUser,
  loading,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  stats,
  onOpenPostLost,
  onOpenPostFound,
  onOpenQRGenerator,
  onRefresh,
  onSelectItem,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport
}) => {
  const filteredItems = items.filter((item) => {
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
      <HeroBanner
    onOpenPostLost={onOpenPostLost}
    onOpenPostFound={onOpenPostFound}
    onOpenQRGenerator={onOpenQRGenerator}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    stats={stats}
  />

      {
    /* Catalog Bar Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-950">
            All Campus Listings
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
            {filteredItems.length} Total
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
    onClick={onRefresh}
    className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
    title="Reload items"
  >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {
    /* Grid */
  }
      {loading ? <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Connecting to CampusCrate database...</p>
        </div> : filteredItems.length === 0 ? <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or selecting a different category pill above.
          </p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => <ItemCard
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
