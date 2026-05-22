import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Code, FileCode } from 'lucide-react';
import { OptionState } from '../types';
import { generateSequentialColors } from '../utils/palette';

interface ExportSectionProps {
  currentOptionsCount: number;
  optionStates: OptionState[];
  currentSteps: number;
}

export const ExportSection: React.FC<ExportSectionProps> = ({
  currentOptionsCount,
  optionStates,
  currentSteps,
}) => {
  type TabType = 'css' | 'json' | 'tailwind';
  const [activeTab, setActiveTab] = useState<TabType>('css');
  const [copied, setCopied] = useState(false);

  // Parse actual structured color data for output
  const generatedData = optionStates.slice(0, currentOptionsCount).map((opt) => {
    return {
      name: opt.name,
      slug: opt.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '-'),
      colors: generateSequentialColors(opt.baseColor, currentSteps),
    };
  });

  // Calculate generated code text
  let codeOutput = '';
  if (activeTab === 'css') {
    codeOutput += `/* Sequential Color Palettes -- Root CSS Variables */\n:root {\n`;
    generatedData.forEach((p) => {
      codeOutput += `  /* ${p.name} Series */\n`;
      p.colors.forEach((c, idx) => {
        const stepVal = Math.round(((idx + 1) / currentSteps) * 100);
        codeOutput += `  --color-${p.slug}-${stepVal}: ${c.toUpperCase()};\n`;
      });
      codeOutput += `\n`;
    });
    codeOutput += `}`;
  } else if (activeTab === 'json') {
    const exportObj: Record<string, Record<string, string>> = {};
    generatedData.forEach((p) => {
      exportObj[p.slug] = p.colors.reduce((acc, c, idx) => {
        const stepVal = Math.round(((idx + 1) / currentSteps) * 100);
        acc[stepVal] = c.toUpperCase();
        return acc;
      }, {} as Record<string, string>);
    });
    codeOutput = JSON.stringify(exportObj, null, 2);
  } else if (activeTab === 'tailwind') {
    codeOutput += `// tailwind.config.js / tailwind.config.ts\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
    generatedData.forEach((p) => {
      codeOutput += `        '${p.slug}': {\n`;
      p.colors.forEach((c, idx) => {
        const stepVal = Math.round(((idx + 1) / currentSteps) * 100);
        codeOutput += `          '${stepVal}': '${c.toUpperCase()}',\n`;
      });
      codeOutput += `        },\n`;
    });
    codeOutput += `      }\n    }\n  }\n}`;
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeOutput).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    });
  };

  return (
    <section className="mt-12 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden" id="export-section">
      {/* Export Header */}
      <div className="border-b border-gray-100 dark:border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50 dark:bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100">コードエクスポート</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500">プロジェクトに合わせてフォーマットを選択し、コピーして直接プロジェクトにご利用ください。</p>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-xl border border-gray-200/50 dark:border-slate-800/50 self-start sm:self-auto">
          {(['css', 'json', 'tailwind'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-xs border border-black/5 dark:border-white/5'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
              id={`tab-export-${tab}`}
            >
              {tab === 'css' ? 'CSS変数' : tab === 'tailwind' ? 'Tailwind CSS' : 'JSON'}
            </button>
          ))}
        </div>
      </div>

      {/* Code Text Area preview */}
      <div className="p-6 relative">
        <button
          onClick={handleCopyCode}
          className="absolute top-10 right-10 bg-gray-900 hover:bg-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer z-10 border border-transparent dark:border-slate-700/50"
          id="btn-copy-export-code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>コピー完了！</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>コードをコピー</span>
            </>
          )}
        </button>

        <pre className="bg-gray-950 dark:bg-slate-950 text-gray-100 rounded-xl p-6 overflow-x-auto text-xs font-mono leading-relaxed max-h-[380px] shadow-inner select-all border border-gray-900 dark:border-slate-900">
          <code id="export-code-display">{codeOutput}</code>
        </pre>
      </div>
    </section>
  );
};
