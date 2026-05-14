import React, { useState } from 'react';
import { GlobalStyle, CellStyle, PALETTES } from '../lib/types';
import { cn } from '../lib/utils';
import { Upload, Trash2, Plus, Grid, Download, Image as ImageIcon, RefreshCw, FileText, Sun, Moon } from 'lucide-react';

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
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
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
  onExportSVG,
  isDarkMode,
  setIsDarkMode
}: LeftPanelProps) {
  const [csvContent, setCsvContent] = useState('');

  return (
    <div className="w-[320px] flex flex-col bg-ui-bg2 border-r border-ui-border shrink-0 h-full">
      {/* Header */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-ui-border bg-ui-bg2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-ui-text1 rounded-md flex items-center justify-center text-ui-bg1 font-serif text-lg leading-none pt-0.5">
            C
          </div>
          <div>
            <h1 className="font-serif text-ui-text1 text-[17px] leading-none mb-1">Canvas Edit</h1>
            <p className="text-ui-text2 text-[10px] font-medium leading-none">TABLE PRO</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-ui-border text-ui-text2 hover:text-ui-text1 hover:bg-ui-hover transition-colors"
          title={isDarkMode ? "切换到白天模式" : "切换到黑夜模式"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* DATA IMPORT */}
        <Section title="数据源" icon={<FileText size={14} />}>
          <div className="border border-dashed border-ui-border rounded-xl p-6 text-center hover:border-ui-accent transition-colors relative group cursor-pointer bg-ui-bg1 mb-4 flex flex-col items-center justify-center min-h-[120px]">
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              onChange={onFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <Upload className="w-6 h-6 mb-3 text-ui-text2 group-hover:text-ui-accent transition-colors" />
            <p className="text-sm text-ui-text1 font-medium mb-1">
              上传数据文件
            </p>
            <p className="text-xs text-ui-text2">
              .xlsx / .csv
            </p>
            <p className="text-[10px] text-ui-text2 mt-2 opacity-80">
              上限: 30 × 30 cells
            </p>
          </div>
          
          <div className="space-y-3">
            <textarea
              value={csvContent}
              onChange={e => setCsvContent(e.target.value)}
              placeholder="在此粘贴 Excel 或 CSV 数据..."
              className="w-full h-24 bg-ui-bg1 border border-ui-border text-ui-text1 text-sm p-3 rounded-lg outline-none resize-none focus:border-ui-text1 placeholder:text-ui-text2 transition-colors font-mono"
            />
            <Button onClick={() => onImportCSV(csvContent)} variant="secondary" className="w-full">
              导入文本数据
            </Button>
            <p className="text-ui-text2 text-[10px] text-center mt-2">
              注意：为了防止卡顿，表格最大限制为 30 行 × 30 列
            </p>
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
      
      <div className="p-4 border-t border-ui-border text-center">
        <p className="text-xs text-ui-text2">v3.1.0 • Auto-saved</p>
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

const Button = ({ onClick, children, variant = 'primary', className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98]",
      variant === 'primary' && "bg-ui-text1 text-ui-bg1 hover:opacity-90 shadow-sm",
      variant === 'secondary' && "bg-ui-bg1 border border-ui-border text-ui-text1 hover:bg-ui-hover",
      variant === 'danger' && "bg-white dark:bg-ui-bg2 border border-ui-border text-ui-danger hover:border-ui-danger hover:bg-red-50 dark:hover:bg-red-950/30",
      className
    )}
  >
    {children}
  </button>
);
