import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import chroma from 'chroma-js';
import { 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Image as ImageIcon, 
  FileJson,
  FileCode,
  Palette,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { SelectedCell } from '../types';

interface CustomPaletteBuilderProps {
  selectedCells: SelectedCell[];
  onRemoveCell: (key: string) => void;
  onClearAll: () => void;
  onReorderCells: (startIndex: number, endIndex: number) => void;
}

type ExportTab = 'css' | 'tailwind' | 'json' | 'svg' | 'png';

export const CustomPaletteBuilder: React.FC<CustomPaletteBuilderProps> = ({
  selectedCells,
  onRemoveCell,
  onClearAll,
  onReorderCells,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Responsive device check for desktop drag feature
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // Drag & Drop reorder tracking
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDropAfter, setIsDropAfter] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Touch Drag & Drop reorder tracking for Mobile/iPad
  const handleTouchStart = (_e: React.TouchEvent, idx: number) => {
    isDraggingRef.current = true;
    setDraggedIndex(idx);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;

    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;

    const chipElement = element.closest('[data-chip-index]');
    if (chipElement) {
      const overIdx = parseInt(chipElement.getAttribute('data-chip-index') || '');
      if (!isNaN(overIdx)) {
        const rect = chipElement.getBoundingClientRect();
        const x = clientX - rect.left;
        const after = x > rect.width / 2;

        if (dragOverIndex !== overIdx || isDropAfter !== after) {
          setDragOverIndex(overIdx);
          setIsDropAfter(after);
        }
      }
    } else {
      setDragOverIndex(null);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (draggedIndex !== null && dragOverIndex !== null) {
      let targetIdx = dragOverIndex;
      if (isDropAfter) {
        targetIdx = draggedIndex < dragOverIndex ? dragOverIndex : dragOverIndex + 1;
      } else {
        targetIdx = draggedIndex < dragOverIndex ? dragOverIndex - 1 : dragOverIndex;
      }
      targetIdx = Math.max(0, Math.min(selectedCells.length - 1, targetIdx));

      if (draggedIndex !== targetIdx) {
        onReorderCells(draggedIndex, targetIdx);
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDropAfter(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (selectedCells.length === 0) {
    return (
      <div 
        className="hidden lg:block bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-8 text-center transition-colors" 
        id="custom-palette-empty"
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3 animate-pulse">
          <Palette className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300">オリジナルパレットを作成しよう</h3>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          上の詳細パレットリストのカラー（グラデーション各ステップ）をクリックすると、ここに色を追加して自分だけのカスタムパレットを構築できます。
        </p>
      </div>
    );
  }

  // --- Export Code Generaters ---

  const getCSSCode = () => {
    const vars = selectedCells.map((c, i) => `  --color-${i + 1}: ${c.color.toLowerCase()};`).join('\n');
    const hexList = selectedCells.map(c => c.color.toLowerCase()).join(', ');
    const gradient = `  background: linear-gradient(90deg, ${hexList});`;
    return `/* Custom Palette CSS Variables */\n:root {\n${vars}\n}\n\n/* Linear Gradient CSS */\n.custom-gradient {\n${gradient}\n}`;
  };

  const getTailwindCode = () => {
    const colors = selectedCells.map((c, i) => `          ${i + 1}: '${c.color.toLowerCase()}',`).join('\n');
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        custom: {\n${colors}\n        }\n      }\n    }\n  }\n}`;
  };

  const getJSONCode = () => {
    return JSON.stringify(selectedCells.map(c => c.color.toUpperCase()), null, 2);
  };

  // --- Export Actions ---

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const downloadSVG = () => {
    const chipWidth = 70;
    const chipHeight = 90;
    const padding = 30;
    const width = selectedCells.length * chipWidth + padding * 2;
    const height = chipHeight + padding * 2 + 20;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; border-radius:16px;">`;
    
    // Soft Background Header bar
    svgContent += `<rect x="0" y="0" width="${width}" height="50" fill="#ffffff" />`;
    // Title
    svgContent += `<text x="${padding}" y="32" font-size="13" font-weight="bold" fill="#0f172a">SEQUENTIAL CUSTOM PALETTE</text>`;
    svgContent += `<text x="${width - padding}" y="32" font-size="10" fill="#94a3b8" text-anchor="end">${selectedCells.length} Colors | Generated via SPG</text>`;
    
    selectedCells.forEach((cell, index) => {
      const x = padding + index * chipWidth;
      const y = 75;
      svgContent += `
        <rect x="${x}" y="${y}" width="${chipWidth - 8}" height="${chipHeight - 25}" rx="8" fill="${cell.color}" />
        <text x="${x + (chipWidth - 8)/2}" y="${y + chipHeight - 10}" font-size="10" font-family="monospace" font-weight="bold" fill="#334155" text-anchor="middle">${cell.color.toUpperCase()}</text>
        <text x="${x + (chipWidth - 8)/2}" y="${y + chipHeight + 5}" font-size="8" fill="#94a3b8" text-anchor="middle">Color ${index + 1}</text>
      `;
    });
    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-palette-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorsCount = selectedCells.length;
    const chipWidth = 110;
    const chipHeight = 130;
    const padding = 40;
    
    // 3x High-Resolution Resolution Scaling Multiplier
    const scale = 3;
    
    const logicalWidth = colorsCount * chipWidth + padding * 2;
    const logicalHeight = 320;

    canvas.width = logicalWidth * scale;
    canvas.height = logicalHeight * scale;

    // Apply the scaling factor to render shapes and text elements crisply
    ctx.scale(scale, scale);

    // Background fill (crisp white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Header Text
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Sequential Custom Palette', padding, 50);

    // Subtitle
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString()} | ${colorsCount} Colors`, padding, 70);

    // Draw Chips
    selectedCells.forEach((cell, index) => {
      const x = padding + index * chipWidth;
      const y = 100;
      const rectWidth = chipWidth - 14;
      const rectHeight = chipHeight;

      // Color block
      ctx.fillStyle = cell.color;
      ctx.beginPath();
      // Safe rounded rect helper
      const radius = 10;
      if (ctx.roundRect) {
        ctx.roundRect(x, y, rectWidth, rectHeight, radius);
      } else {
        ctx.rect(x, y, rectWidth, rectHeight);
      }
      ctx.fill();

      // Draw HEX label
      ctx.font = 'bold 11px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'center';
      ctx.fillText(cell.color.toUpperCase(), x + rectWidth / 2, y + rectHeight + 25);

      // Draw index label
      ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(`Color ${index + 1}`, x + rectWidth / 2, y + rectHeight + 40);
    });

    // Download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `custom-palette-${Date.now()}.png`;
    link.click();
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'css': return getCSSCode();
      case 'tailwind': return getTailwindCode();
      case 'json': return getJSONCode();
      default: return '';
    }
  };

  // Morphs desktop container between minimized button and full-sized widget
  const containerVariants = {
    expanded: {
      width: 380,
      height: 'auto',
      borderRadius: 24,
      padding: 24,
      transition: { type: 'spring', stiffness: 350, damping: 28 }
    },
    minimized: {
      width: 56,
      height: 56,
      borderRadius: 9999,
      padding: 0,
      transition: { type: 'spring', stiffness: 350, damping: 28 }
    }
  };

  return (
    <motion.div
      key={isDesktop ? 'desktop' : 'mobile'}
      drag={isDesktop}
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => {
        isDraggingRef.current = false;
      }}
      onDrag={(_event, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          isDraggingRef.current = true;
        }
      }}
      onDragEnd={(_event, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          isDraggingRef.current = true;
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 200);
        } else {
          isDraggingRef.current = false;
        }
      }}
      animate={isDesktop && isMinimized ? 'minimized' : 'expanded'}
      variants={isDesktop ? containerVariants : undefined}
      className={`transition-colors duration-200
        ${isDesktop 
          ? `fixed bottom-10 right-10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl z-50 flex flex-col gap-6 cursor-default select-none overflow-hidden` 
          : `fixed bottom-0 left-0 right-0 z-40 bg-white/96 dark:bg-slate-900/96 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800/85 shadow-[0_-10px_35px_rgba(0,0,0,0.12)] px-5 py-4 transition-all duration-300 ease-in-out flex flex-col gap-4
             ${isMobileExpanded ? 'max-h-[85vh] overflow-y-auto rounded-t-3xl pb-8' : 'max-h-[72px] overflow-hidden rounded-t-xl pb-3'}`
        }`}
      id="custom-palette-builder-container"
    >
      <canvas ref={canvasRef} className="hidden" />

      {isDesktop && isMinimized ? (
        <div 
          onClick={() => {
            if (!isDraggingRef.current) {
              setIsMinimized(false);
            }
          }}
          className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-tr from-indigo-650/90 via-indigo-550/95 to-violet-500/90 backdrop-blur-md border border-white/20 dark:border-white/10 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(99,102,241,0.45)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
          title="カスタムパレットビルダーを展開"
        >
          <Palette className="w-5.5 h-5.5 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Header section with counts, minimize and clear buttons */}
          <div 
            className={`flex items-center justify-between cursor-pointer select-none ${isDesktop ? 'lg:cursor-move' : 'lg:cursor-default'}`}
            onClick={() => {
              if (!isDesktop) {
                setIsMobileExpanded(!isMobileExpanded);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                  <span>カスタムカラービルダー</span>
                  
                  {/* Expand badge only on Mobile/Tablet */}
                  <span className="lg:hidden text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-1">
                    {isMobileExpanded ? (
                      <>
                        <span>閉じる</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </>
                    ) : (
                      <>
                        <span>展開</span>
                        <ChevronUp className="w-2.5 h-2.5" />
                      </>
                    )}
                  </span>
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                  選択カラー: <span className="text-indigo-600 dark:text-indigo-450 font-bold font-mono">{selectedCells.length} 色</span>
                  {isDesktop && <span className="text-[9px] text-indigo-400/80 ml-2 font-normal lowercase">(ドラッグ移動可)</span>}
                </p>
              </div>
            </div>

            {/* Action buttons inside header */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {/* PC Minimize Button */}
              {isDesktop && (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                  title="ビルダーを円形に最小化"
                  onMouseDown={(e) => e.stopPropagation()} // ドラッグ開始を防止
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClearAll}
                className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="すべての選択を解除"
                onMouseDown={(e) => e.stopPropagation()} // ドラッグ開始を防止
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">クリア</span>
              </button>
            </div>
          </div>
          
          <div 
            className="flex flex-wrap items-center gap-3 pt-4 pb-3 px-2"
            onMouseDown={(e) => e.stopPropagation()} // チップ操作でカードがドラッグするのを防止
          >
            <AnimatePresence initial={false}>
              {selectedCells.map((cell, idx) => {
                const isLight = chroma(cell.color).luminance() > 0.45;
                const textContrastColor = isLight ? '#0f172a' : '#ffffff';

                const isCurrentlyDragged = draggedIndex === idx;
                const isCurrentlyDragOver = dragOverIndex === idx;

                return (
                  <motion.div
                    key={cell.key}
                    data-chip-index={idx}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ 
                      opacity: isCurrentlyDragged ? 0.4 : 1, 
                      scale: isCurrentlyDragged ? 0.95 : 1, 
                      x: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 15 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ backgroundColor: cell.color }}
                    className={`w-12 h-16 rounded-xl flex flex-col justify-between p-2 shadow-xs shrink-0 relative group hover:scale-105 transition-all duration-100 cursor-grab active:cursor-grabbing border border-black/5 touch-none`}
                    draggable={true}
                    onTouchStart={(e) => handleTouchStart(e, idx)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDragStart={(e) => {
                      setDraggedIndex(idx);
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', idx.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const after = x > rect.width / 2;
                      
                      if (dragOverIndex !== idx || isDropAfter !== after) {
                        setDragOverIndex(idx);
                        setIsDropAfter(after);
                      }
                    }}
                    onDragLeave={() => {
                      setDragOverIndex(null);
                      setIsDropAfter(false);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                      setIsDropAfter(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const startIdx = parseInt(e.dataTransfer.getData('text/plain'));
                      if (startIdx !== idx && !isNaN(startIdx)) {
                        let targetIdx = idx;
                        if (isDropAfter) {
                          targetIdx = startIdx < idx ? idx : idx + 1;
                        } else {
                          targetIdx = startIdx < idx ? idx - 1 : idx;
                        }
                        targetIdx = Math.max(0, Math.min(selectedCells.length - 1, targetIdx));
                        onReorderCells(startIdx, targetIdx);
                      }
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                      setIsDropAfter(false);
                    }}
                    title="ドラッグしてパレットの順序を並び替え"
                  >
                    {/* Index badge */}
                    <div 
                      style={{ color: textContrastColor }} 
                      className="text-[9px] font-extrabold bg-black/10 backdrop-blur-xs w-4 h-4 rounded-full flex items-center justify-center select-none"
                    >
                      {idx + 1}
                    </div>

                    {/* HEX display inside */}
                    <div 
                      style={{ color: textContrastColor }} 
                      className="font-mono text-[8px] font-bold tracking-tighter uppercase text-center select-all opacity-85 group-hover:opacity-100"
                    >
                      {cell.color}
                    </div>

                    {/* 左側の挿入インジケータ（光る縦線） */}
                    {isCurrentlyDragOver && !isDropAfter && !isCurrentlyDragged && (
                      <div className="absolute -left-[7px] top-0 bottom-0 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.85)] z-20 animate-pulse pointer-events-none" />
                    )}

                    {/* 右側の挿入インジケータ（光る縦線） */}
                    {isCurrentlyDragOver && isDropAfter && !isCurrentlyDragged && (
                      <div className="absolute -right-[7px] top-0 bottom-0 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.85)] z-20 animate-pulse pointer-events-none" />
                    )}

                    {/* Hover Delete Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCell(cell.key);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md scale-100 lg:scale-0 lg:group-hover:scale-100 transition-transform duration-150 cursor-pointer"
                      title="この色を削除"
                    >
                      <span className="text-[10px] font-bold leading-none">×</span>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

      {/* Exports / Download Area */}
      <div className="border-t border-gray-100 dark:border-slate-800/80 pt-5 flex flex-col gap-4">
        <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
          開発・デザイン用エクスポート
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 items-start">
          
          {/* Tab Selector Column */}
          <div className="flex flex-row lg:flex-wrap gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                activeTab === 'css'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-100/50 dark:border-indigo-900/50'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>CSS 変数</span>
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                activeTab === 'tailwind'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-100/50 dark:border-indigo-900/50'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Tailwind</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-100/50 dark:border-indigo-900/50'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => setActiveTab('svg')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                activeTab === 'svg'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-100/50 dark:border-indigo-900/50'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG 画像</span>
            </button>
            <button
              onClick={() => setActiveTab('png')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 cursor-pointer ${
                activeTab === 'png'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-100/50 dark:border-indigo-900/50'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PNG カード</span>
            </button>
          </div>

          {/* Export Content Panel */}
          <div className="bg-gray-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-4 min-h-[140px] flex flex-col justify-between transition-colors">
            {activeTab === 'svg' || activeTab === 'png' ? (
              
              // Binary Downloads Panel
              <div className="flex flex-col items-center justify-center flex-grow gap-2.5 py-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100/60 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <h5 className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    {activeTab === 'svg' ? 'SVG ベクター画像' : 'PNG パレットカード'}
                  </h5>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto leading-normal">
                    {activeTab === 'svg' 
                      ? 'ベクター形式で美しく整理されたSVGファイルをダウンロード保存します。'
                      : '高解像度パレットカードを Canvas で描画し、PNG保存します。'}
                  </p>
                </div>
                <button
                  onClick={activeTab === 'svg' ? downloadSVG : downloadPNG}
                  className="mt-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>保存する</span>
                </button>
              </div>
            ) : (
              
              // Code Copiers Panel
              <>
                <pre className="font-mono text-[10px] text-gray-600 dark:text-slate-400 overflow-x-auto whitespace-pre leading-relaxed select-all max-h-[120px] custom-scrollbar">
                  {getActiveCode()}
                </pre>
                <div className="border-t border-gray-200/50 dark:border-slate-800/40 mt-3 pt-3 flex justify-end">
                  <button
                    onClick={() => handleCopyCode(getActiveCode())}
                    className={`text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCopied 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40' 
                        : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>コピー成功</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>コードをコピー</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )}
</motion.div>
  );
};
