import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Sparkles, CheckCircle2 } from 'lucide-react';
import chroma from 'chroma-js';
import { OptionState, SelectedCell } from '../types';
import { PRESETS } from '../presets';
import { generateSequentialColors } from '../utils/palette';

interface PaletteDetailedGridProps {
  currentOptionsCount: number;
  optionStates: OptionState[];
  currentSteps: number;
  onColorChange: (id: number, hex: string) => void;
  onNameChange: (id: number, name: string) => void;
  onSelectPreset: (id: number, hex: string, name: string) => void;
  selectedCells: SelectedCell[];
  onToggleCell: (key: string, color: string) => void;
  gridCols: number;
  onChangeGridCols: (cols: number) => void;
  paddingY: number;
  onChangePaddingY: (py: number) => void;
  paddingX: number;
  onChangePaddingX: (px: number) => void;
}

export const PaletteDetailedGrid: React.FC<PaletteDetailedGridProps> = ({
  currentOptionsCount,
  optionStates,
  currentSteps,
  onColorChange,
  onNameChange,
  onSelectPreset,
  selectedCells,
  onToggleCell,
  gridCols,
  onChangeGridCols,
  paddingY,
  onChangePaddingY,
  paddingX,
  onChangePaddingX,
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

  const pyClassMap: Record<number, string> = {
    1: 'py-1',
    2: 'py-2.5',
    3: 'py-4',
    4: 'py-5.5',
    5: 'py-7',
  };

  const pxClassMap: Record<number, string> = {
    1: 'px-2',
    2: 'px-4',
    3: 'px-6',
    4: 'px-8',
    5: 'px-10',
  };

  const gridColsClassMap: Record<number, string> = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
  };

  const currentPyClass = pyClassMap[paddingY] || 'py-3';
  const currentPxClass = pxClassMap[paddingX] || 'px-6';
  const currentGridColsClass = gridColsClassMap[gridCols] || 'lg:grid-cols-3';

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Density & Grid Layout Options Controls Panel */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 transition-colors duration-250">
        
        {/* Grid Column Selector for PC */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
            レイアウト
          </label>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
            {([2, 3, 4, 5] as const).map((num) => (
              <button
                key={num}
                onClick={() => onChangeGridCols(num)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  gridCols === num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
                }`}
              >
                {num} 列
              </button>
            ))}
          </div>
        </div>

        {/* Divider for MD screen */}
        <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-800/80"></div>

        {/* Sliders for Padding Adjustments */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 flex-grow">
          {/* Vertical Density (paddingY) */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
              <span>セルの高さ</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">Lv.{paddingY}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Visual level representation (small dot for short, tall bar for tall) */}
              <div className="w-1.5 h-1.5 bg-slate-350 dark:bg-slate-700 rounded-full shrink-0" title="小" />
              <input
                type="range"
                min="1"
                max="5"
                value={paddingY}
                onChange={(e) => onChangePaddingY(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-1.5 h-3.5 bg-slate-450 dark:bg-slate-600 rounded-full shrink-0" title="大" />
            </div>
          </div>

          {/* Horizontal Density (paddingX) */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
              <span>セルの横幅</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">Lv.{paddingX}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Visual level representation (narrow width round bar for narrow, wide round bar for wide) */}
              <div className="w-1.5 h-1.5 bg-slate-350 dark:bg-slate-700 rounded-xs shrink-0" title="小" />
              <input
                type="range"
                min="1"
                max="5"
                value={paddingX}
                onChange={(e) => onChangePaddingX(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-3.5 h-1.5 bg-slate-450 dark:bg-slate-600 rounded-xs shrink-0" title="大" />
            </div>
          </div>
        </div>

      </div>

      {/* Grid container with device optimized layouts */}
      <div 
        className={`w-full flex flex-row overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth items-start sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:pb-0 sm:gap-5 lg:grid lg:overflow-visible ${currentGridColsClass} lg:gap-6 custom-scrollbar`} 
        id="palette-grid-container"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {optionStates.slice(0, currentOptionsCount).map((opt) => {
          const colors = generateSequentialColors(opt.baseColor, currentSteps);

          return (
            <motion.div
              key={opt.id}
              id={`option-card-anchor-${opt.id}`}
              layout="position"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col scroll-mt-28 snap-center shrink-0 w-[88vw] sm:w-full lg:w-full transition-colors duration-200"
            >
              {/* Header / Editor controls area */}
              <div className="p-5 border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-950/20 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => onNameChange(opt.id, e.target.value)}
                    className="bg-transparent font-bold text-gray-800 dark:text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 rounded-md px-2 py-0.5 border border-transparent hover:border-gray-250 dark:hover:border-slate-800 transition-all"
                    placeholder={`Option ${opt.id}`}
                    id={`edit-title-${opt.id}`}
                  />
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/50 dark:border-indigo-900/30 px-2 py-0.5 rounded-full tracking-wider shrink-0 select-none">
                    Option {opt.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preset Dropdown list */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      厳選プリセット
                    </label>
                    <select
                      className="w-full text-xs bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-950 text-gray-700 dark:text-slate-350 font-medium transition-colors"
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
                        <optgroup label={cat} key={cat} className="font-bold text-xs bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">
                          {PRESETS.filter((p) => p.cat === cat).map((p) => (
                            <option
                              value={p.hex.toLowerCase()}
                              key={p.name}
                              className="font-medium text-xs text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900"
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
                    <label className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider select-none">
                      ベース色を精密微調整
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8.5 h-8.5 rounded-lg border border-gray-200 dark:border-slate-850 overflow-hidden shrink-0 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-[transform,border-color] duration-150">
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
                        className="mono text-xs w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-950 uppercase font-semibold transition-all dark:text-slate-200"
                        id={`grid-color-text-${opt.id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scale Steps List container */}
              <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800/80 flex-grow" id={`discrete-steps-list-${opt.id}`}>
                {colors.map((color, i) => {
                  const stepPercent = Math.round(((i + 1) / currentSteps) * 100);
                  const isLight = chroma(color).luminance() > 0.45;
                  const textColor = isLight ? '#1e293b' : '#ffffff';
                  const cellKey = `${opt.id}-${i}`;
                  const isCopied = !!copiedCells[cellKey];

                  // 選択状態と選択順序インデックスの取得
                  const selectedIndex = selectedCells.findIndex((c) => c.key === cellKey);
                  const isSelected = selectedIndex !== -1;

                  return (
                    <div
                      key={cellKey}
                      onClick={() => onToggleCell(cellKey, color)}
                      style={{ 
                        backgroundColor: color, 
                        color: textColor,
                      }}
                      className={`flex items-center justify-between ${currentPxClass} ${currentPyClass} cursor-pointer transition-all duration-150 group relative active:opacity-90 ${
                        isSelected 
                          ? 'ring-4 ring-indigo-600 ring-inset scale-[0.99] saturate-125 z-10' 
                          : 'hover:saturate-150'
                      }`}
                      id={`color-step-${opt.id}-${i}`}
                    >
                      {/* Step Label with Selection Badge */}
                      <span className="text-xs font-bold tracking-wide flex items-center gap-2 select-none">
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-white dark:border-slate-900 shadow-sm animate-scaleUp">
                            {selectedIndex + 1}
                          </span>
                        )}
                        <span>{opt.name} {stepPercent}</span>
                      </span>

                      {/* HEX Hex Data and Copy indicator (Isolated click for Copying) */}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-semibold opacity-80 group-hover:opacity-100 uppercase select-all transition-opacity">
                          {color.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // セルの選択トグルを発火させない
                            handleCopyColor(color, cellKey);
                          }}
                          className="p-1 rounded-md hover:bg-black/10 text-current transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                          title="この色をコピー"
                        >
                          <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>

                      {/* Smooth overlay animation for copy success */}
                      <AnimatePresence>
                        {isCopied && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="absolute inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center text-white text-xs font-bold gap-2 rounded z-20 pointer-events-none"
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
    </div>
  );
};
