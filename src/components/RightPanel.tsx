import React, { useState } from 'react';
import { GlobalStyle, CellStyle, PALETTES } from '../lib/types';
import { cn } from '../lib/utils';
import { Palette, Type as TypeIcon, Layout, Grid, Settings, AlignLeft, AlignCenter, AlignRight, Bold, WrapText, ChevronDown, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface RightPanelProps {
  globalStyle: GlobalStyle;
  setGlobalStyle: (s: Partial<GlobalStyle>) => void;
  selectionMode: 'cell' | 'row' | 'col';
  setSelectionMode: (m: 'cell' | 'row' | 'col') => void;
  selectedCells: Set<string>;
  selectedRC: Set<number>;
  updateSelectionStyle: (s: Partial<CellStyle>) => void;
  clearSelectionStyle: () => void;
  onSelectParentRow: () => void;
  onSelectParentCol: () => void;
}

export function RightPanel({
  globalStyle,
  setGlobalStyle,
  selectionMode,
  setSelectionMode,
  selectedCells,
  selectedRC,
  updateSelectionStyle,
  clearSelectionStyle,
  onSelectParentRow,
  onSelectParentCol
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'selection'>('global');
  const categories = Array.from(new Set(PALETTES.map(p => p.cat))).filter(Boolean) as string[];
  const [activeCatTab, setActiveCatTab] = useState<string>(categories[0] || '');

  // Auto-switch tabs based on selection
  React.useEffect(() => {
    if (selectedCells.size > 0 || selectedRC.size > 0) {
      setActiveTab('selection');
    } else {
      setActiveTab('global');
    }
  }, [selectedCells.size, selectedRC.size]);

  return (
    <div className="w-[300px] flex flex-col bg-ui-bg2 border-l border-ui-border shrink-0 h-full">
      {/* Tabs */}
      <div className="flex h-14 border-b border-ui-border">
        <button
          onClick={() => setActiveTab('global')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[13px] font-medium transition-colors border-b-[2px]",
            activeTab === 'global' 
              ? "text-ui-text1 border-ui-text1 bg-ui-hover/30" 
              : "text-ui-text2 border-transparent hover:text-ui-text1 hover:bg-ui-hover/50"
          )}
        >
          <Settings size={14} /> 全局样式
        </button>
        <button
          onClick={() => setActiveTab('selection')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[13px] font-medium transition-colors border-b-[2px]",
            activeTab === 'selection' 
              ? "text-ui-select border-ui-select bg-ui-hover/30" 
              : "text-ui-text2 border-transparent hover:text-ui-text1 hover:bg-ui-hover/50"
          )}
        >
          <Grid size={14} /> 选中样式
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* --- GLOBAL TAB --- */}
        {activeTab === 'global' && (
          <>
            <Section title="主题配色" icon={<Palette size={14} />}>
              <div className="mt-2">
                <GenerativePaletteUpload onGenerated={(newPalette) => {
                  PALETTES.push(newPalette);
                  const newIndex = PALETTES.length - 1;
                  setActiveCatTab('自定义 风格');
                  setGlobalStyle({ paletteIndex: newIndex });
                }} />
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mb-4 border-b border-ui-border">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCatTab(cat)}
                      className={cn(
                        "px-2 py-1.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors",
                        activeCatTab === cat
                          ? "text-ui-text1 border-ui-text1"
                          : "text-ui-text2 border-transparent hover:text-ui-text1 hover:border-ui-border"
                      )}
                    >
                      {cat.replace(' 风格', '')}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {PALETTES.map((p, i) => p.cat === activeCatTab ? (
                    <button
                      key={i}
                      onClick={() => setGlobalStyle({ paletteIndex: i })}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all group/btn relative overflow-hidden",
                        globalStyle.paletteIndex === i 
                          ? "bg-ui-bg1 border-ui-text1 ring-1 ring-ui-text1" 
                          : "bg-ui-bg1 border-ui-border hover:border-ui-text2"
                      )}
                    >
                      <div className="text-[12px] font-medium text-ui-text1 mb-2 group-hover/btn:text-ui-text1 transition-colors">{p.n}</div>
                      <div className="flex gap-1.5">
                        <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.h.bg }} />
                        <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.c.bg }} />
                        <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.alt }} />
                      </div>
                    </button>
                  ) : null)}
                </div>
              </div>
            </Section>

            <Section title="布局与尺寸" icon={<Layout size={14} />}>
              <Slider label="圆角" value={globalStyle.radius} min={0} max={24} onChange={v => setGlobalStyle({ radius: v })} suffix="px" />
              <Slider label="描边宽度" value={globalStyle.borderWidth} min={0} max={10} step={1} onChange={v => setGlobalStyle({ borderWidth: v })} suffix="px" />
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-ui-text2">描边方式</span>
                </div>
                <div className="flex gap-2">
                  <ModeButton active={globalStyle.strokeAlign === 'inside'} onClick={() => setGlobalStyle({ strokeAlign: 'inside' })} label="内部" />
                  <ModeButton active={globalStyle.strokeAlign === 'center'} onClick={() => setGlobalStyle({ strokeAlign: 'center' })} label="居中" />
                  <ModeButton active={globalStyle.strokeAlign === 'outside'} onClick={() => setGlobalStyle({ strokeAlign: 'outside' })} label="外部" />
                </div>
              </div>

              <Slider label="内边距" value={globalStyle.padding} min={4} max={32} onChange={v => setGlobalStyle({ padding: v })} suffix="px" />
              <Slider label="单元格间距" value={globalStyle.gap} min={0} max={20} onChange={v => setGlobalStyle({ gap: v })} suffix="px" />
            </Section>

            <Section title="文字排版" icon={<TypeIcon size={14} />}>
              <Slider label="字号" value={globalStyle.fontSize} min={10} max={32} onChange={v => setGlobalStyle({ fontSize: v })} suffix="px" />
              
              <div className="mt-4 mb-4">
                <label className="text-xs text-ui-text2 mb-2 block">对齐方式</label>
                <div className="flex gap-2 mb-2">
                  <AlignButton active={globalStyle.hAlign === 'left'} onClick={() => setGlobalStyle({ hAlign: 'left' })} icon={<AlignLeft size={16} />} />
                  <AlignButton active={globalStyle.hAlign === 'center'} onClick={() => setGlobalStyle({ hAlign: 'center' })} icon={<AlignCenter size={16} />} />
                  <AlignButton active={globalStyle.hAlign === 'right'} onClick={() => setGlobalStyle({ hAlign: 'right' })} icon={<AlignRight size={16} />} />
                </div>
                <div className="flex gap-2">
                  <AlignButton active={globalStyle.vAlign === 'top'} onClick={() => setGlobalStyle({ vAlign: 'top' })} icon={<span className="text-xs font-bold">TOP</span>} />
                  <AlignButton active={globalStyle.vAlign === 'middle'} onClick={() => setGlobalStyle({ vAlign: 'middle' })} icon={<span className="text-xs font-bold">MID</span>} />
                  <AlignButton active={globalStyle.vAlign === 'bottom'} onClick={() => setGlobalStyle({ vAlign: 'bottom' })} icon={<span className="text-xs font-bold">BOT</span>} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-ui-text2 mb-2 block">字体系列</label>
                <select 
                  value={globalStyle.fontFamily}
                  onChange={(e) => setGlobalStyle({ fontFamily: e.target.value })}
                  className="w-full bg-ui-bg1 border border-ui-border text-ui-text1 text-[13px] p-2 rounded-lg outline-none focus:border-ui-text1 transition-colors"
                >
                  <option value="'Noto Sans SC', sans-serif">黑体 (Sans Serif)</option>
                  <option value="'Noto Serif SC', serif">宋体 (Serif)</option>
                  <option value="'DM Mono', monospace">等宽 (Monospace)</option>
                </select>
              </div>
            </Section>

            <Section title="显示选项" icon={<Settings size={14} />}>
              <Toggle 
                label="首行为表头" 
                checked={globalStyle.headerOn} 
                onChange={v => setGlobalStyle({ headerOn: v })} 
              />
              <Toggle 
                label="斑马纹背景" 
                checked={globalStyle.zebraOn} 
                onChange={v => setGlobalStyle({ zebraOn: v })} 
              />
              <Toggle 
                label="自动换行" 
                checked={globalStyle.wrapText} 
                onChange={v => setGlobalStyle({ wrapText: v })} 
              />
            </Section>
          </>
        )}

        {/* --- SELECTION TAB --- */}
        {activeTab === 'selection' && (
          <>
            <div className="bg-ui-bg1 border border-ui-border rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-ui-text1 font-medium">当前选中</span>
                <span className="text-[11px] font-medium text-ui-select bg-ui-select/10 px-2 py-0.5 rounded-full">
                  {selectionMode === 'cell' ? `${selectedCells.size} 单元格` : 
                   selectionMode === 'row' ? `${selectedRC.size} 行` : `${selectedRC.size} 列`}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <ModeButton active={selectionMode === 'cell'} onClick={() => setSelectionMode('cell')} label="单元格" />
                <ModeButton active={selectionMode === 'row'} onClick={() => setSelectionMode('row')} label="行" />
                <ModeButton active={selectionMode === 'col'} onClick={() => setSelectionMode('col')} label="列" />
              </div>
              {selectionMode === 'cell' && selectedCells.size > 0 && (
                <div className="flex gap-2 mt-3 text-[12px] font-medium">
                  <button onClick={onSelectParentRow} className="flex-1 py-1.5 bg-ui-bg2 border border-ui-border text-ui-text1 rounded hover:border-ui-select hover:text-ui-select transition-colors">
                    所在行
                  </button>
                  <button onClick={onSelectParentCol} className="flex-1 py-1.5 bg-ui-bg2 border border-ui-border text-ui-text1 rounded hover:border-ui-select hover:text-ui-select transition-colors">
                    所在列
                  </button>
                </div>
              )}
            </div>

            <Section title="样式覆盖" icon={<Palette size={14} />}>
              <div className="space-y-4">
                <ColorInput label="背景颜色" onChange={v => updateSelectionStyle({ bg: v })} />
                <ColorInput label="文字颜色" onChange={v => updateSelectionStyle({ text: v })} />
                <ColorInput label="描边颜色" onChange={v => updateSelectionStyle({ border: v })} />
              </div>
            </Section>

            <Section title="文字样式" icon={<TypeIcon size={14} />}>
              <Slider label="字号" value={14} min={10} max={32} onChange={v => updateSelectionStyle({ fontSize: v })} suffix="px" />
              <div className="flex gap-2 mt-4">
                <StyleButton onClick={() => updateSelectionStyle({ bold: true })} active={false} icon={<Bold size={16} />} title="加粗" />
                <StyleButton onClick={() => updateSelectionStyle({ bold: false })} active={false} icon={<TypeIcon size={16} />} title="取消加粗" />
                <StyleButton onClick={() => updateSelectionStyle({ wrapText: true })} active={false} icon={<WrapText size={16} />} title="自动换行" />
                <StyleButton onClick={() => updateSelectionStyle({ wrapText: false })} active={false} icon={<span className="text-xs font-bold whitespace-nowrap">不换行</span>} title="取消换行" />
              </div>
            </Section>

            <Section title="对齐方式" icon={<Layout size={14} />}>
              <div className="flex gap-2 mb-3">
                <AlignButton active={false} onClick={() => updateSelectionStyle({ hAlign: 'left' })} icon={<AlignLeft size={16} />} />
                <AlignButton active={false} onClick={() => updateSelectionStyle({ hAlign: 'center' })} icon={<AlignCenter size={16} />} />
                <AlignButton active={false} onClick={() => updateSelectionStyle({ hAlign: 'right' })} icon={<AlignRight size={16} />} />
              </div>
              <div className="flex gap-2">
                <AlignButton active={false} onClick={() => updateSelectionStyle({ vAlign: 'top' })} icon={<span className="text-xs font-bold">TOP</span>} />
                <AlignButton active={false} onClick={() => updateSelectionStyle({ vAlign: 'middle' })} icon={<span className="text-xs font-bold">MID</span>} />
                <AlignButton active={false} onClick={() => updateSelectionStyle({ vAlign: 'bottom' })} icon={<span className="text-xs font-bold">BOT</span>} />
              </div>
            </Section>

            <button 
              onClick={clearSelectionStyle}
              className="w-full py-2.5 rounded-lg border border-ui-danger text-ui-danger text-[13px] font-medium hover:bg-ui-danger/10 transition-colors mt-8"
            >
              清除自定义样式
            </button>
          </>
        )}

      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

