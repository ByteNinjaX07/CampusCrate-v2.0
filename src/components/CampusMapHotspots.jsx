import { useState } from "react";
import { MapPin, Building, Sparkles, Navigation, Layers, CheckCircle2, AlertCircle } from "lucide-react";

export const CAMPUS_ZONES = [
  {
    id: "Central Library",
    name: "Central Library",
    shortName: "Library",
    icon: "📚",
    description: "Floors 1-4, Quiet Study Rooms, Helpdesk, and Computer Commons",
    x: 45, // percentage on map
    y: 35,
    color: "indigo"
  },
  {
    id: "Student Union",
    name: "Student Union & Cafeteria",
    shortName: "Student Union",
    icon: "🥪",
    description: "Food Court, Starbucks, Student Info Desk, Game Lounge",
    x: 30,
    y: 60,
    color: "amber"
  },
  {
    id: "Science Complex",
    name: "Science & Engineering Complex",
    shortName: "Science Complex",
    icon: "🔬",
    description: "Hall 101, Robotics Lab, Chemistry Wing, Dept Offices",
    x: 70,
    y: 40,
    color: "cyan"
  },
  {
    id: "East Gym",
    name: "East Gym & Recreation",
    shortName: "East Gym",
    icon: "🏀",
    description: "Basketball Arena, Locker Rooms, Fitness Center, Equipment Desk",
    x: 80,
    y: 75,
    color: "emerald"
  },
  {
    id: "Dining Commons",
    name: "Campus Dining Commons",
    shortName: "Dining Commons",
    icon: "🍽️",
    description: "Main Dining Hall, Outdoor Patio, Coffee Bar",
    x: 25,
    y: 80,
    color: "orange"
  },
  {
    id: "North Quad",
    name: "North Quad Residence Halls",
    shortName: "North Quad",
    icon: "🏢",
    description: "Dormitory Halls 1-6, Common Courtyard, RA Front Desks",
    x: 55,
    y: 18,
    color: "rose"
  },
  {
    id: "Parking Structure C",
    name: "Parking Structure & Lots",
    shortName: "Parking Lot",
    icon: "🚗",
    description: "Levels 1-4, EV Charging Zone, Lot B Bus Terminal",
    x: 85,
    y: 20,
    color: "purple"
  }
];

export const CampusMapHotspots = ({
  items = [],
  selectedLocation,
  onSelectLocation,
  onSelectItem
}) => {
  const [hoveredZone, setHoveredZone] = useState(null);

  const getZoneStats = (zoneId) => {
    const zoneItems = items.filter((item) =>
      item.location.toLowerCase().includes(zoneId.toLowerCase())
    );
    const lostCount = zoneItems.filter((i) => i.type === "lost").length;
    const foundCount = zoneItems.filter((i) => i.type === "found").length;
    return { total: zoneItems.length, lostCount, foundCount, items: zoneItems };
  };

  const activeZoneObj = CAMPUS_ZONES.find((z) => z.id === selectedLocation) || (hoveredZone ? CAMPUS_ZONES.find(z => z.id === hoveredZone) : null);
  const activeZoneStats = activeZoneObj ? getZoneStats(activeZoneObj.id) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Interactive Campus Hotspot Radar</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click on any campus zone to instantly filter listings and view lost/found activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedLocation && (
            <button
              onClick={() => onSelectLocation(null)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Reset Location Filter
            </button>
          )}
          <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/80 text-cyan-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {items.length} Active Items on Campus
          </span>
        </div>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Campus Map Canvas */}
        <div className="lg:col-span-8 relative bg-slate-950/80 border border-slate-800 rounded-2xl p-4 min-h-[360px] sm:min-h-[420px] overflow-hidden flex flex-col justify-between">
          {/* Subtle Map Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Campus Boundary Decorative Lines */}
          <div className="absolute inset-4 border border-dashed border-slate-800/80 rounded-xl pointer-events-none flex items-end justify-start p-3">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">
              CAMPUS QUADRANT GRID • 2026
            </span>
          </div>

          {/* Hotspot Interactive Pins */}
          {CAMPUS_ZONES.map((zone) => {
            const stats = getZoneStats(zone.id);
            const isSelected = selectedLocation === zone.id;
            const isHovered = hoveredZone === zone.id;

            return (
              <div
                key={zone.id}
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                <button
                  onClick={() => onSelectLocation(isSelected ? null : zone.id)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all transform hover:scale-110 shadow-lg ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 scale-110 shadow-cyan-500/30"
                      : isHovered
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                      : "bg-slate-900/90 text-slate-200 border border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <span className="text-sm">{zone.icon}</span>
                  <span className="whitespace-nowrap">{zone.shortName}</span>
                  {stats.total > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isSelected
                          ? "bg-slate-950 text-cyan-400"
                          : "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                      }`}
                    >
                      {stats.total}
                    </span>
                  )}
                </button>

                {/* Animated Pulsing Ring */}
                {stats.total > 0 && !isSelected && (
                  <span className="absolute -inset-1 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
                )}
              </div>
            );
          })}

          {/* Map Compass / Info Badge */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Lost items
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 ml-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Found items
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Interactive Radar View</span>
          </div>
        </div>

        {/* Selected Zone Detail Panel */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-4">
          {activeZoneObj ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                    {activeZoneObj.icon}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{activeZoneObj.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{activeZoneObj.description}</p>
                  </div>
                </div>
              </div>

              {/* Counts Breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Lost Here</span>
                  <p className="text-xl font-extrabold text-rose-300 mt-0.5">
                    {activeZoneStats?.lostCount || 0}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Found Here</span>
                  <p className="text-xl font-extrabold text-emerald-300 mt-0.5">
                    {activeZoneStats?.foundCount || 0}
                  </p>
                </div>
              </div>

              {/* Items in this zone */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Recent Reports in this Zone</span>
                  <span className="text-cyan-400 text-[11px] font-mono">
                    {activeZoneStats?.items.length || 0} items
                  </span>
                </span>

                {activeZoneStats?.items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No active reports in this specific location right now.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {activeZoneStats?.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem && onSelectItem(item)}
                        className="p-2 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.type === "lost" ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                          />
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectLocation(selectedLocation === activeZoneObj.id ? null : activeZoneObj.id)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  selectedLocation === activeZoneObj.id
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {selectedLocation === activeZoneObj.id
                    ? "✓ Filtering Feed to this Zone"
                    : "Filter Main Feed to this Zone"}
                </span>
              </button>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Building className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-400">
                Hover or click any marker on the map to inspect location activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
