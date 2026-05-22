import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import chroma from 'chroma-js';
import { OptionState } from '../types';
import { getRecommendedColors } from '../utils/palette';

interface SummaryDashboardProps {
  currentOptionsCount: number;
  optionStates: OptionState[];
  onColorChange: (id: number, hex: string) => void;
  onNameChange: (id: number, name: string) => void;
  onSelectPreset: (id: number, hex: string, name: string) => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  currentOptionsCount,
  optionStates,
  onColorChange,
  onNameChange,
  onSelectPreset,
}) => {
  const [activePopupId, setActivePopupId] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActivePopupId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToDetail = (id: number) => {
    const el = document.getElementById(`option-card-anchor-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" id="summary-dashboard-container">
      {optionStates.slice(0, currentOptionsCount).map((opt) => {
        // Calculate Delta E distance score against other active colors if popup is active
        const otherColors = optionStates
          .slice(0, currentOptionsCount)
          .filter((o) => o.id !== opt.id)
          .map((o) => o.baseColor);

        const recs = getRecommendedColors(opt.id, currentOptionsCount, optionStates, 5);

        return (
          <motion.div
            key={opt.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            id={`summary-card-${opt.id}`}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs relative flex flex-col gap-3 group hover:shadow-md hover:border-gray-200 transition-all"
          >
            {/* Card Header: Title & Navigation */}
            <div className="flex items-center justify-between gap-1.5">
              <input
                type="text"
                value={opt.name}
                onChange={(e) => onNameChange(opt.id, e.target.value)}
                className="text-xs font-bold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-indigo-500 focus:outline-none px-0.5 py-0.5 transition-colors w-3/4 truncate"
                placeholder={`Option ${opt.id}`}
              />
              <button
                onClick={() => scrollToDetail(opt.id)}
                title="詳細パレットへスクロール"
                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                id={`btn-scroll-${opt.id}`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Color Field Controls */}
            <div className="flex items-center gap-2.5">
              {/* Color Picker Box */}
              <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden shrink-0 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all">
                <input
                  type="color"
                  value={opt.baseColor}
                  onChange={(e) => onColorChange(opt.id, e.target.value)}
                  className="absolute -inset-2 cursor-pointer w-14 h-14 border-none p-0 bg-transparent"
                  id={`color-picker-input-${opt.id}`}
                />
              </div>

              {/* Text Input Block with Recommendation Trigger button */}
              <div className="relative flex-grow flex items-center">
                <input
                  type="text"
                  value={opt.baseColor.toUpperCase()}
                  onChange={(e) => onColorChange(opt.id, e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-xs font-semibold w-full bg-gray-50 border border-gray-100 rounded-lg pl-2 border-r-0 rounded-r-none py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
                  id={`color-hex-input-${opt.id}`}
                  onFocus={() => setActivePopupId(opt.id)}
                />
                <button
                  onClick={() => setActivePopupId(activePopupId === opt.id ? null : opt.id)}
                  className={`px-2.5 py-2 shrink-0 border border-l-0 ${
                    activePopupId === opt.id 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-indigo-600'
                  } rounded-r-lg transition-colors flex items-center justify-center`}
                  title="調和推奨カラーを表示"
                  id={`btn-recommend-${opt.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Micro details of Contrast status */}
            {otherColors.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>
                  平均他色相差:{' '}
                  <span className="font-semibold text-gray-600 font-mono">
                    {Math.round(
                      otherColors.reduce((acc, c) => acc + chroma.deltaE(opt.baseColor, c), 0) /
                        otherColors.length
                    )}
                  </span>
                </span>
              </div>
            )}

            {/* Recommendation Popup Container */}
            <AnimatePresence>
              {activePopupId === opt.id && (
                <motion.div
                  ref={popupRef}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 z-30 flex flex-col gap-2.5"
                  id={`recommend-popup-${opt.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      調和推奨パレット (色差極大)
                    </span>
                    <div className="group/help relative cursor-pointer text-gray-400 hover:text-gray-600">
                      <HelpCircle className="w-3 h-3" />
                      <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/help:block w-48 bg-gray-900 text-white text-[9px] leading-relaxed p-2 rounded-lg z-50">
                        選択中の他色と混同されにくく、かつプロのカラーセンスが維持される高色差色をDeltaE94空間から逆算しています。
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {recs.map((rec) => {
                      // Calculate the min Delta E for this recommendation against other colors to show strength
                      const minDelta = otherColors.length > 0 
                        ? Math.round(Math.min(...otherColors.map(oc => chroma.deltaE(rec.hex, oc))))
                        : null;

                      return (
                        <button
                          key={rec.hex}
                          onClick={() => {
                            onSelectPreset(opt.id, rec.hex, rec.name);
                            setActivePopupId(null);
                          }}
                          style={{ backgroundColor: rec.hex }}
                          className="aspect-square rounded-lg border border-black/5 hover:scale-110 hover:shadow-md transition-all relative group cursor-pointer focus:outline-none"
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-40">
                            <div className="bg-gray-950 text-white text-[9px] py-1 px-2 rounded-md whitespace-nowrap shadow-lg flex flex-col items-center">
                              <span className="font-bold">{rec.name}</span>
                              <span className="font-mono text-gray-400 uppercase text-[8px]">{rec.hex}</span>
                              {minDelta !== null && (
                                <span className="text-emerald-400 text-[8px] font-medium mt-0.5">
                                  色差: {minDelta} (高識別)
                                </span>
                              )}
                            </div>
                            <div className="w-1.5 h-1.5 bg-gray-950 rotate-45 mx-auto -mt-1"></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
