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
  // Claude 风格
  {cat:"Claude 风格", n:"沙丘白",  h:{bg:"#F0EFEA",t:"#2B2925",bd:"#E4E0D5"},c:{bg:"#FFFFFF",t:"#2B2925",bd:"#E4E0D5"},alt:"#FDFCFA"},
  {cat:"Claude 风格", n:"琥珀橙",  h:{bg:"#D97757",t:"#FFFFFF",bd:"#C56142"},c:{bg:"#FFFFFF",t:"#2B2925",bd:"#E4E0D5"},alt:"#FFF9F5"},
  {cat:"Claude 风格", n:"莫兰迪绿",  h:{bg:"#6BA8A5",t:"#FFFFFF",bd:"#568784"},c:{bg:"#FFFFFF",t:"#2B2925",bd:"#E4E0D5"},alt:"#F2F7F6"},
  {cat:"Claude 风格", n:"暖石灰",  h:{bg:"#D5D4CD",t:"#2B2925",bd:"#B3B2AB"},c:{bg:"#F5F4EF",t:"#2B2925",bd:"#E4E0D5"},alt:"#EBEAE3"},
  {cat:"Claude 风格", n:"锈红色",  h:{bg:"#A15443",t:"#FFFFFF",bd:"#8A4637"},c:{bg:"#F5F4EF",t:"#2B2925",bd:"#E4E0D5"},alt:"#FFFFFF"},
  {cat:"Claude 风格", n:"炭黑",  h:{bg:"#242321",t:"#EFECE6",bd:"#3F3E3B"},c:{bg:"#2B2A27",t:"#EFECE6",bd:"#3F3E3B"},alt:"#33322E"},

  // 新粗野主义 风格
  {cat:"新粗野主义 风格", n:"复古卡其", h:{bg:"#D4D1A7",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#F2F1E5"},
  {cat:"新粗野主义 风格", n:"高街亮橙", h:{bg:"#F9561E",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#FDEBE4"},
  {cat:"新粗野主义 风格", n:"薄荷海苔", h:{bg:"#89D1A4",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#E7F6ED"},
  {cat:"新粗野主义 风格", n:"酸性橄榄", h:{bg:"#96AC25",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#EDF3D6"},
  {cat:"新粗野主义 风格", n:"千禧艳粉", h:{bg:"#FF80C0",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#FFE6F3"},
  {cat:"新粗野主义 风格", n:"警告明黄", h:{bg:"#FFC900",t:"#000000",bd:"#000000"}, c:{bg:"#FFFFFF",t:"#000000",bd:"#000000"}, alt:"#FFF8D9"},

  // 新极简主义 风格
  {cat:"新极简主义 风格", n:"纯净白", h:{bg:"#F3F4F6",t:"#111111",bd:"#D1D5DB"}, c:{bg:"#FFFFFF",t:"#333333",bd:"#E5E7EB"}, alt:"#F9FAFB"},
  {cat:"新极简主义 风格", n:"月光灰", h:{bg:"#F7F7F7",t:"#000000",bd:"#EEEEEE"}, c:{bg:"#FFFFFF",t:"#222222",bd:"#EEEEEE"}, alt:"#F9F9F9"},
  {cat:"新极简主义 风格", n:"自然亚麻", h:{bg:"#F5F3ED",t:"#3D3A35",bd:"#E8E5DF"}, c:{bg:"#FFFFFF",t:"#3D3A35",bd:"#E8E5DF"}, alt:"#F9F8F5"},
  {cat:"新极简主义 风格", n:"极简夜", h:{bg:"#3A3A3C",t:"#FFFFFF",bd:"#48484A"}, c:{bg:"#1C1C1E",t:"#EBEBF5",bd:"#48484A"}, alt:"#242426"},
  {cat:"新极简主义 风格", n:"柔雾蓝", h:{bg:"#F0F4F8",t:"#102A43",bd:"#D9E2EC"}, c:{bg:"#FFFFFF",t:"#243B53",bd:"#D9E2EC"}, alt:"#F8FAFC"},
  {cat:"新极简主义 风格", n:"淡抹茶", h:{bg:"#F2F5F0",t:"#1E3323",bd:"#E1E8E0"}, c:{bg:"#FFFFFF",t:"#2A4230",bd:"#E1E8E0"}, alt:"#F7F9F6"},

  // 微软 风格
  {cat:"微软 风格", n:"Excel绿",  h:{bg:"#107C41",t:"#FFFFFF",bd:"#0F703B"},c:{bg:"#FFFFFF",t:"#242424",bd:"#D2D2D2"},alt:"#F3F2F1"},
  {cat:"微软 风格", n:"Word蓝",  h:{bg:"#185ABD",t:"#FFFFFF",bd:"#144A9C"},c:{bg:"#FFFFFF",t:"#242424",bd:"#D2D2D2"},alt:"#F3F2F1"},
  {cat:"微软 风格", n:"PPT红",  h:{bg:"#C43E1C",t:"#FFFFFF",bd:"#B03310"},c:{bg:"#FFFFFF",t:"#242424",bd:"#D2D2D2"},alt:"#F3F2F1"},
  {cat:"微软 风格", n:"Fluent白",  h:{bg:"#F3F2F1",t:"#323130",bd:"#EDEBE9"},c:{bg:"#FFFFFF",t:"#323130",bd:"#EDEBE9"},alt:"#FAFAFA"},
  {cat:"微软 风格", n:"Teams紫",  h:{bg:"#5B5FC7",t:"#FFFFFF",bd:"#5053B5"},c:{bg:"#FFFFFF",t:"#242424",bd:"#D2D2D2"},alt:"#F3F2F1"},
  {cat:"微软 风格", n:"雅黑",    h:{bg:"#000000",t:"#FFFFFF",bd:"#111111"},c:{bg:"#FFFFFF",t:"#000000",bd:"#CCCCCC"},alt:"#EEEEEE"},
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
  fontFamily: "'Inter', sans-serif",
  hAlign: 'left',
  vAlign: 'top',
  headerOn: true,
  zebraOn: false,
  paletteIndex: 0,
  wrapText: false,
};
