'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TreeNode, ParseResult, exportToAscii } from '@/lib/parser';
import { cn } from '@/lib/utils';
import {
  FolderOpenIcon,
  FolderIcon,
  ChartPieSliceIcon,
  FileCodeIcon,
  InfoIcon,
  CheckIcon,
  CopyIcon,
  MagnifyingGlassIcon,
  Gear,
  Sliders,
} from '@phosphor-icons/react';

interface VisualizerPaneProps {
  parseResult: ParseResult;
  selectedNode: TreeNode | null;
  setSelectedNode: (node: TreeNode | null) => void;
  fontSize: number;
}

export function VisualizerPane({
  parseResult,
  selectedNode,
  setSelectedNode,
  fontSize,
}: VisualizerPaneProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Visualization settings states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullPath, setFullPath] = useState(false);
  const [trailingSlash, setTrailingSlash] = useState(true);
  const [useRoot, setUseRoot] = useState(true);
  const [fancy, setFancy] = useState(true);

  // Initialize theme/settings
  useEffect(() => {
    setMounted(true);

    const savedFullPath = localStorage.getItem('setting-full-path');
    if (savedFullPath !== null) setFullPath(savedFullPath === 'true');

    const savedTrailingSlash = localStorage.getItem('setting-trailing-slash');
    if (savedTrailingSlash !== null) setTrailingSlash(savedTrailingSlash === 'true');

    const savedUseRoot = localStorage.getItem('setting-use-root');
    if (savedUseRoot !== null) setUseRoot(savedUseRoot === 'true');

    const savedFancy = localStorage.getItem('setting-fancy');
    if (savedFancy !== null) setFancy(savedFancy === 'true');
  }, []);

  const handleSettingChange = (key: 'fullPath' | 'trailingSlash' | 'useRoot' | 'fancy', value: boolean) => {
    if (key === 'fullPath') {
      setFullPath(value);
      localStorage.setItem('setting-full-path', String(value));
    } else if (key === 'trailingSlash') {
      setTrailingSlash(value);
      localStorage.setItem('setting-trailing-slash', String(value));
    } else if (key === 'useRoot') {
      setUseRoot(value);
      localStorage.setItem('setting-use-root', String(value));
    } else if (key === 'fancy') {
      setFancy(value);
      localStorage.setItem('setting-fancy', String(value));
    }
  };

  const { tree, directives, docstring, totalDirectories, totalFiles, maxDepth, parseTimeMs } = parseResult;

  // Generate ASCII filetree
  const asciiTree = useMemo(() => {
    if (tree.length === 0) return '';
    return exportToAscii(tree, '', '', {
      fullPath,
      trailingSlash,
      useRoot,
      fancy,
    });
  }, [tree, fullPath, trailingSlash, useRoot, fancy]);

  // Combined output for visual display: clean docstring text (without outer quotes) + ASCII tree
  const visualOutput = useMemo(() => {
    if (!asciiTree) return '';
    if (docstring) {
      return `${docstring}\n\n${asciiTree}`;
    }
    return asciiTree;
  }, [docstring, asciiTree]);

  // Combined output for clipboard: full quote-enclosed directives block + ASCII tree
  const fullOutput = useMemo(() => {
    if (!asciiTree) return '';
    if (directives) {
      return `${directives}\n\n${asciiTree}`;
    }
    return asciiTree;
  }, [directives, asciiTree]);

  // Copy full output (directives + ASCII tree) to clipboard
  const handleCopyAscii = async () => {
    if (!fullOutput) return;
    try {
      await navigator.clipboard.writeText(fullOutput);
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    } catch (err) {
      console.error('Failed to copy output:', err);
    }
  };

  // Helper to highlight search query inside the rendered visual output
  const renderHighlightedOutput = () => {
    if (!visualOutput) return null;
    if (!searchQuery.trim()) {
      return <span>{visualOutput}</span>;
    }

    const parts = visualOutput.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={index}
              className="bg-yellow-200 dark:bg-yellow-800/40 text-foreground font-bold px-[2px] rounded-sm select-all"
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Adjust stats visually based on root folder setting
  const displayDirectories = totalDirectories + (useRoot ? 1 : 0);
  const displayDepth = maxDepth + (useRoot ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="h-12 border-b border-border flex flex-row items-center justify-between px-4 bg-muted/40 select-none shrink-0">
        <h2 className="font-mono font-medium text-xs tracking-tight text-foreground flex items-center gap-2">
          <FolderOpenIcon size={14} className="text-foreground/80 shrink-0" />
          VISUALIZER
        </h2>

        {/* Header Controls */}
        <div className="flex flex-row items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center p-1.5 border border-border bg-background hover:bg-muted text-foreground cursor-pointer transition-colors rounded outline-none select-none"
            title="Visualization Options"
          >
            <Gear size={13} />
          </button>

          {/* Copy Output Button */}
          {fullOutput && (
            <button
              onClick={handleCopyAscii}
              className={cn(
                "flex flex-row items-center gap-1 px-3 py-1.5 font-mono text-[11px] font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity rounded cursor-pointer",
                copiedAscii && "bg-muted text-foreground"
              )}
            >
              {copiedAscii ? (
                <>
                  <CheckIcon size={11} />
                  COPIED!
                </>
              ) : (
                <>
                  <CopyIcon size={11} />
                  COPY OUTPUT
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Visualizer Toolbar */}
      <div className="p-3 border-b border-border bg-background select-none shrink-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon size={13} className="text-muted-foreground/60" />
          </span>
          <input
            type="text"
            placeholder="Filter ASCII output..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-8 pr-4 py-1.5 font-mono text-[11px] border border-border bg-background text-foreground",
              "focus:ring-1 focus:ring-ring outline-none select-text rounded placeholder:text-muted-foreground/50"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-muted-foreground hover:text-foreground font-mono"
            >
              [CLEAR]
            </button>
          )}
        </div>
      </div>

      {/* ASCII Output Rendering (Renders visual output with clean docstrings) */}
      <div className="flex-1 overflow-auto p-4 bg-background border-b border-border select-text">
        {!visualOutput ? (
          /* Clean Minimal Empty State */
          <div className="border border-border rounded p-6 bg-muted/10 flex flex-col items-center justify-center text-center h-full select-none">
            <InfoIcon size={36} className="text-muted-foreground/75 mb-3" />
            <h3 className="font-mono font-bold text-xs mb-1">NO VISUALIZATION AVAILABLE</h3>
            <p className="font-mono text-[10px] max-w-xs leading-relaxed text-muted-foreground">
              Define a tree structure in the Editor pane on the left to review the ASCII tree layout.
            </p>
          </div>
        ) : (
          /* Render Raw clean ASCII (with docstring but without triple quotes) with JetBrains Mono spacing */
          <pre
            className="font-mono select-all whitespace-pre text-foreground/90 font-normal"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${Math.round(fontSize * 1.5)}px`
            }}
          >
            {renderHighlightedOutput()}
          </pre>
        )}
      </div>

      {/* Clean Bottom Stats Bar */}
      <div className="bg-muted/30 select-none flex flex-row font-mono shrink-0 p-2.5 border-t-0 text-[10px] justify-between items-center text-muted-foreground">
        <div className="flex flex-row gap-4">
          <span className="flex items-center gap-1">
            <FolderIcon size={11} className="text-muted-foreground/80" />
            FOLDERS: <strong className="text-foreground font-medium">{displayDirectories}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FileCodeIcon size={11} className="text-muted-foreground/80" />
            FILES: <strong className="text-foreground font-medium">{totalFiles}</strong>
          </span>
          <span className="flex items-center gap-1">
            <ChartPieSliceIcon size={11} className="text-muted-foreground/80" />
            DEPTH: <strong className="text-foreground font-medium">{displayDepth}</strong>
          </span>
        </div>

        <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-border bg-background">
          PARSED: {mounted ? `${parseTimeMs}ms` : '...'}
        </span>
      </div>

      {/* Premium Brutalist Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150 animate-out duration-100"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-[380px] bg-background border-2 border-foreground dark:border-border p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-mono font-bold text-xs uppercase tracking-tight text-foreground flex items-center gap-1.5">
                <Sliders size={14} className="text-foreground shrink-0" />
                VISUALIZATION SETTINGS
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="font-mono text-[10px] border border-border px-1.5 py-0.5 hover:bg-muted cursor-pointer rounded select-none hover:border-foreground transition-colors"
              >
                CLOSE
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-3">
              {/* Toggle 1: Root */}
              <label className="flex items-center justify-between py-2 border-b border-border/40 cursor-pointer select-none group">
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                    VIRTUAL ROOT (.)
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground leading-normal max-w-[260px]">
                    Prepend a virtual '.' directory at the top level of the tree.
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={useRoot}
                    onChange={(e) => handleSettingChange('useRoot', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-muted border border-border transition-colors peer-checked:bg-foreground dark:peer-checked:bg-foreground peer-checked:border-foreground dark:peer-checked:border-foreground flex items-center relative">
                    <div className="w-3.5 h-3.5 bg-background border border-border absolute left-0.5 transition-transform peer-checked:translate-x-3.5 peer-checked:bg-background peer-checked:border-background" />
                  </div>
                </div>
              </label>

              {/* Toggle 2: Full Path */}
              <label className="flex items-center justify-between py-2 border-b border-border/40 cursor-pointer select-none group">
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                    FULL PATH
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground leading-normal max-w-[260px]">
                    Prepend all parent directory paths to each child folder and file name.
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={fullPath}
                    onChange={(e) => handleSettingChange('fullPath', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-muted border border-border transition-colors peer-checked:bg-foreground dark:peer-checked:bg-foreground peer-checked:border-foreground dark:peer-checked:border-foreground flex items-center relative">
                    <div className="w-3.5 h-3.5 bg-background border border-border absolute left-0.5 transition-transform peer-checked:translate-x-3.5 peer-checked:bg-background peer-checked:border-background" />
                  </div>
                </div>
              </label>

              {/* Toggle 3: Trailing Slash */}
              <label className="flex items-center justify-between py-2 border-b border-border/40 cursor-pointer select-none group">
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                    TRAILING SLASH (/)
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground leading-normal max-w-[260px]">
                    Append a slash symbol at the end of each directory folder name.
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={trailingSlash}
                    onChange={(e) => handleSettingChange('trailingSlash', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-muted border border-border transition-colors peer-checked:bg-foreground dark:peer-checked:bg-foreground peer-checked:border-foreground dark:peer-checked:border-foreground flex items-center relative">
                    <div className="w-3.5 h-3.5 bg-background border border-border absolute left-0.5 transition-transform peer-checked:translate-x-3.5 peer-checked:bg-background peer-checked:border-background" />
                  </div>
                </div>
              </label>

              {/* Toggle 4: Fancy Connectors */}
              <label className="flex items-center justify-between py-2 border-b border-border/40 cursor-pointer select-none group">
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                    FANCY CONNECTORS
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground leading-normal max-w-[260px]">
                    Use premium unicode branch characters (└──, ├──) instead of basic ASCII (---, |---).
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={fancy}
                    onChange={(e) => handleSettingChange('fancy', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-muted border border-border transition-colors peer-checked:bg-foreground dark:peer-checked:bg-foreground peer-checked:border-foreground dark:peer-checked:border-foreground flex items-center relative">
                    <div className="w-3.5 h-3.5 bg-background border border-border absolute left-0.5 transition-transform peer-checked:translate-x-3.5 peer-checked:bg-background peer-checked:border-background" />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
