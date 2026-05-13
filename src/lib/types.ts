import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AlignH = 'left' | 'center' | 'right';
export type AlignV = 'top' | 'middle' | 'bottom';
export type StrokeAlign = 'inside' | 'center' | 'outside';

export interface CellStyle {
  bg?: string;
  text?: string;
  border?: string;
  fontSize?: number;
  bold?: boolean;
  hAlign?: AlignH;
  vAlign?: AlignV;
  wrapText?: boolean;
}

export interface MergeInfo {
  rs: number;
  cs: number;
}

export interface GlobalStyle {
  radius: number;
  borderWidth: number;
  strokeAlign: StrokeAlign;
  padding: number;
  gap: number;
  fontSize: number;
  fontFamily: string;
  hAlign: AlignH;
  vAlign: AlignV;
  headerOn: boolean;
  zebraOn: boolean;
  paletteIndex: number;
  wrapText: boolean;
}

export interface TableData {
  rows: string[][];
  merges: Record<string, MergeInfo | 'hidden'>; // key: "r,c"
  cellStyles: Record<string, CellStyle>; // key: "r,c"
  rowStyles: Record<number, CellStyle>;
  colStyles: Record<number, CellStyle>;
  globalStyle: GlobalStyle;
}

export const PALETTES = [
  {n:"暮金",  h:{bg:"#c8a96e",t:"#1a1207",bd:"#a08040"},c:{bg:"#1e1a12",t:"#e8d5a3",bd:"#3a3020"},alt:"#252015"},
  {n:"霜蓝",  h:{bg:"#4a9ebb",t:"#0a1220",bd:"#2a7a99"},c:{bg:"#0e1a28",t:"#c8eaf5",bd:"#1a3040"},alt:"#121e2c"},
  {n:"竹绿",  h:{bg:"#5aaa7a",t:"#0a1a10",bd:"#3a8a58"},c:{bg:"#0e1e14",t:"#c5ecd0",bd:"#1a3020"},alt:"#121e18"},
  {n:"胭脂",  h:{bg:"#c04a6a",t:"#fff0f4",bd:"#903050"},c:{bg:"#1e0e14",t:"#f0ccd8",bd:"#351020"},alt:"#221218"},
  {n:"烟紫",  h:{bg:"#7a5aaa",t:"#f5eeff",bd:"#5a3a88"},c:{bg:"#150f20",t:"#ddd0f0",bd:"#281a3a"},alt:"#191228"},
  {n:"雪白",  h:{bg:"#222222",t:"#f8f8f6",bd:"#444444"},c:{bg:"#ffffff",t:"#222222",bd:"#e0e0e0"},alt:"#f4f4f2"},
  {n:"拿铁",  h:{bg:"#6b4c2a",t:"#fdf8f2",bd:"#4a3018"},c:{bg:"#fdf8f2",t:"#4a3018",bd:"#ddd0b8"},alt:"#f5eedd"},
  {n:"墨青",  h:{bg:"#1a3a3a",t:"#e0f0f0",bd:"#0a2828"},c:{bg:"#ffffff",t:"#1a3a3a",bd:"#c0dada"},alt:"#edf5f5"},
  {n:"珊瑚",  h:{bg:"#e07060",t:"#fff5f3",bd:"#b85040"},c:{bg:"#fff8f6",t:"#3a2020",bd:"#f0c8c0"},alt:"#fdf0ec"},
  {n:"夜金",  h:{bg:"#2a2010",t:"#c8a96e",bd:"#1a1408"},c:{bg:"#141008",t:"#e8d5a3",bd:"#2a2010"},alt:"#10080a"},
];

export const INITIAL_DATA: string[][] = [
  ["产品名称","规格型号","单价(元)","库存数量","状态"],
  ["呼吸机 A型","ICU-2000","58,000","12","在售"],
  ["电动病床","DB-500","8,800","35","在售"],
  ["血气分析仪","BGM-Pro","42,000","8","预订中"],
  ["微循环检测仪","SC-100","28,500","20","在售"],
  ["输液泵","IP-300","6,200","50","在售"],
];

export const DEFAULT_GLOBAL_STYLE: GlobalStyle = {
  radius: 8,
  borderWidth: 1,
  strokeAlign: 'inside',
  padding: 10,
  gap: 3,
  fontSize: 14,
  fontFamily: "'Noto Sans SC', sans-serif",
  hAlign: 'left',
  vAlign: 'top',
  headerOn: true,
  zebraOn: false,
  paletteIndex: 0,
  wrapText: false,
};
