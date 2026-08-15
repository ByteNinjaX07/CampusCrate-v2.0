import { useState } from "react";
import { X, QrCode, Download, Copy, Check, Sparkles, ExternalLink, UserCheck, Tag, RefreshCw, Printer } from "lucide-react";
import { getUserTag, getUserQrTagId, getUserHtmlId, generateUserUuid, getUserRecoveryUuidUrl } from "../utils/userTag";

export const QRCodeModal = ({
  item,
  currentUser,
  targetUser,
  onClose
}) => {
  const activeUser = targetUser || currentUser || (item ? item.postedBy : null);
  const userTag = getUserTag(activeUser);
  const userHtmlId = getUserHtmlId(activeUser);
  const userUuid = generateUserUuid(activeUser);
  const publicUrl = getUserRecoveryUuidUrl(activeUser);

  const defaultTitle = item
    ? item.title
    : activeUser?.name
    ? `${activeUser.name}'s Belongings Tag`
    : "Personal Item Recovery Tag";

  const [copied, setCopied] = useState(false);
  const [tagTitle, setTagTitle] = useState(defaultTitle);
  const [tagColor, setTagColor] = useState("cyan"); // 'cyan' | 'indigo' | 'emerald' | 'rose'

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTag = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorHex =
      tagColor === "cyan"
        ? "#06b6d4"
        : tagColor === "indigo"
        ? "#6366f1"
        : tagColor === "emerald"
        ? "#10b981"
        : "#f43f5e";

    // Background & Outer Border
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 600, 800);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 570, 770);

    // Header Band
    ctx.fillStyle = colorHex;
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("✦ CAMPUSCRATE", 45, 65);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(350, 38, 200, 36);
    ctx.fillStyle = colorHex;
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("SMART RECOVERY TAG", 365, 62);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 90);
    ctx.lineTo(555, 90);
    ctx.stroke();

    // Owner info section
    if (activeUser) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("REGISTERED OWNER & TAG ID:", 45, 120);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`${activeUser.name || "Campus Student"} (${userTag})`, 45, 145);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("ITEM LABEL:", 45, 175);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(tagTitle.slice(0, 32), 45, 202);

    // QR Box background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(125, 230, 350, 350);

    const renderRemainingAndDownload = (qrImg) => {
      if (qrImg) {
        ctx.drawImage(qrImg, 140, 245, 320, 320);
      }

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 13px monospace";
      ctx.fillText(`UUID: ${userUuid}`, 85, 610);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px sans-serif";
      ctx.fillText("IF FOUND: Scan QR to contact owner safely via CampusCrate", 90, 645);
      ctx.fillText(`PROFILE URL: ${publicUrl.slice(0, 52)}`, 60, 675);

      const link = document.createElement("a");
      link.download = `CampusCrate-RecoveryTag-${userTag.replace("#", "")}-${userUuid.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.onload = () => renderRemainingAndDownload(qrImage);
    qrImage.onerror = () => renderRemainingAndDownload(null);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
      publicUrl
    )}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Smart QR Recovery Tag</h3>
                {activeUser && (
                  <span
                    id={userHtmlId}
                    className="px-2 py-0.5 bg-slate-800 text-cyan-300 border border-slate-700 font-mono font-bold text-[10px] rounded"
                  >
                    {userTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Personal printable QR recovery sticker for {activeUser?.name || "Student"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* User Tag Banner */}
          {activeUser && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">{activeUser.name}</span>
                    <span className="px-1.5 py-0.2 bg-slate-800 text-cyan-400 font-mono font-bold text-[10px] rounded">
                      {userTag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {activeUser.email || "Registered Campus Account"}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-lg border border-emerald-500/30 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Active Owner
              </span>
            </div>
          )}

          {/* Customizable Item Label input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-slate-300">
              Customize Item / Belongings Label for Tag:
            </label>
            <input
              type="text"
              value={tagTitle}
              onChange={(e) => setTagTitle(e.target.value)}
              placeholder="e.g. Aryan's MacBook Air / Backpack / Keys"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Tag Theme Color Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-bold">Tag Color Accent:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: "cyan", bg: "bg-cyan-500" },
                { id: "indigo", bg: "bg-indigo-500" },
                { id: "emerald", bg: "bg-emerald-500" },
                { id: "rose", bg: "bg-rose-500" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTagColor(c.id)}
                  className={`w-6 h-6 rounded-full ${c.bg} ${
                    tagColor === c.id ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                  } transition-all`}
                />
              ))}
            </div>
          </div>

          {/* Printable Tag Preview Card */}
          <div
            className={`bg-slate-950 text-slate-100 rounded-2xl p-5 shadow-xl border-2 space-y-3 relative overflow-hidden ${
              tagColor === "cyan"
                ? "border-cyan-500"
                : tagColor === "indigo"
                ? "border-indigo-500"
                : tagColor === "emerald"
                ? "border-emerald-500"
                : "border-rose-500"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2 border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400 tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400" /> CampusCrate
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-200 font-bold px-2 py-0.5 rounded border border-slate-700">
                PERSONAL RECOVERY TAG
              </span>
            </div>

            <div className="text-center py-1 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                IF FOUND PLEASE SCAN QR CODE
              </p>
              <h4 className="text-base font-bold text-white truncate">{tagTitle}</h4>
              {activeUser && (
                <div className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-800 mt-1">
                  <span>Owner: {activeUser.name}</span>
                  <span className="text-cyan-400 font-mono font-bold">({userTag})</span>
                </div>
              )}
            </div>

            {/* Scannable QR Code Graphic */}
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-700 flex items-center justify-center relative group shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                  publicUrl
                )}`}
                alt={`QR Recovery Tag for ${userTag}`}
                className="w-full h-full object-contain rounded-md"
                crossOrigin="anonymous"
              />
            </div>

            <div className="text-center space-y-1">
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2 flex-wrap">
                <span className="font-bold text-cyan-300">{userTag}</span>
                <span>•</span>
                <span className="bg-slate-900 text-slate-300 font-bold px-2 py-0.5 rounded-md border border-slate-800">
                  UUID: {userUuid}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Scanners redirect safely to owner contact & lost-and-found match portal
              </p>
            </div>
          </div>

          {/* Recovery Web Link Bar */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Direct Recovery Web Link
              </span>
              <a
                href="https://qrfy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Customize on QRFY</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sticker</span>
          </button>

          <button
            onClick={handleDownloadTag}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Tag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
