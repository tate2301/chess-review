"use client";

import { useState } from "react";
import { useChessStore } from "../../hooks/useChessStore";

export default function SettingsTab() {
  const { state, updateSettings } = useChessStore();
  const { settings } = state;
  const [showEngineHelp, setShowEngineHelp] = useState(false);

  const handleOrientationChange = (orientation: "w" | "b") => {
    updateSettings({ orientation });
  };

  const handleDepthChange = (depth: number) => {
    updateSettings({ depth });
  };

  const handleEngineChange = (engine: string) => {
    updateSettings({ engine });
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-bold text-left" htmlFor="orientation">
            Orientation
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="orientation-white"
                name="orientation"
                value="w"
                checked={settings.orientation === "w"}
                onChange={() => handleOrientationChange("w")}
              />
              <label htmlFor="orientation-white">White</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="orientation-black"
                name="orientation"
                value="b"
                checked={settings.orientation === "b"}
                onChange={() => handleOrientationChange("b")}
              />
              <label htmlFor="orientation-black">Black</label>
            </div>
          </div>
        </div>

        <div className="range-slider">
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold" htmlFor="depth">
              Analysis Depth
            </label>
            <p className="text-sm">{settings.depth} / 15</p>
          </div>
          <input
            type="range"
            id="depth"
            name="depth"
            min={5}
            max={15}
            step={1}
            value={settings.depth}
            onChange={(e) => handleDepthChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Fast (5)</span>
            <span>Balanced (8)</span>
            <span>Deep (15)</span>
          </div>
        </div>

        <div className="label">
          <span className="font-bold flex justify-between">
            Engine
            <button
              className="ml-1 w-6 h-6 bg-gray-600 text-white rounded-full text-xs hover:bg-gray-700 inline-flex items-center justify-center"
              onClick={() => setShowEngineHelp(true)}
            >
              ?
            </button>
          </span>
          <select
            name="engine"
            className="select w-full"
            value={settings.engine}
            onChange={(e) => handleEngineChange(e.target.value)}
          >
            <option value="lite-single">Lite single-thread ⚡</option>
            <option value="lite-multi">Lite multi-thread 🚀</option>
            {/* <option value="large-multi">Large multi-thread 🚄</option> */}
            {/* <option value="large-single">Large single-thread 🚂</option> */}
          </select>
        </div>
      </div>

      {showEngineHelp && (
        <div
          className="modal-backdrop"
          onClick={() => setShowEngineHelp(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="card p-4 w-modal relative shadow-xl space-y-4">
              <header className="text-2xl font-bold">Engine</header>
              <article>
                <ul className="space-y-4">
                  <li>
                    <strong>Lite Single-Threaded Engine</strong>: This version
                    is moderately strong, very fast, and small in size
                    (approximately 6MB), making it the best choice for most
                    cases, including browsers that can't handle multiple
                    threads.
                  </li>
                  <li>
                    <strong>Lite Multi-Threaded Engine</strong>: This version is
                    moderately strong, fast, and much smaller in size
                    (approximately 6MB), making it well-suited for most cases.
                  </li>
                  <li>
                    <strong>Large Multi-Threaded Engine</strong>: This is the
                    strongest version of the engine but also the largest
                    (approximately 66MB), best suited for powerful browsers and
                    desktops, though it can take quite some time to load.
                  </li>
                  <li>
                    <strong>Large Single-Threaded Engine</strong>: This version
                    is also strong and fast but slightly less powerful than the
                    multi-threaded one, with a large file size of approximately
                    66MB, ideal for browsers that can't handle multiple threads,
                    though it can take quite some time to load.
                  </li>
                </ul>
              </article>
              <footer className="flex justify-center">
                <button
                  className="btn-icon variant-filled md:absolute md:-top-5 md:-right-5 font-bold shadow-xl"
                  onClick={() => setShowEngineHelp(false)}
                >
                  ✕
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
