export interface PresetColor {
  name: string;
  hex: string;
  cat: string;
}

export interface OptionState {
  id: number;
  name: string;
  baseColor: string;
}

export interface GeneratedPalette {
  name: string;
  slug: string;
  colors: string[];
}

export interface SelectedCell {
  key: string;   // "optionId-stepIndex" 形式 (例: "1-4")
  color: string; // HEX形式 (例: "#0f62fe")
}