const Section = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-4 text-ui-text1">
      {icon}
      <h3 className="text-[13px] font-medium">{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
  <div className="flex items-center justify-between mb-2 bg-ui-bg1 p-2.5 px-3 rounded-lg border border-ui-border">
    <span className="text-[13px] font-medium text-ui-text1">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-9 h-5 rounded-full relative transition-colors border",
        checked ? "bg-ui-accent border-ui-accent" : "bg-ui-bg2 border-ui-border"
      )}
    >
      <div className={cn(
        "absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform shadow-sm",
        checked ? "translate-x-4" : "translate-x-0"
      )} />
    </button>
  </div>
);

const Slider = ({ label, value, min, max, step = 1, onChange, suffix }: any) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-[13px] text-ui-text2">{label}</span>
      <span className="text-[13px] font-mono text-ui-text1">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-ui-border rounded-lg appearance-none cursor-pointer accent-ui-accent"
    />
  </div>
);

const ColorInput = ({ label, onChange }: any) => (
  <div className="flex items-center justify-between bg-ui-bg1 p-2 px-3 rounded-lg border border-ui-border">
    <span className="text-[13px] font-medium text-ui-text1">{label}</span>
    <div className="relative w-6 h-6 rounded-md overflow-hidden border border-ui-border/50 shadow-sm cursor-pointer hover:scale-105 transition-transform">
      <input
        type="color"
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer p-0 border-0"
      />
    </div>
  </div>
);

