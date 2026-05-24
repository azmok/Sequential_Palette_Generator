import { useState, useEffect } from 'react';
import { Palette, Layers, ListOrdered, Sun, Moon, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { OptionState, SelectedCell } from './types';
import { SummaryDashboard } from './components/SummaryDashboard';
import { PaletteDetailedGrid } from './components/PaletteDetailedGrid';
import { CustomPaletteBuilder } from './components/CustomPaletteBuilder';
import { ExportSection } from './components/ExportSection';

const DEFAULT_OPTIONS_COUNT = 4;
const DEFAULT_STEPS = 10;
const DEFAULT_OPTION_STATES: OptionState[] = [
  { id: 1, name: "Classic Blue", baseColor: "#0f62fe" },
  { id: 2, name: "Carbon Purple", baseColor: "#8a3ffc" },
  { id: 3, name: "Cyan Data", baseColor: "#0072c3" },
  { id: 4, name: "Carbon Teal", baseColor: "#009d9a" },
  { id: 5, name: "IBM Orange 60", baseColor: "#ba4e00" },
  { id: 6, name: "Forest Green", baseColor: "#198038" },
  { id: 7, name: "Crimson Red", baseColor: "#da1e28" },
  { id: 8, name: "Tangerine", baseColor: "#f28e2b" },
  { id: 9, name: "Royal Purple", baseColor: "#6929c4" },
  { id: 10, name: "Hot Pink", baseColor: "#ff69b4" },
];

export default function App() {
  // 1. Theme State & LocalStorage Persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Check OS system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  // Apply theme class to HTML root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 2. Cache / Persistent Storage States
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentOptionsCount, setCurrentOptionsCount] = useState<number>(DEFAULT_OPTIONS_COUNT);
  const [currentSteps, setCurrentSteps] = useState<number>(DEFAULT_STEPS);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [optionStates, setOptionStates] = useState<OptionState[]>(DEFAULT_OPTION_STATES);

  // New UI preferences (session persisted)
  const [paddingY, setPaddingY] = useState<number>(2);
  const [paddingX, setPaddingX] = useState<number>(2);

  // Temporary feedback toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile Header Accordion toggle state
  const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronous recovery on mount with 2-day expiration check
  useEffect(() => {
    const savedSession = localStorage.getItem('SPG_SESSION_DB');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const diffTime = Date.now() - parsed.lastAccessed;
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

        if (diffTime > twoDaysInMs) {
          console.log('Session cache expired (2+ days). Resetting to defaults.');
          localStorage.removeItem('SPG_SESSION_DB');
          showToast('2日以上アクセスがなかったため、キャッシュをリセットしました 🧹');
        } else {
          if (typeof parsed.currentOptionsCount === 'number') setCurrentOptionsCount(parsed.currentOptionsCount);
          if (typeof parsed.currentSteps === 'number') setCurrentSteps(parsed.currentSteps);
          if (Array.isArray(parsed.selectedCells)) setSelectedCells(parsed.selectedCells);
          if (Array.isArray(parsed.optionStates)) setOptionStates(parsed.optionStates);
          if (typeof parsed.paddingY === 'number') setPaddingY(parsed.paddingY);
          if (typeof parsed.paddingX === 'number') setPaddingX(parsed.paddingX);
          console.log('Session successfully recovered from database cache.');
        }
      } catch (err) {
        console.error('Failed to parse persistent session cache:', err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!isLoaded) return;
    const sessionData = {
      currentOptionsCount,
      currentSteps,
      selectedCells,
      optionStates,
      paddingY,
      paddingX,
      lastAccessed: Date.now()
    };
    localStorage.setItem('SPG_SESSION_DB', JSON.stringify(sessionData));
  }, [currentOptionsCount, currentSteps, selectedCells, optionStates, paddingY, paddingX, isLoaded]);

  // Clear Session Cache function
  const handleClearCache = () => {
    if (window.confirm('保存されているセッションキャッシュを完全に削除し、初期状態にリセットしますか？')) {
      localStorage.removeItem('SPG_SESSION_DB');
      setCurrentOptionsCount(DEFAULT_OPTIONS_COUNT);
      setCurrentSteps(DEFAULT_STEPS);
      setSelectedCells([]);
      setOptionStates(DEFAULT_OPTION_STATES);
      setPaddingY(2);
      setPaddingX(2);
      showToast('セッションキャッシュをクリアし、初期化しました 🧹');
    }
  };

  // Drag and Drop reordering handler
  const handleReorderCells = (startIndex: number, endIndex: number) => {
    setSelectedCells((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handleColorChange = (id: number, hex: string) => {
    setOptionStates((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, baseColor: hex } : opt))
    );
  };

  const handleNameChange = (id: number, name: string) => {
    setOptionStates((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, name: name } : opt))
    );
  };

  const handleSelectPreset = (id: number, hex: string, name: string) => {
    setOptionStates((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, baseColor: hex, name: name } : opt))
    );
  };

  const handleToggleCell = (key: string, color: string) => {
    setSelectedCells((prev) => {
      const exists = prev.some((c) => c.key === key);
      if (exists) {
        return prev.filter((c) => c.key !== key);
      } else {
        return [...prev, { key, color }];
      }
    });
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-950/50 selection:text-indigo-900 transition-colors duration-250" id="app-root-container">
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-slideDown font-bold text-xs select-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upper Navigation Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 py-3.5 md:py-5 px-4 sm:px-8 sticky top-0 z-40 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title and Mobile Toggle bar */}
          <div 
            className="flex items-center justify-between cursor-pointer md:cursor-default select-none"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsHeaderExpanded(!isHeaderExpanded);
              }
            }}
          >
            <div>
              <h1 className="text-[15px] md:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2" id="app-title">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white shrink-0">
                  <Palette className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="truncate">Sequential Palette Generator</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full border border-indigo-100/35 dark:border-indigo-900/30">
                  データビジュアリゼーション対応
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                離散シーケンシャルカラーパレット <span className="md:hidden text-indigo-500 dark:text-indigo-450 font-bold ml-1">{isHeaderExpanded ? '(タップで閉じる)' : '(タップで設定を展開)'}</span>
              </p>
            </div>

            {/* Mobile Header Collapse/Expand Toggle button */}
            <button 
              className="md:hidden p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsHeaderExpanded(!isHeaderExpanded);
              }}
              title={isHeaderExpanded ? '設定パネルを閉じる' : '設定パネルを開く'}
            >
              {isHeaderExpanded ? (
                <ChevronUp className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ChevronDown className="w-4.5 h-4.5" />
              )}
            </button>
          </div>

          {/* Core Settings and Mode Controls Flex Group (Collapsible Accordion on Mobile, static on Desktop) */}
          <div className={`transition-all duration-300 ease-in-out md:flex flex-wrap items-center gap-3 self-end md:self-auto w-full md:w-auto
            ${isHeaderExpanded 
              ? 'flex opacity-100 mt-2 max-h-[500px]' 
              : 'hidden md:flex opacity-0 md:opacity-100 max-h-0 md:max-h-[500px] overflow-hidden md:overflow-visible'
            }`}
          >
            {/* Core Applet Configurations */}
            <div className="flex flex-wrap items-center gap-5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors w-full md:w-auto">
              {/* Palette size Selector */}
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Layers className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  表示パレット数 ({currentOptionsCount}/10)
                </label>
                <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs">
                  {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentOptionsCount(num)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        currentOptionsCount === num
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                      id={`btn-count-${num}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 shrink-0 hidden sm:block"></div>

              {/* Steps Count select */}
              <div className="flex flex-col gap-1 min-w-[180px] flex-grow sm:flex-grow-0">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 select-none text-slate-500">
                    <ListOrdered className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                    ステップ分割数
                  </label>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100/50 dark:border-indigo-900/30 font-mono">
                    {currentSteps} STEPS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="step-count-slider"
                    type="range"
                    min="5"
                    max="30"
                    value={currentSteps}
                    onChange={(e) => setCurrentSteps(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions (Reset Cache & Theme toggle) */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors w-full md:w-auto justify-end">
              
              {/* Reset Session Cache Database */}
              <button
                onClick={handleClearCache}
                className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 rounded-xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="セッションキャッシュを破棄して初期化"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">キャッシュクリア</span>
              </button>

              {/* Light/Dark Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer flex items-center justify-center"
                title={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
                id="theme-toggle-btn"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-slate-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Layout Container (Desktop Split Column, Tablet/Mobile Grid Flow) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 relative">
        <div className="w-full flex flex-col gap-8">
          
          {/* Dynamic Summary Cards section */}
          <section id="palette-status-dashboard-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                パレットステータス（水平概要と色差調和プレビュー）
              </h2>
            </div>
            <SummaryDashboard
              currentOptionsCount={currentOptionsCount}
              optionStates={optionStates}
              onColorChange={handleColorChange}
              onNameChange={handleNameChange}
              onSelectPreset={handleSelectPreset}
            />
          </section>

          {/* Dynamic Detailed Vertical List grid section */}
          <section id="detailed-palettes-showcase-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
                シーケンシャルパレットリスト
              </h2>
            </div>
            <PaletteDetailedGrid
              currentOptionsCount={currentOptionsCount}
              optionStates={optionStates}
              currentSteps={currentSteps}
              onColorChange={handleColorChange}
              onNameChange={handleNameChange}
              onSelectPreset={handleSelectPreset}
              selectedCells={selectedCells}
              onToggleCell={handleToggleCell}
              paddingY={paddingY}
              onChangePaddingY={setPaddingY}
              paddingX={paddingX}
              onChangePaddingX={setPaddingX}
            />
          </section>

          {/* Dynamic Export section */}
          <ExportSection
            currentOptionsCount={currentOptionsCount}
            optionStates={optionStates}
            currentSteps={currentSteps}
          />
        </div>
      </main>

      {/* Floating Custom Palette Builder (Single instances for PC Drag & Mobile sheet) */}
      <CustomPaletteBuilder
        selectedCells={selectedCells}
        onRemoveCell={(key) => setSelectedCells((prev) => prev.filter((c) => c.key !== key))}
        onClearAll={() => setSelectedCells([])}
        onReorderCells={handleReorderCells}
      />

      {/* Mini Help footer to assist developers */}
      <footer className="mt-16 text-center text-xs text-slate-400 dark:text-slate-500 max-w-2xl mx-auto px-4 leading-relaxed">
        <p>LCH補間は、人間の知覚に合わせた均等な明度階調変化を保証する色空間(Lab/Lch)で処理されています。</p>
        <p className="mt-1">これにより、視認性を維持した美しく機能的なシーケンシャルマップが仕上がります。</p>
      </footer>
    </div>
  );
}
