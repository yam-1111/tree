'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import {
  CodeIcon,
  FolderOpenIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
  QuestionIcon,
  CaretDownIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';

interface EditorPaneProps {
  value: string;
  onChange: (val: string) => void;
  onInjectTemplate: (templateValue: string) => void;
  onResetToDefault: () => void;
  isDarkMode: boolean;
  templates: Record<string, { name: string; description: string; value: string }>;
  fontSize: number;
}

export function EditorPane({
  value,
  onChange,
  onInjectTemplate,
  onResetToDefault,
  isDarkMode,
  templates,
  fontSize,
}: EditorPaneProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [copiedCodeIcon, setCopiedCodeIcon] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const characterCount = value.length;
  const lineCount = value.split('\n').length;

  const handleCopyIconCodeIcon = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCodeIcon(true);
      setTimeout(() => setCopiedCodeIcon(false), 2000);
    } catch (err) {
      console.error('Failed to CopyIcon source:', err);
    }
  };

  // Configure custom grammar syntax tokenizer & themes inside Monaco
  const handleEditorWillMount = (monaco: Monaco) => {
    // 1. Register a custom language for Tree syntax
    monaco.languages.register({ id: 'tree-syntax' });

    monaco.languages.setMonarchTokensProvider('tree-syntax', {
      tokenizer: {
        root: [
          // Match triple-quote directive comments block
          [/"""[\s\S]*?"""/, 'comment'],

          // Match escaped strings
          [/'[^']*'|"[^"]*"|`[^`]*`/, 'string'],

          // Match directories (words ending with colons)
          [/[a-zA-Z0-9_\-\.\/]+:/, 'keyword'],
        ],
      },
    });

    // 2. Define Zinc Dark Theme matching classic Shadcn
    monaco.editor.defineTheme('zinc-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'fafafa' },
        { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
        { token: 'string', foreground: '22c55e' },
        { token: 'keyword', foreground: 'f43f5e', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#09090b', // Zinc-950
        'editor.foreground': '#fafafa', // Zinc-50
        'editor.lineHighlightBackground': '#18181b', // Zinc-900
        'editorCursor.foreground': '#fafafa',
        'editorLineNumber.foreground': '#3f3f46', // Zinc-700
        'editorLineNumber.activeForeground': '#a1a1aa', // Zinc-400
        'editor.border': '#27272a',
      },
    });

    // 3. Define Zinc Light Theme matching classic Shadcn
    monaco.editor.defineTheme('zinc-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: '09090b' },
        { token: 'comment', foreground: 'a1a1aa', fontStyle: 'italic' },
        { token: 'string', foreground: '16a34a' },
        { token: 'keyword', foreground: 'e11d48', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#09090b',
        'editor.lineHighlightBackground': '#f4f4f5', // Zinc-100
        'editorCursor.foreground': '#09090b',
        'editorLineNumber.foreground': '#a1a1aa', // Zinc-400
        'editorLineNumber.activeForeground': '#71717a', // Zinc-600
        'editor.border': '#e4e4e7',
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Editor Header Banner */}
      <div className="h-12 border-b border-border flex flex-row items-center justify-between px-4 bg-muted/40 select-none shrink-0">
        <h2 className="font-mono font-medium text-xs tracking-tight text-foreground flex items-center gap-2">
          <CodeIcon size={14} className="text-foreground/80 shrink-0" />
          EDITOR
        </h2>

        {/* Stats details */}
        <div className="text-[10px] font-mono text-muted-foreground flex gap-3 tracking-wider">
          <span>LINES: <strong className="text-foreground font-normal">{lineCount}</strong></span>
          <span>CHARS: <strong className="text-foreground font-normal">{characterCount}</strong></span>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="flex flex-row flex-wrap items-center justify-between gap-3 p-3 border-b border-border bg-background select-none shrink-0 z-20">
        {/* Templates Selector Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              "flex flex-row items-center justify-between gap-2 px-3 py-1.5 font-mono text-[11px] border border-border bg-background hover:bg-muted text-foreground w-[160px] transition-colors rounded cursor-pointer"
            )}
          >
            <span className="truncate flex items-center gap-1.5 font-medium">
              <FolderOpenIcon size={13} />
              TEMPLATES
            </span>
            <CaretDownIcon
              size={10}
              className={cn("transition-transform duration-100", dropdownOpen && "rotate-180")}
            />
          </button>

          {/* Clean Flat Dropdown Body */}
          {dropdownOpen && (
            <div
              className={cn(
                "absolute left-0 mt-1.5 w-[260px] bg-background border border-border rounded shadow-md z-50",
                "max-h-[300px] overflow-y-auto"
              )}
            >
              <div className="p-2 border-b border-border text-[9px] font-bold text-muted-foreground bg-muted/30 tracking-wider">
                CHOOSE BOILERPLATE
              </div>
              <div className="flex flex-col">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onInjectTemplate(template.value);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left font-mono p-2.5 hover:bg-muted border-b border-border/40 last:border-b-0",
                      "transition-colors cursor-pointer flex flex-col items-start gap-0.5"
                    )}
                  >
                    <span className="font-bold text-[10px] uppercase tracking-wide text-foreground">
                      {template.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground leading-normal line-clamp-1">
                      {template.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toolbar Utilities */}
        <div className="flex flex-row items-center gap-1.5">
          {/* Reset button */}
          <button
            onClick={onResetToDefault}
            className="p-1.5 font-mono text-xs border border-border bg-background hover:bg-muted text-foreground transition-colors rounded cursor-pointer"
            title="Reset to default CodeIcon"
          >
            <ArrowCounterClockwiseIcon size={13} />
          </button>

          {/* CopyIcon button */}
          <button
            onClick={handleCopyIconCodeIcon}
            className={cn(
              "p-1.5 font-mono text-xs border border-border bg-background hover:bg-muted text-foreground transition-colors rounded cursor-pointer",
              copiedCodeIcon && "bg-muted font-bold"
            )}
            title="CopyIcon editor content"
          >
            {copiedCodeIcon ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          </button>

          {/* TrashIcon/Clear button */}
          <button
            onClick={() => onChange('')}
            className="p-1.5 font-mono text-xs border border-border bg-background hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors rounded cursor-pointer"
            title="Clear editor content"
          >
            <TrashIcon size={13} />
          </button>

          {/* Info Cheatsheet button */}
          <button
            onClick={() => setShowCheatsheet(true)}
            className="flex flex-row items-center gap-1 px-2.5 py-1.5 font-mono text-[11px] font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity rounded cursor-pointer"
            title="Show syntax guide"
          >
            <QuestionIcon size={13} />
            <span>GUIDE</span>
          </button>
        </div>
      </div>

      {/* Monaco CodeIcon Editor Area */}
      <div className="flex-1 overflow-hidden bg-background relative select-text">
        <Editor
          height="100%"
          language="tree-syntax"
          theme={isDarkMode ? 'zinc-dark' : 'zinc-light'}
          value={value}
          onChange={(val) => onChange(val || '')}
          beforeMount={handleEditorWillMount}
          loading={
            <div className="font-mono text-xs text-muted-foreground p-4 animate-pulse">
              Loading Monaco Editor...
            </div>
          }
          options={{
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            fontSize: fontSize,
            lineHeight: Math.round(fontSize * 1.5),
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'none',
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            glyphMargin: false,
            folding: false,
            lineNumbersMinChars: 3,
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: false,
          }}
        />
      </div>

      {/* Syntax Cheat Sheet Slideout */}
      {showCheatsheet && (
        <div className="absolute inset-0 bg-black/15 dark:bg-black/40 z-50 flex justify-end select-none animate-in fade-in duration-700">
          <div className="w-[320px] h-full bg-background border-l border-border flex flex-col shadow-lg p-5 overflow-y-auto animate-in slide-in-from-right duration-150">
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-border pb-3 mb-3 select-none">
              <h3 className="font-mono font-bold text-xs uppercase tracking-tight text-foreground">
                SYNTAX SPECIFICATIONS
              </h3>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="font-mono text-[10px] border border-border px-1.5 py-0.5 hover:bg-muted cursor-pointer rounded select-none"
              >
                CLOSE
              </button>
            </div>

            {/* Instruction Details */}
            <div className="font-mono text-[11px] space-y-4 text-foreground/90 select-text leading-relaxed">
              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-0.5 mb-1 text-[10px]">
                  1. DIRECTIVES
                </h4>
                <p>
                  Enclose comments inside triple quotes (<CodeIcon className="border border-border px-0.5 bg-muted rounded">"""</CodeIcon>).
                  These are ignored in tree creation.
                </p>
                <pre className="border border-border bg-muted/40 p-1.5 mt-1 select-all overflow-x-auto text-[9px] rounded">
                  {`"""
Next.js Workspace
"""`}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-0.5 mb-1 text-[10px]">
                  2. NESTING HIERARCHY
                </h4>
                <p>
                  Exactly 4 spaces or 1 tab equals one folder level.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-0.5 mb-1 text-[10px]">
                  3. DIRECTORIES
                </h4>
                <p>
                  Suffix folders with a colon (<CodeIcon className="border border-border px-0.5 bg-muted rounded">:</CodeIcon>).
                </p>
                <pre className="border border-border bg-muted/40 p-1.5 mt-1 select-all overflow-x-auto text-[9px] rounded">
                  {`public:      <-- folder
    logo.png <-- file`}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-0.5 mb-1 text-[10px]">
                  4. LITERAL ESCAPING
                </h4>
                <p>
                  Wrap names in <CodeIcon className="border border-border px-0.5 bg-muted rounded">'</CodeIcon> or <CodeIcon className="border border-border px-0.5 bg-muted rounded">"</CodeIcon> or <CodeIcon className="border border-border px-0.5 bg-muted rounded">`</CodeIcon> to preserve internal colons. Quotes are stripped.
                </p>
                <pre className="border border-border bg-muted/40 p-1.5 mt-1 select-all overflow-x-auto text-[9px] rounded">
                  {`'auth:api.js' <-- file`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
