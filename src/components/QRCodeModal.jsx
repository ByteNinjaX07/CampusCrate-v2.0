import { useState } from "react";
import { X, QrCode, Download, Copy, Check, Sparkles, ExternalLink, UserCheck, Tag, RefreshCw, Link2, ShieldCheck } from "lucide-react";
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

  const tagId = item?.qrCodeId || (activeUser ? getUserQrTagId(activeUser) : `TAG-CC-${Math.floor(1e5 + Math.random() * 9e5)}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTag = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background & Outer Border
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 800);
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, 570, 770);

    // Header Band
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("✦ CAMPUSCRATE", 45, 65);

    ctx.fillStyle = "#e0e7ff";
    ctx.fillRect(350, 38, 200, 36);
    ctx.fillStyle = "#3730a3";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("SMART RECOVERY TAG", 365, 62);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 90);
    ctx.lineTo(555, 90);
    ctx.stroke();

    // Owner info section
    if (activeUser) {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("REGISTERED OWNER & TAG ID:", 45, 120);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`${activeUser.name || 'Campus Student'} (${userTag})`, 45, 145);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("ITEM LABEL:", 45, 175);

    ctx.fillStyle = "#1e1b4b";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(tagTitle.slice(0, 32), 45, 202);

    // QR Box background
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.fillRect(125, 230, 350, 350);
    ctx.strokeRect(125, 230, 350, 350);

    const renderRemainingAndDownload = (qrImg) => {
      if (qrImg) {
        ctx.drawImage(qrImg, 140, 245, 320, 320);
      }

      ctx.fillStyle = "#334155";
      ctx.font = "bold 13px monospace";
      ctx.fillText(`UUID: ${userUuid}`, 85, 610);

      ctx.fillStyle = "#64748b";
      ctx.font = "13px sans-serif";
      ctx.fillText("IF FOUND: Scan QR to contact owner safely via CampusCrate", 90, 645);
      ctx.fillText(`PROFILE URL: ${publicUrl.slice(0, 52)}`, 60, 675);

      const link = document.createElement("a");
      link.download = `CampusCrate-RecoveryTag-${userTag.replace('#','')}-${userUuid.slice(0,8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.onload = () => renderRemainingAndDownload(qrImage);
    qrImage.onerror = () => renderRemainingAndDownload(null);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(publicUrl)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-slate-900">

        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Separate QR Recovery Tag</h3>
                {activeUser && (
                  <span
                    id={userHtmlId}
                    className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono font-bold text-[10px] rounded"
                  >
                    {userTag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Personal printable QR tag for {activeUser?.name || "User"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="p-6 space-y-5">
          {/* User Tag Banner */}
          {activeUser && (
            <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{activeUser.name}</span>
                    <span className="px-1.5 py-0.2 bg-indigo-100 border border-indigo-300 text-indigo-800 font-mono font-bold text-[10px] rounded">
                      {userTag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{activeUser.email || "Registered Campus Student"}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                Active Owner Tag
              </span>
            </div>
          )}

          {/* Customizable Item Label input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-slate-700">
              Customize Item / Belongings Label for Tag:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagTitle}
                onChange={(e) => setTagTitle(e.target.value)}
                placeholder="e.g. Aryan's MacBook Air / Backpack / Keys"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Printable Tag Preview */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-lg border-2 border-indigo-600 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700 tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-indigo-600" /> CampusCrate
              </div>
              <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded shadow-xs">
                PERSONAL RECOVERY TAG
              </span>
            </div>

            <div className="text-center py-1 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                IF FOUND PLEASE SCAN QR CODE
              </p>
              <h4 className="text-base font-bold text-slate-900 truncate">{tagTitle}</h4>
              {activeUser && (
                <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 border border-slate-200 mt-1">
                  <span>Owner: {activeUser.name}</span>
                  <span className="text-indigo-600 font-mono font-bold">({userTag})</span>
                </div>
              )}
            </div>

            {/* Real High-Resolution Scannable QR Code Graphic */}
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center relative group shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(publicUrl)}`}
                alt={`QR Recovery Tag for ${userTag}`}
                className="w-full h-full object-contain rounded-md"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-indigo-600/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ExternalLink className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <div className="text-[11px] text-slate-600 font-mono flex items-center justify-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800">{userTag}</span>
                <span>•</span>
                <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                  UUID: {userUuid}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Scanners redirect safely to owner contact & lost-and-found match portal
              </p>
            </div>
          </div>

          {/* QRFY External Generator & Direct Public Link Bar */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Direct Recovery Web Link
              </span>
              <a
                href="https://qrfy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                title="Create custom styled QR tags on QRFY.com"
              >
                <span>Customize on QRFY.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Print Sticker</span>
          </button>

          <button
            onClick={handleDownloadTag}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Tag ({userTag})</span>
          </button>
        </div>

      </div>
    </div>
  );
};

