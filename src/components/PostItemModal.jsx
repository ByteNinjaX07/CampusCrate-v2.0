import { useState } from "react";
import { X, Sparkles, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Zap, ShieldCheck } from "lucide-react";

export const PostItemModal = ({
  initialType = "lost",
  currentUser,
  onClose,
  onItemPosted,
  onRequireAuth
}) => {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [claimQuestion, setClaimQuestion] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProvider, setUploadProvider] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const presetPhotos = [
    { label: "Laptop / Tech", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
    { label: "Keys / Keyring", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80" },
    { label: "Water Bottle / Flask", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80" },
    { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
    { label: "Backpack / Bag", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
    { label: "Student ID / Card", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80" }
  ];

  const quickSamples = [
    {
      title: "Space Gray M2 MacBook Air (13-inch)",
      category: "Electronics",
      location: "Central Library 3rd Floor Desk #42",
      description: "Left on wooden study table near south windows. Has a GitHub and NASA sticker on the top cover.",
      claimQuestion: "What wallpaper or user account name is displayed on the lock screen?",
      tags: ["Apple", "MacBook", "M2", "Library", "SpaceGray"],
      photo: presetPhotos[0].url
    },
    {
      title: "Apple AirPods Pro (2nd Gen with Lanyard)",
      category: "Electronics",
      location: "Student Union Cafeteria Table #14",
      description: "White charging case with subtle scratch on the bottom hinge. Found during lunch hour.",
      claimQuestion: "What is engraved on the front of the case or what Bluetooth name does it broadcast?",
      tags: ["AirPods", "Apple", "Audio", "StudentUnion"],
      photo: presetPhotos[3].url
    },
    {
      title: "Hydro Flask 32oz Wide Mouth (Pacific Blue)",
      category: "Other",
      location: "East Gym Basketball Bleachers",
      description: "Has slight dent on base rim and stickers from Yosemite National Park and Patagonia.",
      claimQuestion: "Describe the cap style (straw vs flex lid) and color of boot sleeve.",
      tags: ["HydroFlask", "Gym", "WaterBottle", "Blue"],
      photo: presetPhotos[2].url
    }
  ];

  const handleApplySample = (sample) => {
    setTitle(sample.title);
    setCategory(sample.category);
    setLocation(sample.location);
    setDescription(sample.description);
    setClaimQuestion(sample.claimQuestion);
    setTags(sample.tags);
    setSelectedPreset(sample.photo);
    setPhotoUrl("");
    setUploadSuccess(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Image file size must be under 8MB.");
      return;
    }
    setUploadingImage(true);
    setError("");
    setUploadSuccess(false);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setPhotoUrl(data.url);
          setSelectedPreset("");
          setUploadProvider(data.provider || "cloudinary");
          setUploadSuccess(true);
        } else {
          throw new Error(data.error || "Failed to upload image");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err.message || "Image upload failed");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAIAssist = async () => {
    if (!title && !description) {
      setError("Please type a title or short description first so AI can analyze!");
      return;
    }
    setError("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/autotag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (data.tags && Array.isArray(data.tags)) {
        setTags(data.tags);
      }
      if (data.category) {
        setCategory(data.category);
      }
      if (data.claimQuestion) {
        setClaimQuestion(data.claimQuestion);
      }
      if (data.improvedTitle && data.improvedTitle !== title) {
        setTitle(data.improvedTitle);
      }
    } catch (err) {
      console.error("AI autotag error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser.authenticated) {
      setError("Mandatory Login Required: Please sign in with your Google or Campus Email account before submitting.");
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }
    if (!title || !description || !location) {
      setError("Please fill in title, description, and campus location.");
      return;
    }
    setSubmitting(true);
    setError("");
    const finalPhoto = photoUrl || selectedPreset || presetPhotos[0].url;

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          category,
          location,
          date,
          photoUrl: finalPhoto,
          postedBy: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            avatarUrl: currentUser.avatarUrl
          },
          claimQuestion:
            claimQuestion ||
            "Please describe any distinguishing marks, serial details, or lock screen wallpaper.",
          tags
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }
      const newItem = await res.json();
      onItemPosted(newItem);
      onClose();
    } catch (err) {
      setError(err.message || "Error submitting post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Report Campus Item</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI Auto-Tagging Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Submit report details to alert campus network and trigger Gemini AI cross-matching
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Fill Toolbar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 p-3 px-5 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 shrink-0 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Quick Fill Demo:
          </span>
          {quickSamples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700 font-medium transition-colors"
            >
              ⚡ {sample.title.split(" ")[0]} {sample.title.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("lost")}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                type === "lost"
                  ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950/50"
                  : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Lost Something</span>
            </button>

            <button
              type="button"
              onClick={() => setType("found")}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                type === "found"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/50"
                  : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Found Something</span>
            </button>
          </div>

          {/* Title Input & AI Magic Assist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-200">Item Name / Title *</label>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={aiLoading}
                className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>{aiLoading ? "Analyzing..." : "✨ AI Auto-Suggest"}</span>
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Space Gray 14-inch MacBook Pro with Yosemite sticker"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-200 block mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
              >
                <option value="Electronics" className="bg-slate-900">Electronics</option>
                <option value="Keys & Cards" className="bg-slate-900">Keys & Cards</option>
                <option value="Bags & Backpacks" className="bg-slate-900">Bags & Backpacks</option>
                <option value="Clothing & Accessories" className="bg-slate-900">Clothing & Accessories</option>
                <option value="Books & Stationery" className="bg-slate-900">Books & Stationery</option>
                <option value="Jewelry & Watches" className="bg-slate-900">Jewelry & Watches</option>
                <option value="Sports & Fitness" className="bg-slate-900">Sports & Fitness</option>
                <option value="Other" className="bg-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1.5">Campus Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Library Floor 2"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          {/* Date & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-200 block mb-1.5">
                Date {type === "lost" ? "Lost" : "Found"}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1.5">Tags / Keywords</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. Apple, SpaceGray"
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Tags List */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="font-bold text-slate-200 block mb-1.5">Detailed Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe distinguishing features, contents, scratches, or exact spot where item was seen..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Verification Claim Question */}
          <div className="bg-indigo-950/30 p-3.5 rounded-2xl border border-indigo-900/40 space-y-1.5">
            <label className="font-bold text-indigo-300 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Claim Verification Question (Asked to verify ownership)
            </label>
            <input
              type="text"
              value={claimQuestion}
              onChange={(e) => setClaimQuestion(e.target.value)}
              placeholder="e.g. What stickers are on the laptop lid or what wallpaper is set?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          {/* Photo Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Item Photo Preset / Custom URL
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetPhotos.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset.url);
                    setPhotoUrl("");
                    setUploadSuccess(false);
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-[11px] text-left transition-all ${
                    selectedPreset === preset.url
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <input
              type="url"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                setSelectedPreset("");
              }}
              placeholder="Or paste external image URL (e.g. https://...)"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
            >
              {submitting ? "Publishing..." : "Publish Item Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
