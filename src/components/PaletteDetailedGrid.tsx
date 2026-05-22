import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import chroma from 'chroma-js';
import { OptionState } from '../types';
import { PRESETS } from '../presets';
import { generateSequentialColors } from '../utils/palette';

interface PaletteDetailedGridProps {
  currentOptionsCount: number;
  optionStates: OptionState[];
  currentSteps: number;
  onColorChange: (id: number, hex: string) => void;
  onNameChange: (id: number, name: string) => void;
  onSelectPreset: (id: number, hex: string, name: string) => void;
}

export const PaletteDetailedGrid: React.FC<PaletteDetailedGridProps> = ({
  currentOptionsCount,
  optionStates,
  currentSteps,
  onColorChange,
  onNameChange,
  onSelectPreset,
}) => {
  // Store copy feedback alerts per cell path: "${optionId}-${stepIndex}"
  const [copiedCells, setCopiedCells] = useState<Record<string, boolean>>({});

  const handleCopyColor = (colorHex: string, cellKey: string) => {
    navigator.clipboard.writeText(colorHex.toUpperCase()).then(() => {
      setCopiedCells((prev) => ({ ...prev, [cellKey]: true }));
      setTimeout(() => {
        setCopiedCells((prev) => ({ ...prev, [cellKey]: false }));
      }, 1000);
    });
  };

  // Group presets by category dynamically
  const categories = Array.from(new Set(PRESETS.map((p) => p.cat)));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start" id="palette-grid-container">
      {optionStates.slice(0, currentOptionsCount).map((opt) => {
        const colors = generateSequentialColors(opt.baseColor, currentSteps);

        return (
          <motion.div
            key={opt.id}
            id={`option-card-anchor-${opt.id}`}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col scroll-mt-28"
          >
            {/* Header / Editor controls area */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => onNameChange(opt.id, e.target.value)}
                  className="bg-transparent font-bold text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded-md px-2 py-0.5 border border-transparent hover:border-gray-200 transition-all"
                  placeholder={`Option ${opt.id}`}
                  id={`edit-title-${opt.id}`}
                />
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full tracking-wider">
                  Option {opt.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preset Dropdown list */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    デザイナー厳選プリセット
                  </label>
                  <select
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-medium transition-colors"
                    value={opt.baseColor.toLowerCase()}
                    onChange={(e) => {
                      const selectedPreset = PRESETS.find((p) => p.hex.toLowerCase() === e.target.value.toLowerCase());
                      if (selectedPreset) {
                        onSelectPreset(opt.id, selectedPreset.hex, selectedPreset.name);
                      }
                    }}
                    id={`preset-select-${opt.id}`}
                  >
                    <option value="" disabled>-- プリセットを選択 --</option>
                    {categories.map((cat) => (
                      <optgroup label={cat} key={cat} className="font-bold text-xs">
                        {PRESETS.filter((p) => p.cat === cat).map((p) => (
                          <option
                            value={p.hex.toLowerCase()}
                            key={p.name}
                            className="font-medium text-xs text-gray-700"
                          >
                            {p.name} ({p.hex.toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Fine tuning controls */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    ベース色を精密微調整
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8.5 h-8.5 rounded-lg border border-gray-200 overflow-hidden shrink-0 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                      <input
                        type="color"
                        value={opt.baseColor}
                        onChange={(e) => onColorChange(opt.id, e.target.value)}
                        className="absolute -inset-2 cursor-pointer w-12 h-12 border-none p-0 bg-transparent"
                        id={`grid-color-picker-${opt.id}`}
                      />
                    </div>
                    <input
                      type="text"
                      value={opt.baseColor.toUpperCase()}
                      onChange={(e) => onColorChange(opt.id, e.target.value)}
                      placeholder="#000000"
                      className="mono text-xs w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase font-semibold transition-all"
                      id={`grid-color-text-${opt.id}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Steps List container */}
            <div className="flex flex-col divide-y divide-gray-100 flex-grow" id={`discrete-steps-list-${opt.id}`}>
              {colors.map((color, i) => {
                const stepPercent = Math.round(((i + 1) / currentSteps) * 100);
                const isLight = chroma(color).luminance() > 0.45;
                const textColor = isLight ? '#0f172a' : '#ffffff';
                const cellKey = `${opt.id}-${i}`;
                const isCopied = !!copiedCells[cellKey];

                return (
                  <div
                    key={cellKey}
                    onClick={() => handleCopyColor(color, cellKey)}
                    style={{ backgroundColor: color, color: textColor }}
                    className="flex items-center justify-between px-6 py-3 cursor-pointer hover:saturate-150 transition-all duration-150 group relative active:opacity-90 active:scale-[0.99]"
                    id={`color-step-${opt.id}-${i}`}
                  >
                    {/* Step Label */}
                    <span className="text-xs font-bold tracking-wide flex items-center gap-2 select-none">
                      {opt.name} {stepPercent}
                    </span>

                    {/* HEX Hex Data and Copy indicator */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold opacity-80 group-hover:opacity-100 uppercase select-all transition-opacity">
                        {color.toUpperCase()}
                      </span>
                      <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                    </div>

                    {/* Smooth overlay animation for copy success */}
                    <AnimatePresence>
                      {isCopied && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs font-bold gap-2 rounded z-10 pointer-events-none"
                          id={`toast-overlay-${cellKey}`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>クリップボードにコピー！</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
