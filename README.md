# 🎨Sequential Palette Generator (SPG)
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
**あずま (@Azmok)** の実務で必要 → Antigravity IDE × Antigravity CLI (Gemini 3.5 Flash, Claude 4.7)** により誕生。

（※Gemini 3.5 は、[2026年5月19日の公式リリース](https://blog.google/intl/ja-jp/company-news/technology/gemini-3-5/) にて発表された最先端のモデルを使用）

ちょうど Google I/O 2026 が開催され、旧 Antigravity から Antigravity CLI と Antigravity IDEで、爆速開発が可能になった時期

### 🚨 なぜ作ったのか？（開発の背景）
**既存ツールへの不満足**:
- データビジュアリゼーション用の、断続的グラデーション作成が皆無
- カスタムカラーパレット作成できず


### 🤝 人とAIの理想的な共創プロセス
相互のコミュニケーションにより、より使いやすい、自分がまず使いやすいものを追求


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

```

```text
File successfully created: README.md

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

# 🌟 Sequential Palette Generator (SPG)

### ~ Sequential Palette Builder Optimized for Data Visualization ~

---

## 📖 Background & Story

Born out of practical necessity for **Azuma (@Azmok)**, co-created instantly using **Antigravity IDE × Antigravity CLI (Gemini 3.5 Flash, Claude 4.7)**.

(*Note: Gemini 3.5 is the cutting-edge model announced in the [official release on May 19, 2026](https://blog.google/intl/ja-jp/company-news/technology/gemini-3-5/)).

This was exactly around the time when Google I/O 2026 was held, enabling lightning-fast development by transitioning from the legacy Antigravity to Antigravity CLI and Antigravity IDE.

### 🚨 Why We Built It (Background)

**Dissatisfaction with Existing Tools**:

* Absolute lack of tools capable of creating step-by-step (discrete) gradients optimized for data visualization.
* Inability to build custom color palettes flexible enough for real-world needs.

### 🤝 The Ideal Human-AI Co-Creation Process

Through deep, bidirectional communication, we pursued an application that is genuinely intuitive and highly usable—starting with making it perfect for the creator's own workflow.

---

## ✨ Key Features

### 1. Minimal and Elegant UI

* Distraction-free, streamlined configuration.
* Beautiful, high-end visual design.

### 2. Premium UX

* Simple yet highly functional.

### 3. Custom Color Palette

* Reorder custom palette colors effortlessly with drag-and-drop.
* Auto-save integration with **Session DB (localStorage)**.
* Clean-up lifecycle design that automatically deletes cache after 2 days of inactivity.

### 4. Versatile Developer & Designer Exports

* **CSS Variables**: Seamless copy-paste ready root variables.
* **Tailwind CSS**: Instant code configuration to extend colors in `tailwind.config.js`.
* **JSON**: Clean array format exports.
* **SVG / PNG**: High-resolution vector images or downloadable palette cards (complete with HEX codes and color indices) rendered dynamically via Canvas.

---

## 🚀 How to Run Locally

### Prerequisites

* Node.js (v18 or higher recommended)

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

This project is open for developer exploration and custom palette creation. Created by [Noe Shiftica](https://noe-shiftica.com/). Built with ❤️ by Azuma & Antigravity.
README.