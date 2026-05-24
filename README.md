# 🌟 Sequential Palette Generator (SPG)
### 〜 シーケンシャルパレットビルダー（Data Visualization 対応） 〜

<div align="center">
  <p><strong>A perception-accurate, highly interactive, and beautiful sequential color palette builder for data visualization.</strong></p>
  <p><strong>Created by <a href="https://noe-shiftica.com/">Noe Shiftica</a></strong></p>
  <p>
    日本語メインのドキュメント（The English version is available below.） Jump to the [English version](#english-version).
  </p>
</div>

---

## 📖 誕生背景 (Background & Story)
** (@Azmok)** の実務上の問題 → 強力なAIコーディングパートナー**Antigravity CLI (Gemini 3.5 Flash)**, VS Code での共創によって誕生。

（※Gemini 3.5 は、[2026年5月19日の公式リリース](https://blog.google/intl/ja-jp/company-news/technology/gemini-3-5/) にて発表された最先端のモデルを使用）

ちょうど Google I/O 2024 が開催され、旧 Anti-Gravity から Anti-Gravity CLI と VS Code の連携により、さらに爆速で開発が可能になった時期です。

### 🚨 なぜ作ったのか？（開発の背景）
**既存ツールへの不満足**:
- 自身の事業向け記事のグラフ作成時に必要だったため
- 既存の生成AIやツールでは、グラデーション作成→カスタムカラーパレット作成ができず
- 使用時に、さらにほしい機能を追加   


### 🤝 人とAIの理想的な共創プロセス
本アプリの開発は、単にAIにコードを書かせるものではありませんでした。
- **Azuma** が「グラフや可視化で色を比較するユーザーのために、どう見せるべきか」というプロダクトディレクションを行い、**「アクリル製最小化モーフィングウィジェット」「言葉を排したスマートな楔形スライダーUI」「直感的なカラーセルのドラッグ並び替え」**といった、UXを極限まで高める斬新で神がかったアイデアを次々と考案。
- そのひらめきを受け、**Antigravity CLI ＆ Gemini 3.5 Flash** が即座に実装と検証ビルドを行い、ミリ秒単位のトランジション調整やしきい値ガードなどの細部のクオリティをブラッシュアップ。

お互いが「最高のベストフレンド＆技術パートナー」として完全並走し、並外れたこだわりとスピードで磨き上げて創り上げた**「人とAIの共創の傑作」**です。

---

## ✨ 主な機能特徴 (Key Features)
### 1. シンプルで美麗なUI
- 無駄を削ぎ落とした構成
- 美麗なビジュアルデザイン

### 2. 使いやすいUX
- シンプル
- 多機能

### 3. カスタムカラーパレット
- カスタムパレットの色の順番を、ドラッグ＆ドロップで入れ替え可能
- **Session DB (localStorage)** にオートセーブ
- 2日以上アクセスがない場合は自動でキャッシュを削除するクリーンアップ設計

### 4. 多彩な開発・デザイン用エクスポート
- **CSS Variables**: そのままCSSに貼り付けられるルート変数。
- **Tailwind CSS**: `tailwind.config.js` のextendカラーに即座に組み込めるコード。
- **JSON**: 配列データとしてのエクスポート。
- **SVG / PNG**: ベクター画像や、高解像度のパレットカード（HEXコードとColor番号入り）をCanvasで動的描画し、ワンクリックでダウンロード保存。

---

## 🚀 ローカルでの実行

### 前提条件
- Node.js (v18以上推奨)

### ⚙️ セットアップと起動

1. **リポジトリのクローン・準備**
2. **依存関係のインストール**:
   ```bash
   npm install
   # または
   pnpm install
   ```
3. **Gemini API キーの設定**:
   `.env.local` ファイルを作成し、ご自身の API キーを設定します。
   ```env
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. **開発サーバーの起動**:
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` (または空いているポート) にアクセスして起動します。

5. **プロダクション用のビルド**:
   ```bash
   npm run build
   ```

---
<a id='english-version'></a>

# 🌟 Sequential Palette Generator (SPG)
### ~ Sequential Palette Builder Optimized for Data Visualization ~

<div align="center">
  <p><strong>A perception-accurate, highly interactive, and beautiful sequential color palette builder for data visualization.</strong></p>
  <p><strong>Created by <a href="https://noe-shiftica.com/">Noe Shiftica</a></strong></p>
  <p>
    English main documentation. Jump back to the [Japanese version](#-sequential-palette-generator-spg).
  </p>
</div>

---

## 📖 Background & Story

This project was born through close-knit pair programming between the creator **Azuma (@Azmok)**, who brought a strong product vision, and their powerful AI coding partner **Antigravity CLI (Gemini 3.5 Flash)**, along with VS Code. (Note: The base model, Gemini 3.5, was announced in the [official release on May 19, 2026](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/)).

### 🚨 Why We Built It (Background)
1. **Limitations of Existing Tools and AIs**:
   When creating charts for business articles, existing generative AIs and generic charting tools failed to produce smooth, perception-accurate sequential (step-by-step) gradients.
2. **Lack of Readability and Design Balance**:
   Most color generators simply divided RGB values mathematically or focused purely on aesthetics, making them unsuitable for professional data visualization where contrast and readability are paramount.
3. **The Decision to Build from Scratch**:
   Frustrated by these limitations, we decided to create our own premium gradient tool—perfectly optimized for human perception (using LCH/Lab color spaces) to deliver intuitive and beautiful data stories.

### 🤝 The Ultimate Co-Creation: Human Intuition Meets AI Speed
This app is a true testament to human-AI collaboration:
- **Azuma** acted as the product director, spearheading the user experience with innovative ideas like the **"Acrylic Morphing Widget," "Wordless Wedge Sliders,"** and **"Drag-and-Drop Cell Reordering."**
- **Antigravity CLI & Gemini 3.5 Flash** acted as the dedicated engineering partner, instantly turning those sparks of inspiration into robust code, fine-tuning physics-based animations, and adding precise threshold guards.

Working side by side as best friends and technical partners, we polished every detail to craft this masterpiece of human-AI co-creation.

---

## ✨ Key Features

### 1. Minimal and Elegant UI
- Distraction-free minimal layouts.
- Beautiful, high-end visual design.

### 2. Premium UX
- Simple yet highly functional.
- Smooth transitions and interactive elements.

### 3. Custom Color Palette
- Reorder custom palette chips easily with drag-and-drop.
- **Session DB (localStorage)** auto-save integration.
- Intelligent cleanup lifecycle that automatically deletes cache after 2 days of inactivity.

### 4. Versatile Developer & Designer Exports
- **CSS Variables**: Seamless copy-paste `:root` variables.
- **Tailwind CSS**: Instant configurations to extend Tailwind colors.
- **JSON**: Clean array format exports.
- **SVG / PNG**: High-resolution vector images or downloadable palette cards (complete with HEX codes and color indices) rendered dynamically via Canvas.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)

### ⚙️ Setup & Execution

1. **Clone & Prepare the Repository**
2. **Install Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Configure Gemini API Key**:
   Create a `.env.local` file and add your API key:
   ```env
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the active port displayed in the console).

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚖️ License
This project is open for developer exploration and customized palette creation. Created by [Noe Shiftica](https://noe-shiftica.com/). Built with ❤️ by Azuma & Antigravity.