import React, { useState } from 'react';
import { GlobalStyle, CellStyle, PALETTES } from '../lib/types';
import { cn } from '../lib/utils';
import { Upload, Trash2, Plus, Grid, Download, Image as ImageIcon, RefreshCw, FileText } from 'lucide-react';

interface LeftPanelProps {
  onAddRow: () => void;
  onAddCol: () => void;
  onDelRow: () => void;
  onDelCol: () => void;
  onMerge: () => void;
  onUnmerge: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportCSV: (content: string) => void;
  onReset: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

export function LeftPanel({
  onAddRow,
  onAddCol,
  onDelRow,
  onDelCol,
  onMerge,
  onUnmerge,
  onFileUpload,
  onImportCSV,
  onReset,
  onExportPNG,
  onExportSVG
}: LeftPanelProps) {
  const [csvContent, setCsvContent] = useState('');

  return (
    <div className="w-[320px] flex flex-col bg-[#141416] border-r border-[#2c2c32] shrink-0 h-full">
      {/* Header */}
      <div className="h-14 px-6 flex items-center gap-3 border-b border-[#2c2c32] bg-[#141416]">
        <div className="w-8 h-8 bg-[#c9aa72] rounded flex items-center justify-center text-[#141416] font-bold font-serif text-xl">
          T
        </div>
        <div>
          <h1 className="font-serif text-[#e4e4ea] text-base tracking-wide font-bold">Table Styler</h1>
          <p className="text-[#60607a] text-[10px] uppercase tracking-widest">Pro Edition</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* DATA IMPORT */}
        <Section title="数据源" icon={<FileText size={14} />}>
          <div className="border-2 border-dashed border-[#2c2c32] rounded-lg p-6 text-center hover:border-[#c9aa72] transition-colors relative group cursor-pointer bg-[#1c1c1f]/50 mb-4">
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              onChange={onFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <Upload className="w-8 h-8 mx-auto mb-3 text-[#60607a] group-hover:text-[#c9aa72] transition-colors" />
            <p className="text-sm text-[#e4e4ea] font-medium mb-1">
              点击或拖拽上传
            </p>
            <p className="text-xs text-[#60607a]">
              支持 .xlsx / .csv 格式
            </p>
          </div>
          
          <div className="space-y-3">
            <textarea
              value={csvContent}
              onChange={e => setCsvContent(e.target.value)}
              placeholder="在此粘贴 Excel 或 CSV 数据..."
              className="w-full h-24 bg-[#1c1c1f] border border-[#2c2c32] text-[#e4e4ea] text-sm p-3 rounded-lg outline-none resize-none focus:border-[#6eb5c8] placeholder:text-[#60607a] transition-colors"
            />
            <Button onClick={() => onImportCSV(csvContent)} variant="secondary" className="w-full">
              导入文本数据
            </Button>
          </div>
        </Section>

        {/* STRUCTURE */}
        <Section title="表格结构" icon={<Grid size={14} />}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button onClick={onAddRow} variant="secondary"><Plus size={14} /> 添加行</Button>
            <Button onClick={onAddCol} variant="secondary"><Plus size={14} /> 添加列</Button>
            <Button onClick={onDelRow} variant="danger"><Trash2 size={14} /> 删除选中行</Button>
            <Button onClick={onDelCol} variant="danger"><Trash2 size={14} /> 删除选中列</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onMerge} variant="secondary"><Grid size={14} /> 合并单元格</Button>
            <Button onClick={onUnmerge} variant="secondary"><Grid size={14} /> 取消合并</Button>
          </div>
        </Section>

        {/* EXPORT & ACTIONS */}
        <Section title="导出与操作" icon={<Download size={14} />}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button onClick={onExportSVG} variant="primary"><Download size={14} /> 导出 SVG</Button>
            <Button onClick={onExportPNG} variant="secondary"><ImageIcon size={14} /> 导出 PNG</Button>
          </div>
          <Button onClick={onReset} variant="danger" className="w-full opacity-80 hover:opacity-100">
            <RefreshCw size={14} /> 重置所有内容
          </Button>
        </Section>

      </div>
      
      <div className="p-4 border-t border-[#2c2c32] text-center">
        <p className="text-xs text-[#60607a]">v3.1.0 • Auto-saved</p>
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

const Button = ({ onClick, children, variant = 'primary', className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95",
      variant === 'primary' && "bg-[#c9aa72] text-[#0c0c0e] hover:bg-[#dbbe86] shadow-lg shadow-[#c9aa72]/10",
      variant === 'secondary' && "bg-[#1c1c1f] border border-[#2c2c32] text-[#e4e4ea] hover:border-[#60607a] hover:bg-[#222226]",
      variant === 'danger' && "bg-[#1c1c1f] border border-[#2c2c32] text-[#c06870] hover:border-[#c06870] hover:bg-[#c06870]/10",
      className
    )}
  >
    {children}
  </button>
);
