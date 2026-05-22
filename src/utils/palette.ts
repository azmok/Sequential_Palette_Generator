import chroma from 'chroma-js';
import { PRESETS } from '../presets';
import { OptionState } from '../types';

/**
 * LCH色空間でシーケンシャルカラーを生成します。
 * 明度(L)を適正に調整した、美しいデータビジュアライゼーション用パレットに仕上げます。
 */
export function generateSequentialColors(baseHex: string, steps: number): string[] {
  if (!chroma.valid(baseHex)) {
    return Array(steps).fill('#cccccc');
  }
  const base = chroma(baseHex);
  
  // LCH空間において彩度(C)と明度(L)を調整して、最も明るい端と最も暗い端を作ります。
  const lightEnd = base.set('lch.l', 96).set('lch.c', Math.min(base.get('lch.c'), 15));
  const darkEnd = base.set('lch.l', 12).set('lch.c', Math.min(base.get('lch.c'), 35));
  
  return chroma.scale([lightEnd, base, darkEnd]).mode('lch').colors(steps);
}

/**
 * 選択中の他のアクティブ色のベースカラーと最大の色差(Delta E)を持つプリセットを算出します。
 */
export function getRecommendedColors(
  targetId: number, 
  currentOptionsCount: number, 
  optionStates: OptionState[], 
  count = 5
) {
  const activeOtherColors = optionStates
    .filter(opt => opt.id <= currentOptionsCount && opt.id !== targetId)
    .map(opt => opt.baseColor)
    .filter(c => chroma.valid(c));

  // 比較対象の他色がない場合は、高コントラストでカテゴリカルなクラシック色調を推奨する
  if (activeOtherColors.length === 0) {
    return [
      { name: "Classic Blue", hex: "#0f62fe" },
      { name: "Forest Green", hex: "#198038" },
      { name: "Tailwind Orange", hex: "#f97316" },
      { name: "Crimson Red", hex: "#da1e28" },
      { name: "Magenta 60", hex: "#8a3ffc" }
    ].slice(0, count);
  }

  // Delta E (CIE94相当 / 改良色差) 距離を計算
  const scoredPresets = PRESETS.map(preset => {
    // 他の全アクティブカラーと比較して、最小の色差（最悪ケース）を最大化する
    const minDelta = Math.min(...activeOtherColors.map(oc => chroma.deltaE(preset.hex, oc)));
    return { ...preset, score: minDelta };
  });

  // スコア順にソート (色差距離が大きい順)
  scoredPresets.sort((a, b) => b.score - a.score);

  // 互いに近すぎる色がお互い推奨に入らないようにフィルター
  const recommended: Array<{ name: string; hex: string; cat: string }> = [];
  for (const preset of scoredPresets) {
    const isTooCloseToRecs = recommended.some(r => chroma.deltaE(preset.hex, r.hex) < 25);
    if (!isTooCloseToRecs) {
      recommended.push(preset);
    }
    if (recommended.length >= count) break;
  }

  return recommended;
}
