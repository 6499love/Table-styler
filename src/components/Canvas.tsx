import React, { useState, useRef, useCallback } from 'react';
import { 
  GlobalStyle, 
  CellStyle, 
  PALETTES,
  MergeInfo
} from '../lib/types';
import { cn } from '../lib/utils';

interface CanvasProps {
  data: string[][];
  merges: Record<string, MergeInfo | 'hidden'>;
  cellStyles: Record<string, CellStyle>;
  rowStyles: Record<number, CellStyle>;
  colStyles: Record<number, CellStyle>;
  globalStyle: GlobalStyle;
  selectedCells: Set<string>;
  selectedRC: Set<number>;
  selectionMode: 'cell' | 'row' | 'col';
  onCellClick: (r: number, c: number, shiftKey: boolean) => void;
  onRCClick: (index: number, mode: 'row' | 'col', shiftKey: boolean) => void;
  onUpdateData: (r: number, c: number, value: string) => void;
  tableRef: React.RefObject<HTMLTableElement>;
}

export function Canvas({
  data,
  merges,
  cellStyles,
  rowStyles,
  colStyles,
  globalStyle,
  selectedCells,
  selectedRC,
  selectionMode,
  onCellClick,
  onRCClick,
  onUpdateData,
  tableRef
}: CanvasProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // --- STYLE CALCULATION ---
  const getEffectiveStyle = useCallback((r: number, c: number) => {
    const p = PALETTES[globalStyle.paletteIndex];
    const isHeader = globalStyle.headerOn && r === 0;
    const isAlt = globalStyle.zebraOn && !isHeader && r % 2 === 0;
    
    const base: CellStyle = {
      bg: isHeader ? p.h.bg : (isAlt ? p.alt : p.c.bg),
      text: isHeader ? p.h.t : p.c.t,
      border: isHeader ? p.h.bd : p.c.bd,
      bold: isHeader,
      fontSize: globalStyle.fontSize,
      hAlign: globalStyle.hAlign,
      vAlign: globalStyle.vAlign,
    };

    // Apply Row/Col overrides
    const rowStyle = rowStyles[r];
    const colStyle = colStyles[c];
    if (colStyle) Object.assign(base, colStyle);
    if (rowStyle) Object.assign(base, rowStyle);

    // Apply Cell overrides
    const cellStyle = cellStyles[`${r},${c}`];
    if (cellStyle) Object.assign(base, cellStyle);

    return base;
  }, [globalStyle, rowStyles, colStyles, cellStyles]);

  // --- EDITING ---
  const handleDoubleClick = (r: number, c: number) => {
    setEditingCell(`${r},${c}`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTableCellElement>, r: number, c: number) => {
    onUpdateData(r, c, e.target.innerText);
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>, r: number, c: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditingCell(null);
      // Revert content if needed (not implemented here for simplicity)
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0c0e]">
      {/* Preview Area */}
      <div 
        ref={previewRef}
        className="flex-1 overflow-auto p-8 flex items-start justify-center bg-[#101012]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #101012 0, #101012 10px, #0c0c0e 10px, #0c0c0e 20px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            // Clicked on background, clear selection
            // This logic should be handled by parent if needed, or passed down
          }
        }}
      >
        <table 
          ref={tableRef}
          id="tbl"
          style={{
            borderCollapse: 'separate',
            borderSpacing: `${globalStyle.gap}px`,
            fontFamily: globalStyle.fontFamily,
            minWidth: '260px'
          }}
        >
          <tbody>
            {data.map((row, r) => (
              <tr key={r}>
                {row.map((cellValue, c) => {
                  const key = `${r},${c}`;
                  if (merges[key] === 'hidden') return null;

                  const mergeInfo = merges[key] as MergeInfo | undefined;
                  const style = getEffectiveStyle(r, c);
                  const isSelected = selectedCells.has(key);
                  const isRCSelected = (selectionMode === 'row' && selectedRC.has(r)) || (selectionMode === 'col' && selectedRC.has(c));
                  const isEditing = editingCell === key;

                  return (
                    <td
                      key={c}
                      data-r={r}
                      data-c={c}
                      rowSpan={mergeInfo?.rs}
                      colSpan={mergeInfo?.cs}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onClick={(e) => onCellClick(r, c, e.shiftKey)}
                      onDoubleClick={() => handleDoubleClick(r, c)}
                      onBlur={(e) => handleBlur(e, r, c)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className={cn(
                        "outline-none whitespace-nowrap cursor-default transition-all duration-75 relative",
                        isEditing && "cursor-text ring-2 ring-[#6eb5c8] z-50",
                        isSelected && !isEditing && "ring-2 ring-[#c9aa72] z-40",
                        isRCSelected && !isSelected && !isEditing && "ring-2 ring-[#6eb5c8] z-30 opacity-90"
                      )}
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        border: `${globalStyle.borderWidth}px solid ${style.border}`,
                        borderRadius: `${globalStyle.radius}px`,
                        padding: `${globalStyle.padding}px ${Math.round(globalStyle.padding * 1.4)}px`,
                        fontSize: `${style.fontSize}px`,
                        fontWeight: style.bold ? 700 : 400,
                        textAlign: style.hAlign,
                        verticalAlign: style.vAlign === 'middle' ? 'middle' : style.vAlign === 'bottom' ? 'bottom' : 'top',
                      }}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
