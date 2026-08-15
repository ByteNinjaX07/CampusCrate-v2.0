import { useState } from "react";
import {
  PackageSearch,
  RefreshCw,
  LayoutGrid,
  List,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  Sparkles,
  Layers,
  Map as MapIcon
} from "lucide-react";
import { ItemCard } from "./ItemCard";
import { HeroBanner } from "./HeroBanner";
import { CampusMapHotspots } from "./CampusMapHotspots";

export const AllItemsPage = ({
  items = [],
  currentUser,
  loading,
  searchQuery,
  setSearchQuery,
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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'map'
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'title'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all"); // 'all' | 'lost' | 'found'

  // Filter & Sort Logic
  const filteredItems = items
    .filter((item) => {
      if (selectedTypeFilter !== "all" && item.type !== selectedTypeFilter) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (
        selectedLocation &&
        !item.location.toLowerCase().includes(selectedLocation.toLowerCase())
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedTypeFilter !== "all" ||
    selectedLocation !== null ||
    (searchQuery && searchQuery.trim().length > 0);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedTypeFilter("all");
    setSelectedLocation(null);
    if (setSearchQuery) setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Interactive Hero Banner with Quick Search */}
      <HeroBanner
        onOpenPostLost={onOpenPostLost}
        onOpenPostFound={onOpenPostFound}
        onOpenQRGenerator={onOpenQRGenerator}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Interactive Campus Map View (Collapsible or Tab View) */}
      {viewMode === "map" && (
        <CampusMapHotspots
          items={items}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onSelectItem={onSelectItem}
        />
      )}

      {/* Catalog Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Type Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedTypeFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTypeFilter === "all"
                  ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter("lost")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTypeFilter === "lost"
                  ? "bg-rose-600/90 text-white shadow-md shadow-rose-950/50"
                  : "text-rose-400 hover:bg-rose-950/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Lost ({items.filter((i) => i.type === "lost").length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter("found")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTypeFilter === "found"
                  ? "bg-emerald-600/90 text-white shadow-md shadow-emerald-950/50"
                  : "text-emerald-400 hover:bg-emerald-950/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Found ({items.filter((i) => i.type === "found").length})
            </button>
          </div>

          {/* Right: Sort & View Mode Switcher */}
          <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-slate-100">
                  Newest First
                </option>
                <option value="oldest" className="bg-slate-900 text-slate-100">
                  Oldest First
                </option>
                <option value="title" className="bg-slate-900 text-slate-100">
                  Title (A-Z)
                </option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="Dense List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === "map" ? "grid" : "map")}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold px-2 ${
                  viewMode === "map"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title="Interactive Campus Map Radar"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Radar</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              title="Refresh listings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-[11px] font-semibold">Active Filters:</span>
              {selectedTypeFilter !== "all" && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1">
                  Type: {selectedTypeFilter}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-400"
                    onClick={() => setSelectedTypeFilter("all")}
                  />
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1">
                  Category: {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-400"
                    onClick={() => setSelectedCategory("all")}
                  />
                </span>
              )}
              {selectedLocation && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-medium flex items-center gap-1">
                  Location: {selectedLocation}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-400"
                    onClick={() => setSelectedLocation(null)}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1">
                  Query: "{searchQuery}"
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-400"
                    onClick={() => setSearchQuery && setSearchQuery("")}
                  />
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid or List Display */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">
            Syncing live campus listings...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-4">
          <PackageSearch className="w-14 h-14 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">No matching campus items found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find items matching your current filters or query. Try clearing filters or reporting a new missing item.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenPostLost}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              + Report Lost Item
            </button>
          </div>
        </div>
      ) : viewMode === "list" ? (
        /* List Mode Table */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-100 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          item.type === "lost"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">{item.category}</td>
                    <td className="py-3 px-4 font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        {item.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onOpenMatch(item)}
                          className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors"
                          title="Run AI Match"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenQR(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                          title="QR Tag"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              currentUser={currentUser}
              onSelect={onSelectItem}
              onOpenMatch={onOpenMatch}
              onOpenClaim={onOpenClaim}
              onOpenQR={onOpenQR}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};
