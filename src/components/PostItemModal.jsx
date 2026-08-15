import { useState } from "react";
import { X, Sparkles, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [date, setDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
  const presetPhotos = [
    { label: "Laptop / Tech", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
    { label: "Keys / Keyring", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80" },
    { label: "Water Bottle / Flask", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80" },
    { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
    { label: "Backpack / Bag", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
    { label: "Student ID / Wallet", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80" }
  ];
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
          claimQuestion: claimQuestion || "Please describe any distinguishing marks, serial details, or lock screen wallpaper.",
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
  return <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-900">

        {
    /* Modal Header */
  }
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span>Report Campus Item</span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI Enabled
              </span>
            </h2>
            <p className="text-xs text-slate-500">Add report details to notify the campus network and trigger AI matching</p>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Auth Notice Banner if unauthenticated */
  }
        {!currentUser.authenticated && <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Google / University Login Required</p>
                <p className="text-amber-700 text-[11px]">To report a lost or found item, please log in with your Google or Campus Email account.</p>
              </div>
            </div>
            {onRequireAuth && <button
    type="button"
    onClick={onRequireAuth}
    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-2xs whitespace-nowrap text-xs transition-colors"
  >
                Sign In Now
              </button>}
          </div>}

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">

          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>}

          {
    /* Type Selector Tabs */
  }
          <div className="grid grid-cols-2 gap-3">
            <button
    type="button"
    onClick={() => setType("lost")}
    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${type === "lost" ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
              <span className="w-2 h-2 rounded-full bg-rose-300" />
              <span>Lost Something</span>
            </button>

            <button
    type="button"
    onClick={() => setType("found")}
    className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${type === "found" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>Found Something</span>
            </button>
          </div>

          {
    /* Title Input & AI Magic Assist */
  }
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800">Item Name / Title *</label>
              <button
    type="button"
    onClick={handleAIAssist}
    disabled={aiLoading}
    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all"
  >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>{aiLoading ? "Analyzing..." : "\u2728 Magic AI Auto-Fill"}</span>
              </button>
            </div>
            <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Space Gray 14-inch MacBook Pro with Yosemite sticker"
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
          </div>

          {
    /* Category & Location Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Category *</label>
              <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                <option value="Electronics">Electronics</option>
                <option value="Keys & Cards">Keys & Cards</option>
                <option value="Bags & Backpacks">Bags & Backpacks</option>
                <option value="Clothing & Accessories">Clothing & Accessories</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Jewelry & Watches">Jewelry & Watches</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Campus Location *</label>
              <input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="e.g. Science Building - Room 204"
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
            </div>
          </div>

          {
    /* Date & Tags */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Date {type === "lost" ? "Lost" : "Found"}</label>
              <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Tags / Keywords</label>
              <div className="flex items-center gap-1">
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
    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
                <button
    type="button"
    onClick={handleAddTag}
    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200"
  >
                  Add
                </button>
              </div>
            </div>
          </div>

          {
    /* Rendered Tags List */
  }
          {tags.length > 0 && <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t, idx) => <span key={idx} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg flex items-center gap-1 text-[11px] font-semibold">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>)}
            </div>}

          {
    /* Description */
  }
          <div>
            <label className="font-semibold text-slate-800 block mb-1">Detailed Description *</label>
            <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={3}
    placeholder="Describe distinguishing features, contents, scratches, or exact spot where item was seen..."
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
          </div>

          {
    /* Verification Claim Question */
  }
          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-1">
            <label className="font-bold text-indigo-900 block">
              Claim Verification Question (Asked to claimant to prove ownership)
            </label>
            <input
    type="text"
    value={claimQuestion}
    onChange={(e) => setClaimQuestion(e.target.value)}
    placeholder="e.g. What stickers are on the laptop lid or what wallpaper is set?"
    className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
  />
          </div>

          {
    /* Photo Upload with Cloudinary Integration */
  }
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Item Photo (Cloudinary Upload / Preset / URL)
              </label>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80 flex items-center gap-1">
                ☁️ Cloudinary Enabled
              </span>
            </div>

            {
    /* Direct File Upload to Cloudinary Box */
  }
            <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-xl p-3.5 text-center transition-colors">
              <input
    type="file"
    id="cloudinary-file-input"
    accept="image/*"
    onChange={handleFileUpload}
    className="hidden"
    disabled={uploadingImage}
  />
              <label
    htmlFor="cloudinary-file-input"
    className="cursor-pointer flex flex-col items-center justify-center gap-1 text-xs text-indigo-900 font-medium"
  >
                {uploadingImage ? <div className="flex items-center gap-2 py-1 text-indigo-600 font-semibold">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </div> : uploadSuccess ? <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Photo Uploaded Successfully ({uploadProvider === "cloudinary" ? "Cloudinary Hosted" : "Ready"})</span>
                  </div> : <>
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-2xs mb-0.5">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">Click to upload photo from your device</span>
                    <span className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP up to 8MB. Auto-optimized via Cloudinary.</span>
                  </>}
              </label>
            </div>

            {
    /* Preview of current photo if uploaded or pasted */
  }
            {photoUrl && <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <img src={photoUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-slate-900 truncate">{photoUrl}</p>
                  <p className="text-[10px] text-slate-500">
                    {uploadProvider === "cloudinary" ? "\u2601\uFE0F Cloudinary Secure URL" : "Custom Image URL"}
                  </p>
                </div>
                <button
    type="button"
    onClick={() => {
      setPhotoUrl("");
      setUploadSuccess(false);
      setUploadProvider(null);
    }}
    className="p-1 text-slate-400 hover:text-rose-600"
    title="Remove image"
  >
                  <X className="w-4 h-4" />
                </button>
              </div>}

            {
    /* Quick Presets Dropdown/Grid Alternative */
  }
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Or choose a quick preset sample:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetPhotos.map((preset, idx) => <button
    key={idx}
    type="button"
    onClick={() => {
      setSelectedPreset(preset.url);
      setPhotoUrl("");
      setUploadSuccess(false);
    }}
    className={`p-1.5 px-2 rounded-xl border flex items-center gap-2 text-[11px] text-left transition-all ${selectedPreset === preset.url ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
  >
                    <img src={preset.url} alt={preset.label} className="w-6 h-6 rounded object-cover" />
                    <span className="truncate">{preset.label}</span>
                  </button>)}
              </div>
            </div>

            <input
    type="url"
    value={photoUrl}
    onChange={(e) => {
      setPhotoUrl(e.target.value);
      setSelectedPreset("");
      setUploadSuccess(false);
    }}
    placeholder="Or paste external image URL (e.g. https://...)"
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs mt-1"
  />
          </div>


          {
    /* Submit Footer */
  }
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors"
  >
              Cancel
            </button>

            <button
    type="submit"
    disabled={submitting}
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
  >
              {submitting ? "Publishing..." : "Publish Item Report"}
            </button>
          </div>

        </form>

      </div>
    </div>;
};
