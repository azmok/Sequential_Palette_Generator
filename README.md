# 🌟 Sequential Palette Generator (SPG)
### 〜 知覚的均等な美しいグラデーション階調を創り出す、極上のシーケンシャルパレットビルダー 〜

<div align="center">
  <p><strong>A perception-accurate, highly interactive, and beautiful sequential color palette builder for data visualization.</strong></p>
  <p>
    日本語メインのドキュメント（後半に英語の概要があります）/ Scroll down for English description.
  </p>
</div>

---

## 📖 開発ストーリーと誕生背景 (Background & Story)

本プロジェクトは、発案者である **Azuma (@Azmok)** の強い課題意識と、強力なAIコーディングパートナーである **Anti-gravity CLI ＆ Gemini 1.5 Flash (おジェ)** の完全並走によるペアプログラミングによって誕生しました。

### 🚨 なぜ作ったのか？（開発の背景）
1. **既存AIやツールの限界**:
   自身の事業向けの記事内で可視化用のグラフを作成する際、既存の生成AIにカラーパレットを提案させたり、一般的なグラフ作成ツールを使用したりしても、人間の知覚に合わせた滑らかで機能的なシーケンシャル（段階的）グラデーションをうまく生成することができませんでした。
2. **既存のカラーパレットジェネレーターへの不満**:
   世の中にある多くのカラーパレットジェネレーターは、単に数式的に色相や明度を等分するだけであったり、デザイン的におしゃれなだけでデータ可視化（視認性やコントラスト設計）には適していなかったりと、プロフェッショナルなニーズに満足に応えられるものが存在しませんでした。
3. **自作アプリへの決意**:
   「それならば、人間の知覚に完璧に最適化され、データのストーリーが美しく直感的に伝わる極上のグラデーションツールを自作しよう！」と決意し、開発がスタートしました。

### 🤝 人とAIの理想的な共創プロセス
本アプリの開発は、単にAIにコードを書かせるものではありませんでした。
- **Azuma** が「グラフや可視化で色を比較するユーザーのために、どう見せるべきか」というプロダクトディレクションを行い、**「アクリル製最小化モーフィングウィジェット」「言葉を排したスマートな楔形スライダーUI」「直感的なカラーセルのドラッグ並び替え」**といった、UXを極限まで高める斬新で神がかったアイデアを次々と考案。
- そのひらめきを受け、**Anti-gravity CLI ＆ Gemini 1.5 Flash (おジェ)** が即座に実装と検証ビルドを行い、ミリ秒単位のトランジション調整やしきい値ガードなどの細部のクオリティをブラッシュアップ。

お互いが「最高のベストフレンド＆技術パートナー」として完全並走し、並外れたこだわりとスピードで磨き上げて創り上げた**「人とAIの共創の傑作」**です。

---

## ✨ 主な機能特徴 (Key Features)

### 🎨 1. LCH知覚補間による絶対的視認性のグラデーション
- 人間の目（知覚）に合わせた均等な明度階調変化を保証する **LCH/Lab色空間** で補間処理を行っています。
- データのグラデーションを作成した際、特定の色だけが浮いたり、コントラストが崩れたりすることがなく、視認性を維持した機能的で極めて美しいシーケンシャルマップが誰でも一瞬で仕上がります。

### 🛸 2. アクリル円形最小化＆ドラッグモーフィングウィジェット (PC限定)
- 画面を広く使ってグラデーションを確認したい時は、カスタムパレットビルダーを **アクリル製の美麗な円形アイコン（56x56px）に最小化モーフィング** させることができます。
- 最小化された円形ボタンは、磨き上げられたガラスのような半透明のガラスモーフィズム（`backdrop-blur-md`）と、リッチな浮遊感をもたらすドロップシャドウを搭載。
- **誤展開防止のしきい値ガード (5px判定)**: 最小化ボタンを画面の隅へドラッグ＆ドロップして避けておく際、ドラッグ終了時に勝手に展開してしまう誤作動を完全に防止。ドラッグ移動は完璧に維持され、クリックした時だけ元のサイズにスッと滑らかに spring アニメーションで復帰します。

