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
