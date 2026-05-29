import React, { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Download, ImagePlus, RefreshCw, Copy, Check } from "lucide-react";
import { buildContributionGrid } from "./grid.js";
import { THEMES, getTheme } from "./themes.js";
import { Banner, BANNER_WIDTH, BANNER_HEIGHT } from "./Banner.jsx";
import "./style.css";

const PNG_SCALE = 2;

function serializeSvg() {
  const node = document.getElementById("contribution-banner-svg");
  return new XMLSerializer().serializeToString(node);
}

function svgObjectUrl() {
  const blob = new Blob([serializeSvg()], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(blob);
}

function triggerDownload(href, filename) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

/** Rasterize the live SVG to a PNG canvas at PNG_SCALE, then hand it to a callback. */
function renderPngCanvas(backgroundColor, onReady) {
  const url = svgObjectUrl();
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_WIDTH * PNG_SCALE;
    canvas.height = BANNER_HEIGHT * PNG_SCALE;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    onReady(canvas);
  };
  image.src = url;
}

function App() {
  const [name, setName] = useState("yicheng");
  const [handle, setHandle] = useState("@yicheng");
  const [year, setYear] = useState("2026");
  const [seed, setSeed] = useState(13);
  const [density, setDensity] = useState(35);
  const [themeId, setThemeId] = useState("green");
  const [profilePic, setProfilePic] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const theme = getTheme(themeId);
  const grid = useMemo(() => buildContributionGrid(name, seed, density / 100), [name, seed, density]);
  const fileSlug = (handle.replace(/^@/, "") || name || "banner").toLowerCase();

  function uploadProfilePic(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(String(reader.result));
    reader.readAsDataURL(file);
  }

  function downloadSvg() {
    const url = svgObjectUrl();
    triggerDownload(url, `contribution-banner-${fileSlug}.svg`);
    URL.revokeObjectURL(url);
  }

  function downloadPng() {
    renderPngCanvas(theme.bg, (canvas) => {
      triggerDownload(canvas.toDataURL("image/png"), `contribution-banner-${fileSlug}.png`);
    });
  }

  function copyPng() {
    renderPngCanvas(theme.bg, (canvas) => {
      canvas.toBlob(async (blob) => {
        if (!blob || !navigator.clipboard?.write) return;
        try {
          await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard write can be blocked (permissions/insecure context); ignore silently.
        }
      }, "image/png");
    });
  }

  return (
    <div className="app">
      <main className="shell">
        <header>
          <h1>Contribution banner generator</h1>
          <p>GitHub-style contribution graph, cropped tight for an X banner. PNG export gives the cleanest result.</p>
        </header>

        <section className="controls">
          <div className="field-row">
            <label>
              <span>Text in graph</span>
              <input
                value={name}
                maxLength={8}
                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 8))}
              />
            </label>
            <label>
              <span>Handle</span>
              <input value={handle} onChange={(e) => setHandle(e.target.value)} />
            </label>
            <label>
              <span>Year</span>
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
          </div>

          <div className="field-row">
            <div className="field theme-field">
              <span>Theme</span>
              <div className="swatches" role="radiogroup" aria-label="Color theme">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={t.id === themeId}
                    aria-label={t.name}
                    title={t.name}
                    className={`swatch${t.id === themeId ? " active" : ""}`}
                    style={{ background: t.levels[3] }}
                    onClick={() => setThemeId(t.id)}
                  />
                ))}
              </div>
            </div>

            <label className="field density-field">
              <span>Background density · {density}%</span>
              <input type="range" min="0" max="100" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
            </label>
          </div>

          <div className="actions">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadProfilePic} hidden />
            <button className="secondary" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={16} /> Profile pic
            </button>
            <button className="secondary" onClick={() => setSeed((s) => s + 1)}>
              <RefreshCw size={16} /> Shuffle
            </button>
            <button className="secondary" onClick={copyPng}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy PNG"}
            </button>
            <button onClick={downloadSvg}>
              <Download size={16} /> SVG
            </button>
            <button onClick={downloadPng}>
              <Download size={16} /> PNG
            </button>
          </div>
        </section>

        <section className="preview-frame">
          <div className="preview">
            <Banner grid={grid} theme={theme} handle={handle} year={year} profilePic={profilePic} />
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
