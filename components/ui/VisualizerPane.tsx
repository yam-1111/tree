'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { TreeNode, ParseResult, exportToAscii } from '@/lib/parser';
import { cn } from '@/lib/utils';
import {
  FolderOpen,
  Folder,
  ChartPieSlice,
  FileCode,
  Info,
  Check,
  Copy,
  MagnifyingGlass,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const { tree, directives, docstring, totalDirectories, totalFiles, maxDepth, parseTimeMs } = parseResult;

  // Generate ASCII filetree
  const asciiTree = useMemo(() => {
    if (tree.length === 0) return '';
    return exportToAscii(tree);
  }, [tree]);

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

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="h-12 border-b border-border flex flex-row items-center justify-between px-4 bg-muted/40 select-none shrink-0">
        <h2 className="font-mono font-medium text-xs tracking-tight text-foreground flex items-center gap-2">
          <FolderOpen size={14} className="text-foreground/80 shrink-0" />
          PANE 2 // VISUALIZER
        </h2>
        
        {/* Copy Output Button */}
        {fullOutput && (
          <button
            onClick={handleCopyAscii}
            className={cn(
              "flex flex-row items-center gap-1 px-3 py-1 font-mono text-[11px] font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity rounded cursor-pointer",
              copiedAscii && "bg-muted text-foreground"
            )}
          >
            {copiedAscii ? (
              <>
                <Check size={11} />
                COPIED!
              </>
            ) : (
              <>
                <Copy size={11} />
                COPY OUTPUT
              </>
            )}
          </button>
        )}
      </div>

      {/* Visualizer Toolbar */}
      <div className="p-3 border-b border-border bg-background select-none shrink-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <MagnifyingGlass size={13} className="text-muted-foreground/60" />
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
            <Info size={36} className="text-muted-foreground/75 mb-3" />
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
            <Folder size={11} className="text-muted-foreground/80" />
            FOLDERS: <strong className="text-foreground font-medium">{totalDirectories}</strong>
          </span>
          <span className="flex items-center gap-1">
            <FileCode size={11} className="text-muted-foreground/80" />
            FILES: <strong className="text-foreground font-medium">{totalFiles}</strong>
          </span>
          <span className="flex items-center gap-1">
            <ChartPieSlice size={11} className="text-muted-foreground/80" />
            DEPTH: <strong className="text-foreground font-medium">{maxDepth}</strong>
          </span>
        </div>

        <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-border bg-background">
          PARSED: {mounted ? `${parseTimeMs}ms` : '...'}
        </span>
      </div>
    </div>
  );
}
