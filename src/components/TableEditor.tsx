import React, { useState, useRef, useCallback } from 'react';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { Canvas } from './Canvas';
import { cn } from '../lib/utils';
import { 
  GlobalStyle, 
  CellStyle, 
  INITIAL_DATA, 
  DEFAULT_GLOBAL_STYLE,
  MergeInfo
} from '../lib/types';
import * as XLSX from 'xlsx';

export function TableEditor() {
  // --- STATE ---
  const [data, setData] = useState<string[][]>(INITIAL_DATA);
  const [merges, setMerges] = useState<Record<string, MergeInfo | 'hidden'>>({});
  const [cellStyles, setCellStyles] = useState<Record<string, CellStyle>>({});
  const [rowStyles, setRowStyles] = useState<Record<number, CellStyle>>({});
  const [colStyles, setColStyles] = useState<Record<number, CellStyle>>({});
  const [globalStyle, setGlobalStyle] = useState<GlobalStyle>(DEFAULT_GLOBAL_STYLE);
  
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectedRC, setSelectedRC] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState<'cell' | 'row' | 'col'>('cell');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const tableRef = useRef<HTMLTableElement>(null);

  // --- ACTIONS ---
  
  const handleCellClick = useCallback((r: number, c: number, shiftKey: boolean) => {
    const key = `${r},${c}`;
    if (merges[key] === 'hidden') return; // Skip hidden cells
    
    setSelectionMode('cell');
    setSelectedRC(new Set());
    
    setSelectedCells(prev => {
      const next = new Set(shiftKey ? prev : []);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, [merges]);

  const handleRCClick = useCallback((index: number, mode: 'row' | 'col', shiftKey: boolean) => {
    setSelectionMode(mode);
    setSelectedCells(new Set());
    
    setSelectedRC(prev => {
      const next = new Set(shiftKey ? prev : []);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const updateData = useCallback((r: number, c: number, value: string) => {
    setData(prev => {
      const next = [...prev];
      next[r] = [...next[r]];
      next[r][c] = value;
      return next;
    });
  }, []);

  const updateGlobalStyle = useCallback((updates: Partial<GlobalStyle>) => {
    setGlobalStyle(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSelectionStyle = useCallback((updates: Partial<CellStyle>) => {
    if (selectionMode === 'cell') {
      setCellStyles(prev => {
        const next = { ...prev };
        selectedCells.forEach(key => {
          next[key] = { ...next[key], ...updates };
        });
        return next;
      });
    } else {
      const setStyles = selectionMode === 'row' ? setRowStyles : setColStyles;
      setStyles(prev => {
        const next = { ...prev };
        selectedRC.forEach(index => {
          next[index] = { ...next[index], ...updates };
        });
        return next;
      });
    }
  }, [selectionMode, selectedCells, selectedRC]);

  const clearSelectionStyle = useCallback(() => {
    if (selectionMode === 'cell') {
      setCellStyles(prev => {
        const next = { ...prev };
        selectedCells.forEach(key => delete next[key]);
        return next;
      });
    } else {
      const setStyles = selectionMode === 'row' ? setRowStyles : setColStyles;
      setStyles(prev => {
        const next = { ...prev };
        selectedRC.forEach(index => delete next[index]);
        return next;
      });
    }
  }, [selectionMode, selectedCells, selectedRC]);

  const handleSelectParentRow = useCallback(() => {
    if (selectedCells.size === 0) return;
    const rows = new Set<number>();
    selectedCells.forEach(key => rows.add(parseInt(key.split(',')[0])));
    setSelectionMode('row');
    setSelectedRC(rows);
    setSelectedCells(new Set());
  }, [selectedCells]);

  const handleSelectParentCol = useCallback(() => {
    if (selectedCells.size === 0) return;
    const cols = new Set<number>();
    selectedCells.forEach(key => cols.add(parseInt(key.split(',')[1])));
    setSelectionMode('col');
    setSelectedRC(cols);
    setSelectedCells(new Set());
  }, [selectedCells]);

  // --- STRUCTURE EDITING ---

  const addRow = useCallback(() => {
    setData(prev => {
      if (prev.length >= 30) {
        alert('不能超过 30 行');
        return prev;
      }
      return [...prev, Array(prev[0].length).fill('')];
    });
  }, []);

  const addCol = useCallback(() => {
    setData(prev => {
      if (prev[0].length >= 30) {
        alert('不能超过 30 列');
        return prev;
      }
      return prev.map(row => [...row, '']);
    });
  }, []);

  const deleteRow = useCallback(() => {
    if (selectionMode !== 'cell' && selectionMode !== 'row') return;
    
    // Determine rows to delete
    const rowsToDelete = new Set<number>();
    if (selectionMode === 'row') {
      selectedRC.forEach(r => rowsToDelete.add(r));
    } else {
      selectedCells.forEach(key => rowsToDelete.add(parseInt(key.split(',')[0])));
    }
    
    if (rowsToDelete.size === 0) return;
    
    const sortedRows = Array.from(rowsToDelete).sort((a, b) => b - a);
    
    setData(prev => {
      const next = [...prev];
      sortedRows.forEach(r => {
        if (next.length > 1) next.splice(r, 1);
      });
      return next;
    });
    
    // Cleanup styles and merges would be complex, simplified for now:
    setMerges({});
    setCellStyles({});
    setRowStyles({});
    setSelectedCells(new Set());
    setSelectedRC(new Set());
  }, [selectionMode, selectedCells, selectedRC]);

  const deleteCol = useCallback(() => {
    if (selectionMode !== 'cell' && selectionMode !== 'col') return;

    const colsToDelete = new Set<number>();
    if (selectionMode === 'col') {
      selectedRC.forEach(c => colsToDelete.add(c));
    } else {
      selectedCells.forEach(key => colsToDelete.add(parseInt(key.split(',')[1])));
    }

    if (colsToDelete.size === 0) return;

    const sortedCols = Array.from(colsToDelete).sort((a, b) => b - a);

    setData(prev => {
      return prev.map(row => {
        const nextRow = [...row];
        sortedCols.forEach(c => {
          if (nextRow.length > 1) nextRow.splice(c, 1);
        });
        return nextRow;
      });
    });

    setMerges({});
    setCellStyles({});
    setColStyles({});
    setSelectedCells(new Set());
    setSelectedRC(new Set());
  }, [selectionMode, selectedCells, selectedRC]);

  // --- MERGING ---

  const mergeCells = useCallback(() => {
    if (selectedCells.size < 2) return;
    
    const coords = Array.from(selectedCells).map((k: string) => k.split(',').map(Number));
    const rs = coords.map(([r]) => r);
    const cs = coords.map(([, c]) => c);
    const minR = Math.min(...rs);
    const maxR = Math.max(...rs);
    const minC = Math.min(...cs);
    const maxC = Math.max(...cs);

    // Verify rectangle
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (!selectedCells.has(`${r},${c}`)) {
          alert('请选中矩形区域才能合并');
          return;
        }
      }
    }

    const topLeftKey = `${minR},${minC}`;
    const topText = data[minR][minC];

    setMerges(prev => {
      const next = { ...prev };
      next[topLeftKey] = { rs: maxR - minR + 1, cs: maxC - minC + 1 };
      
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          if (r === minR && c === minC) continue;
          next[`${r},${c}`] = 'hidden';
        }
      }
      return next;
    });

    // Combine content of merged cells
    setData(prev => {
      const next = [...prev];
      const combinedText: string[] = [];
      
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const val = prev[r][c];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            combinedText.push(String(val).trim());
          }
        }
      }
      
      const mergedValue = combinedText.join(' ');
      
      for (let r = minR; r <= maxR; r++) {
        next[r] = [...next[r]];
        for (let c = minC; c <= maxC; c++) {
          if (r === minR && c === minC) {
            next[r][c] = mergedValue;
          } else {
            next[r][c] = '';
          }
        }
      }
      return next;
    });
    
    setSelectedCells(new Set());
  }, [selectedCells, data]);

  const unmergeCells = useCallback(() => {
    setMerges(prev => {
      const next = { ...prev };
      selectedCells.forEach((key: string) => {
        if (next[key] && next[key] !== 'hidden') {
          const info = next[key] as MergeInfo;
          const [r, c] = key.split(',').map(Number);
          for (let dr = 0; dr < info.rs; dr++) {
            for (let dc = 0; dc < info.cs; dc++) {
              delete next[`${r + dr},${c + dc}`];
            }
          }
        }
      });
      return next;
    });
  }, [selectedCells]);

  // --- IMPORT ---
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];
      
      // Pad rows to equal length
      const maxCol = Math.max(...jsonData.map(r => r.length));
      
      let finalData = jsonData;
      if (finalData.length > 30 || maxCol > 30) {
        alert('导入的数据将被截断，表格最大限制为 30行 × 30列');
      }

      // Truncate to 30x30
      finalData = finalData.slice(0, 30);
      const actualMaxCol = Math.min(maxCol, 30);

      const paddedData = finalData.map(r => {
        const newRow = [...r].slice(0, 30);
        while (newRow.length < actualMaxCol) newRow.push('');
        return newRow;
      });

      const newMerges: Record<string, MergeInfo | 'hidden'> = {};
      if (ws['!merges']) {
        ws['!merges'].forEach(m => {
          const { s, e } = m;
          // Skip if the merge starts outside our bounds
          if (s.r >= 30 || s.c >= 30) return;
          
          const maxR = Math.min(e.r, 29);
          const maxC = Math.min(e.c, 29);
          const rs = maxR - s.r + 1;
          const cs = maxC - s.c + 1;

          if (rs > 1 || cs > 1) {
            newMerges[`${s.r},${s.c}`] = { rs, cs };
            for (let r = s.r; r <= maxR; r++) {
              for (let c = s.c; c <= maxC; c++) {
                if (r === s.r && c === s.c) continue;
                newMerges[`${r},${c}`] = 'hidden';
                
                // Set hidden cell value to empty string safely
                if (paddedData[r] && paddedData[r][c] !== undefined) {
                  paddedData[r][c] = '';
                }
              }
            }
          }
        });
      }

      setData(paddedData);
      setMerges(newMerges);
      setCellStyles({});
      setRowStyles({});
      setColStyles({});
      setSelectedCells(new Set());
      setSelectedRC(new Set());
    };
    reader.readAsBinaryString(file);
  }, []);

  const importCSV = useCallback((content: string) => {
    if (!content.trim()) return;
    const sep = content.includes('\t') ? '\t' : ',';
    const rows = content.split('\n').filter(l => l.trim()).map(l => l.split(sep).map(v => v.trim().replace(/^"|"$/g, '')));
    
    const maxCol = Math.max(...rows.map(r => r.length));
    
    let finalRows = rows;
    if (finalRows.length > 30 || maxCol > 30) {
      alert('导入的数据将被截断，表格最大限制为 30行 × 30列');
    }

    // Truncate to 30x30
    finalRows = finalRows.slice(0, 30);
    const actualMaxCol = Math.min(maxCol, 30);

    const paddedData = finalRows.map(r => {
      const newRow = [...r].slice(0, 30);
      while (newRow.length < actualMaxCol) newRow.push('');
      return newRow;
    });

    setData(paddedData);
    setMerges({});
    setCellStyles({});
    setRowStyles({});
    setColStyles({});
    setSelectedCells(new Set());
    setSelectedRC(new Set());
  }, []);

  const resetTable = useCallback(() => {
    setData(INITIAL_DATA);
    setMerges({});
    setCellStyles({});
    setRowStyles({});
    setColStyles({});
    setGlobalStyle(DEFAULT_GLOBAL_STYLE);
    setSelectedCells(new Set());
    setSelectedRC(new Set());
  }, []);

  // --- EXPORT ---
  const handleExportPNG = async () => {
    if (tableRef.current) {
      const { exportTableAsPNG } = await import('../lib/exporter');
      await exportTableAsPNG(tableRef.current);
    }
  };

  const handleExportSVG = async () => {
    if (tableRef.current) {
      const { exportTableAsSVG } = await import('../lib/exporter');
      await exportTableAsSVG(tableRef.current);
    }
  };

  return (
    <div className={cn("flex h-screen w-screen bg-ui-bg1 text-ui-text1 font-sans overflow-hidden", isDarkMode && "dark")}>
      <LeftPanel 
        onAddRow={addRow}
        onAddCol={addCol}
        onDelRow={deleteRow}
        onDelCol={deleteCol}
        onMerge={mergeCells}
        onUnmerge={unmergeCells}
        onFileUpload={handleFileUpload}
        onImportCSV={importCSV}
        onReset={resetTable}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      
      <Canvas 
        data={data}
        merges={merges}
        cellStyles={cellStyles}
        rowStyles={rowStyles}
        colStyles={colStyles}
        globalStyle={globalStyle}
        selectedCells={selectedCells}
        selectedRC={selectedRC}
        selectionMode={selectionMode}
        onCellClick={handleCellClick}
        onRCClick={handleRCClick}
        onUpdateData={updateData}
        tableRef={tableRef}
      />

      <RightPanel 
        globalStyle={globalStyle}
        setGlobalStyle={updateGlobalStyle}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedCells={selectedCells}
        selectedRC={selectedRC}
        updateSelectionStyle={updateSelectionStyle}
        clearSelectionStyle={clearSelectionStyle}
        onSelectParentRow={handleSelectParentRow}
        onSelectParentCol={handleSelectParentCol}
      />
    </div>
  );
}