const AlignButton = ({ active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 h-8 flex items-center justify-center rounded-lg border transition-all",
      active 
        ? "bg-ui-text1 text-ui-bg1 border-ui-text1" 
        : "bg-ui-bg1 border-ui-border text-ui-text2 hover:text-ui-text1 hover:border-ui-border"
    )}
  >
    {icon}
  </button>
);

const StyleButton = ({ active, onClick, icon, title }: any) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "flex-1 h-8 flex items-center justify-center rounded-lg border transition-all",
      active 
        ? "bg-ui-text1 text-ui-bg1 border-ui-text1" 
        : "bg-ui-bg1 border-ui-border text-ui-text2 hover:text-ui-text1 hover:border-ui-border"
    )}
  >
    {icon}
  </button>
);

const ModeButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors border",
      active 
        ? "bg-ui-select/10 text-ui-select border-ui-select" 
        : "bg-ui-bg1 border-ui-border text-ui-text2 hover:text-ui-text1 hover:bg-ui-bg2"
    )}
  >
    {label}
  </button>
);

const GenerativePaletteUpload = ({ onGenerated }: { onGenerated: (p: any) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            'Extract an appealing 5-color aesthetic palette from this image formatted for a table UI. You must return EXACTLY the json format specified in the schema. You should decide on a fitting name.'
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                n: { type: Type.STRING, description: 'Creative name for this palette, e.g. "Sunset Glow"' },
                h: {
                  type: Type.OBJECT,
                  description: 'Header style',
                  properties: {
                    bg: { type: Type.STRING, description: 'hex color for background' },
                    t: { type: Type.STRING, description: 'hex color for text (must contrast with bg)' },
                    bd: { type: Type.STRING, description: 'hex color for border' }
                  },
                  required: ['bg', 't', 'bd']
                },
                c: {
                  type: Type.OBJECT,
                  description: 'Cell style',
                  properties: {
                    bg: { type: Type.STRING, description: 'hex color for background' },
                    t: { type: Type.STRING, description: 'hex color for text' },
                    bd: { type: Type.STRING, description: 'hex color for border' }
                  },
                  required: ['bg', 't', 'bd']
                },
                alt: { type: Type.STRING, description: 'Alternate row background hex color' }
              },
              required: ['n', 'h', 'c', 'alt']
            }
          }
        });

        if (response.text) {
          const data = JSON.parse(response.text);
          onGenerated({ cat: '自定义 风格', ...data });
        }
        setIsGenerating(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      alert('生成配色失败，请稍后重试');
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="flex items-center justify-center w-full h-10 px-4 transition bg-ui-bg1 border border-ui-border border-dashed rounded-lg appearance-none cursor-pointer hover:border-ui-text1 focus:outline-none">
        {isGenerating ? (
          <span className="flex items-center space-x-2 text-ui-text1 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>提取配色中...</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2 text-ui-text2 hover:text-ui-text1 text-xs">
            <Upload className="w-4 h-4" />
            <span>上传图片提取配色</span>
          </span>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isGenerating} />
      </label>
    </div>
  );
};
