import { useState } from 'react';
import { Palette, Layers, ListOrdered } from 'lucide-react';
import { OptionState } from './types';
import { SummaryDashboard } from './components/SummaryDashboard';
import { PaletteDetailedGrid } from './components/PaletteDetailedGrid';
import { ExportSection } from './components/ExportSection';

export default function App() {
  const [currentOptionsCount, setCurrentOptionsCount] = useState<number>(4);
  const [currentSteps, setCurrentSteps] = useState<number>(10);

  // Initialize with some beautiful contrast colors from presets
  const [optionStates, setOptionStates] = useState<OptionState[]>([
    { id: 1, name: "Classic Blue", baseColor: "#0f62fe" },
    { id: 2, name: "Carbon Purple", baseColor: "#8a3ffc" },
    { id: 3, name: "Cyan Data", baseColor: "#0072c3" },
    { id: 4, name: "Carbon Teal", baseColor: "#009d9a" },
    { id: 5, name: "IBM Orange 60", baseColor: "#ba4e00" },
  ]);

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

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900" id="app-root-container">
      {/* Upper Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-5 px-6 sm:px-8 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2" id="app-title">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <Palette className="w-5 h-5" />
              </div>
              <span>Sequential Palette Generator</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100/35">
                データビジュアリゼーション対応
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              データ視認性・混同防止に配慮した、極限色差(Delta-E94)補間付きの離散シーケンシャルカラーパレットを設計します。
            </p>
          </div>

          {/* Core Applet Configurations */}
          <div className="flex flex-wrap items-center gap-5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {/* Palette size Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Layers className="w-3 h-3 text-indigo-500" />
                表示パレット数 ({currentOptionsCount}/5)
              </label>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/50 shadow-xs">
                {([1, 2, 3, 4, 5] as const).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentOptionsCount(num)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      currentOptionsCount === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id={`btn-count-${num}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 shrink-0 hidden sm:block"></div>

            {/* Steps Count select */}
            <div className="flex flex-col gap-1 min-w-[200px] flex-grow sm:flex-grow-0">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none text-slate-500">
                  <ListOrdered className="w-3 h-3 text-indigo-500" />
                  ステップ分割数
                </label>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50 font-mono">
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
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 flex flex-col gap-8">
        {/* Dynamic Summary Cards section */}
        <section id="palette-status-dashboard-section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
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
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
              詳細シーケンシャルパレットリスト
            </h2>
          </div>
          <PaletteDetailedGrid
            currentOptionsCount={currentOptionsCount}
            optionStates={optionStates}
            currentSteps={currentSteps}
            onColorChange={handleColorChange}
            onNameChange={handleNameChange}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Dynamic Export section */}
        <ExportSection
          currentOptionsCount={currentOptionsCount}
          optionStates={optionStates}
          currentSteps={currentSteps}
        />
      </main>

      {/* Mini Help footer to assist developers */}
      <footer className="mt-16 text-center text-xs text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
        <p>LCH補間は、人間の知覚に合わせた均等な明度階調変化を保証する色空間(Lab/Lch)で処理されています。</p>
        <p className="mt-1">これにより、視認性を維持した美しく機能的なシーケンシャルマップが仕上がります。</p>
      </footer>
    </div>
  );
}
