import { useState, useEffect } from "react";
import { Sparkles, X, AlertTriangle, CheckCircle2, ArrowRight, MapPin, Zap } from "lucide-react";

export const AIMatchModal = ({
  item,
  currentUser,
  onClose,
  onInitiateClaim
}) => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [source, setSource] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item) return;
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id })
        });
        const data = await res.json();
        if (data.matches) {
          setMatches(data.matches);
          setSource(data.source || "gemini");
        } else {
          setError(data.message || "No matching items found in system database.");
        }
      } catch (err) {
        console.error("Failed to run AI match:", err);
        setError("Failed to contact AI matching server.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Gemini AI Match Radar
              </h2>
              <p className="text-xs text-slate-400">
                Comparing "{item.title}" against active {item.type === "lost" ? "Found" : "Lost"} reports across campus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item Reference Summary Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 p-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] border ${
                item.type === "lost"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}
            >
              Target ({item.type})
            </span>
            <span className="font-bold text-slate-100">{item.title}</span>
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 font-mono font-bold">
              ✨ Gemini 3.6 Flash
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div>
                <p className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Analyzing visual & description cross-similarities...
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Gemini API is evaluating stickers, brand models, campus location coordinates, timestamps, and verification question overlap.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="py-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800 p-6 space-y-2">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-slate-200 font-bold text-sm">{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800 p-6 space-y-2">
              <p className="text-slate-200 font-bold text-sm">
                No direct matches currently registered for this item.
              </p>
              <p className="text-xs text-slate-400">
                We will alert you as soon as a new report is posted on campus!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {matches.length} Potential Match Candidate(s) Ranked by Confidence
              </p>

              {matches.map((match, idx) => {
                const candidate = match.matchedItem;
                const isHighMatch = match.score >= 80;
                const isMediumMatch = match.score >= 50 && match.score < 80;

                return (
                  <div
                    key={idx}
                    className={`bg-slate-950/80 border rounded-2xl p-4 sm:p-5 transition-all space-y-3 shadow-lg ${
                      isHighMatch
                        ? "border-cyan-500/50 ring-1 ring-cyan-500/30"
                        : isMediumMatch
                        ? "border-amber-500/40"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      {/* Score Badge */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1.5 shadow-md ${
                            isHighMatch
                              ? "bg-cyan-500 text-slate-950 shadow-cyan-500/20"
                              : isMediumMatch
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{match.score}% Match</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-base">{candidate.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Posted by {candidate.postedBy.name}</span>
                            <span>•</span>
                            <span>{candidate.date}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          onClose();
                          onInitiateClaim(candidate);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors self-start sm:self-auto"
                      >
                        <span>Claim & Verify</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-slate-300 pt-1">
                      {/* Photo Preview */}
                      <div className="md:col-span-3 h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Reasoning & Correlation */}
                      <div className="md:col-span-9 space-y-2">
                        <div className="bg-cyan-950/30 p-3 rounded-xl border border-cyan-800/40 space-y-1">
                          <p className="font-bold text-cyan-300 text-xs flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            AI Match Rationale:
                          </p>
                          <p className="text-slate-200 text-xs leading-relaxed">{match.reasoning}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-slate-400 block font-semibold">
                                Location Correlation:
                              </span>
                              <span className="text-slate-200 font-medium">
                                {match.locationSimilarity} ({candidate.location})
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-slate-400 block font-semibold">
                                Verification Tip:
                              </span>
                              <span className="text-slate-200 font-medium">{match.verificationTip}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