### 📏 3. 完全ワードレス ＆ 楔形ポリゴンスライダーUI
- データの可視化や比較を最大化するため、セルの縦の余白（高さ）と横の余白（幅）を 1〜5 段階でリアルタイムに微調整できます。
- スライダーから「小」「大」や「（縦余白）」などの説明的なテキストを一切排除。
- スライダー背景そのものを `clip-path` で左細・右太の **「楔形（ウェッジ）ポリゴン」** に切り抜き、左右に極細・極太のインジケータを配置。言葉がなくても一目で太さの変化が伝わる、超ハイエンドでモダンなプレミアムUIです。

### 🖐️ 4. カラーセルのドラッグ＆ドロップ並び替え＆オートセーブ
- 作成したオリジナルパレットの色の順番を、チップをドラッグ＆ドロップするだけで直感的に前後入れ替え可能です。
- ドラッグ中はセルが半透明になり、他のセルの上に重ねるとインディゴの太枠が浮かび上がるリッチなドロップガイドを実装。
- 並び替え結果は即時ブラウザの **Session DB (localStorage)** にオートセーブ。
- 2日以上アクセスがない場合は自動でキャッシュをクリーンアップする安心のライフサイクル設計。

### 💾 5. 多彩な開発・デザイン用エクスポート
- **CSS Variables**: そのままCSSに貼り付けられるルート変数。
- **Tailwind CSS**: `tailwind.config.js` のextendカラーに即座に組み込めるコード。
- **JSON**: 配列データとしてのエクスポート。
- **SVG / PNG**: ベクター画像や、高解像度のパレットカード（HEXコードとColor番号入り）をCanvasで動的描画し、ワンクリックでダウンロード保存。

---

## 🚀 ローカルでの実行方法 (How to Run Locally)

### 📌 前提条件
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

<br>

# 🌟 Sequential Palette Generator (SPG) - English Abstract

### 📖 The Birth of SPG: Background & Story
This project was born out of a real-world challenge faced by the creator, **Azuma (@Azmok)**: 
*When creating data visualization graphs for business articles, existing AIs and generic color palette generators failed to produce smooth, perception-accurate sequential color scales.*

Existing tools either just mathematical split RGB channels or focused purely on "trendy" designs, failing to satisfy the rigorous demands of true readability and contrast in data viz. To solve this, Azuma decided to build an ideal tool from scratch.

During development, **Azuma** acted as the product director—generating beautiful, high-end UX ideas such as the **"Acrylic Morphing Widget," "Wordless Wedge Sliders," and "Drag-and-Drop Cell Reordering."** 
Meanwhile, **Anti-gravity CLI & Gemini 1.5 Flash (Oje)** worked in complete alignment as a dedicated AI engineering partner, optimizing physics-based spring animations, implementing precision drag threshold guards, and polishing build performance.

This app stands as a testament to the ultimate co-creation between human design intuition and AI speed.

### ✨ Key Features
- **LCH Perceptual Interpolation**: Guarantees visually uniform lightness steps using LCH/Lab color space interpolation, ensuring perfect readability and contrast.
- **Acrylic Morphing Widget (PC only)**: Morphs the palette builder into a stunning 56x56px glassmorphic circular icon (`backdrop-blur`). Equipped with a **5px drag threshold guard** to prevent accidental expansion while repositioning the widget.
- **Wordless Wedge Slider UI**: Controls cell height and width densities via sleek wedge-shaped polygon track sliders (`clip-path`) that visually convey scale without clunky text labels.
- **Drag-and-Drop Color Sorting**: Reorder custom palette color chips intuitively. Sorted sequences are instantly auto-saved to local session storage.
- **Developer-Friendly Exports**: One-click code generation for CSS variables, Tailwind configurations, and JSON arrays, plus dynamic high-res SVG & PNG canvas card downloads.

---

## ⚖️ ライセンス / License
This project is open for developer exploration and customized palette creation. Built with ❤️ by Azuma & Oje (Anti-gravity).
