import React, { useState } from 'react';
import { GlobalStyle, CellStyle, PALETTES } from '../lib/types';
import { cn } from '../lib/utils';
import { Palette, Type, Layout, Grid, Settings, AlignLeft, AlignCenter, AlignRight, Bold, WrapText } from 'lucide-react';

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

  // Auto-switch tabs based on selection
  React.useEffect(() => {
    if (selectedCells.size > 0 || selectedRC.size > 0) {
      setActiveTab('selection');
    } else {
      setActiveTab('global');
    }
  }, [selectedCells.size, selectedRC.size]);

  return (
    <div className="w-[300px] flex flex-col bg-[#141416] border-l border-[#2c2c32] shrink-0 h-full">
      {/* Tabs */}
      <div className="flex h-14 border-b border-[#2c2c32]">
        <button
          onClick={() => setActiveTab('global')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2",
            activeTab === 'global' 
              ? "text-[#c9aa72] border-[#c9aa72] bg-[#1c1c1f]/50" 
              : "text-[#60607a] border-transparent hover:text-[#e4e4ea] hover:bg-[#1c1c1f]/20"
          )}
        >
          <Settings size={16} /> 全局样式
        </button>
        <button
          onClick={() => setActiveTab('selection')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2",
            activeTab === 'selection' 
              ? "text-[#6eb5c8] border-[#6eb5c8] bg-[#1c1c1f]/50" 
              : "text-[#60607a] border-transparent hover:text-[#e4e4ea] hover:bg-[#1c1c1f]/20"
          )}
        >
          <Grid size={16} /> 选中样式
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* --- GLOBAL TAB --- */}
        {activeTab === 'global' && (
          <>
            <Section title="主题配色" icon={<Palette size={14} />}>
              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setGlobalStyle({ paletteIndex: i })}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all group relative overflow-hidden",
                      globalStyle.paletteIndex === i 
                        ? "bg-[#1c1c1f] border-[#c9aa72] ring-1 ring-[#c9aa72]/50" 
                        : "bg-[#1c1c1f] border-[#2c2c32] hover:border-[#60607a]"
                    )}
                  >
                    <div className="text-xs font-bold text-[#e4e4ea] mb-2 group-hover:text-[#c9aa72] transition-colors">{p.n}</div>
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.h.bg }} />
                      <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.c.bg }} />
                      <div className="w-4 h-4 rounded shadow-sm" style={{ background: p.alt }} />
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="布局与尺寸" icon={<Layout size={14} />}>
              <Slider label="圆角" value={globalStyle.radius} min={0} max={24} onChange={v => setGlobalStyle({ radius: v })} suffix="px" />
              <Slider label="描边宽度" value={globalStyle.borderWidth} min={0} max={10} step={1} onChange={v => setGlobalStyle({ borderWidth: v })} suffix="px" />
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#60607a]">描边方式</span>
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

            <Section title="文字排版" icon={<Type size={14} />}>
              <Slider label="字号" value={globalStyle.fontSize} min={10} max={32} onChange={v => setGlobalStyle({ fontSize: v })} suffix="px" />
              <div className="mt-4">
                <label className="text-xs text-[#60607a] mb-2 block">字体系列</label>
                <select 
                  value={globalStyle.fontFamily}
                  onChange={(e) => setGlobalStyle({ fontFamily: e.target.value })}
                  className="w-full bg-[#1c1c1f] border border-[#2c2c32] text-[#e4e4ea] text-sm p-2.5 rounded-lg outline-none focus:border-[#c9aa72] transition-colors"
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
            <div className="bg-[#1c1c1f] border border-[#2c2c32] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#60607a] uppercase tracking-wider font-bold">当前选中</span>
                <span className="text-xs text-[#6eb5c8] bg-[#6eb5c8]/10 px-2 py-0.5 rounded-full">
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
                <div className="flex gap-2 mt-3 text-xs">
                  <button onClick={onSelectParentRow} className="flex-1 py-1.5 bg-[#1c1c1f] border border-[#2c2c32] text-[#e4e4ea] rounded hover:border-[#6eb5c8] hover:text-[#6eb5c8] transition-colors">
                    选中所在行
                  </button>
                  <button onClick={onSelectParentCol} className="flex-1 py-1.5 bg-[#1c1c1f] border border-[#2c2c32] text-[#e4e4ea] rounded hover:border-[#6eb5c8] hover:text-[#6eb5c8] transition-colors">
                    选中所在列
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

            <Section title="文字样式" icon={<Type size={14} />}>
              <Slider label="字号" value={14} min={10} max={32} onChange={v => updateSelectionStyle({ fontSize: v })} suffix="px" />
              <div className="flex gap-2 mt-4">
                <StyleButton onClick={() => updateSelectionStyle({ bold: true })} active={false} icon={<Bold size={16} />} title="加粗" />
                <StyleButton onClick={() => updateSelectionStyle({ bold: false })} active={false} icon={<Type size={16} />} title="取消加粗" />
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
              className="w-full py-3 rounded-lg border border-[#c06870] text-[#c06870] text-sm font-medium hover:bg-[#c06870]/10 transition-colors mt-8"
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
    <div className="flex items-center gap-2 mb-4 text-[#c9aa72]">
      {icon}
      <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
  <div className="flex items-center justify-between mb-3 bg-[#1c1c1f] p-3 rounded-lg border border-[#2c2c32]">
    <span className="text-sm text-[#e4e4ea]">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-10 h-5 rounded-full relative transition-colors",
        checked ? "bg-[#c9aa72]" : "bg-[#2c2c32]"
      )}
    >
      <div className={cn(
        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  </div>
);

const Slider = ({ label, value, min, max, step = 1, onChange, suffix }: any) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-sm text-[#60607a]">{label}</span>
      <span className="text-sm font-mono text-[#c9aa72]">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-[#2c2c32] rounded-lg appearance-none cursor-pointer accent-[#c9aa72]"
    />
  </div>
);

const ColorInput = ({ label, onChange }: any) => (
  <div className="flex items-center justify-between bg-[#1c1c1f] p-2 rounded-lg border border-[#2c2c32]">
    <span className="text-sm text-[#e4e4ea] ml-2">{label}</span>
    <div className="relative w-8 h-8 rounded overflow-hidden border border-[#2c2c32]">
      <input
        type="color"
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
      />
    </div>
  </div>
);

const AlignButton = ({ active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 h-9 flex items-center justify-center rounded-lg border transition-all",
      active 
        ? "bg-[#c9aa72]/10 border-[#c9aa72] text-[#c9aa72]" 
        : "bg-[#1c1c1f] border-[#2c2c32] text-[#60607a] hover:text-[#e4e4ea] hover:border-[#60607a]"
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
      "flex-1 h-9 flex items-center justify-center rounded-lg border transition-all",
      active 
        ? "bg-[#c9aa72]/10 border-[#c9aa72] text-[#c9aa72]" 
        : "bg-[#1c1c1f] border-[#2c2c32] text-[#60607a] hover:text-[#e4e4ea] hover:border-[#60607a]"
    )}
  >
    {icon}
  </button>
);

const ModeButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-1.5 text-xs font-medium rounded transition-colors",
      active 
        ? "bg-[#6eb5c8] text-[#0c0c0e]" 
        : "bg-[#2c2c32] text-[#60607a] hover:text-[#e4e4ea]"
    )}
  >
    {label}
  </button>
);
