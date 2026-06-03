'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SplitPane } from '@/components/ui/SplitPane';
import { EditorPane } from '@/components/ui/EditorPane';
import { VisualizerPane } from '@/components/ui/VisualizerPane';
import { parseTree, TreeNode } from '@/lib/parser';
import { cn } from '@/lib/utils';
import { Sun, Moon, Tree, Gear, GithubLogo, TreeViewIcon } from '@phosphor-icons/react';
import { Template } from '@/lib/templates';
import { FetchPane } from '@/components/ui/FetchPane';

const DEFAULT_CODE = `"""
Welcome to Tree/ // An interactive folder visualizer

This application processes a custom Pythonic indentation-based syntax 
and renders an elegant visual tree structure.

Instructions:
1. Nesting: Indent with exactly 4 spaces or 1 tab to assign child levels.
2. Node Typing: Suffix directories with a colon (:).
3. Literal Escaping: Wrap names in single quotes, double quotes, or backticks
   to preserve colons inside filenames.
4. Directives: Enclose prompt blocks in triple quotes '"""' to discard them.
"""

tree-visualizer:
    public:
        favicon.ico
        logo.png
    src:
        'index:app.tsx'
        'globals;v3.css'
        lib:
            parser.ts
            templates.ts
        components:
            ui:
                SplitPane.tsx
                EditorPane.tsx
                VisualizerPane.tsx
    package.json
    tsconfig.json
    README.md
`;

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [templates, setTemplates] = useState<Record<string, Template>>({});
  const [fontSize, setFontSize] = useState(12);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Initialize theme and fetch dynamic templates
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const savedFontSize = localStorage.getItem('editor-font-size');
    if (savedFontSize) {
      const parsed = parseInt(savedFontSize, 10);
      if (!isNaN(parsed) && parsed >= 10 && parsed <= 24) {
        setFontSize(parsed);
      }
    }

    // Dynamic templates fetch
    fetch('/api/templates')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch dynamic templates');
      })
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setTemplates(data);
        }
      })
      .catch((err) => console.warn('Using static templates fallback:', err));
  }, []);

  // Close settings dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('editor-font-size', String(newSize));
  };

  // Toggle theme mode
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return nextMode;
    });
  };

  // Run the parsing engine when code changes
  const parseResult = useMemo(() => {
    return parseTree(code);
  }, [code]);

  // Inject a boilerplate template
  const handleInjectTemplate = (value: string) => {
    setCode(value);
    setSelectedNode(null);
  };

  // Reset to initial visualizer documentation code
  const handleResetToDefault = () => {
    setCode(DEFAULT_CODE);
    setSelectedNode(null);
  };

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-150">
      {/* Flat Classic Shadcn Header Banner */}
      <header className="h-14 flex flex-row items-center justify-between px-6 border-b border-border bg-background select-none shrink-0 relative z-30">
        {/* App Title */}
        <div className="flex items-center gap-2">
          <TreeViewIcon size={16} className="text-foreground shrink-0" />
          <h1 className="font-mono font-bold text-sm tracking-wider select-none">
            tree
            <span className="text-muted-foreground">/</span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-row items-center gap-2">
          {/* GitHub Icon */}
          <a
            href="https://github.com/yam-1111/tree"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 border border-border bg-background hover:bg-muted text-foreground cursor-pointer transition-colors rounded outline-none select-none"
            title="GitHub Repository"
          >
            <GithubLogo size={14} />
          </a>

          {/* Flat Theme Toggle Control */}
          <button
            onClick={handleToggleTheme}
            className="flex items-center justify-center p-2 border border-border bg-background hover:bg-muted text-foreground cursor-pointer transition-colors rounded outline-none select-none"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun size={14} />
            ) : (
              <Moon size={14} />
            )}
          </button>

          {/* Settings / Font Size Control */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "flex items-center justify-center p-2 border border-border bg-background hover:bg-muted text-foreground cursor-pointer transition-colors rounded outline-none select-none",
                settingsOpen && "bg-muted"
              )}
              title="Font Size Settings"
            >
              <Gear size={14} className={cn("transition-transform duration-300", settingsOpen && "rotate-45")} />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-[180px] bg-background border border-border rounded shadow-md z-50 p-3 select-none">
                <div className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
                  Font Settings
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-bold text-foreground">{fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <button
                      onClick={() => handleFontSizeChange(Math.max(10, fontSize - 1))}
                      disabled={fontSize <= 10}
                      className="flex-1 py-1 text-center font-mono font-bold text-xs border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:hover:bg-background rounded cursor-pointer select-none transition-colors"
                      title="Decrease font size"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => handleFontSizeChange(12)}
                      className="py-1 px-2.5 text-center font-mono font-bold text-[10px] border border-border bg-background hover:bg-muted rounded cursor-pointer select-none transition-colors"
                      title="Reset font size"
                    >
                      RESET
                    </button>
                    <button
                      onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}
                      disabled={fontSize >= 24}
                      className="flex-1 py-1 text-center font-mono font-bold text-xs border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:hover:bg-background rounded cursor-pointer select-none transition-colors"
                      title="Increase font size"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Brutalist Redwood Tree Fetcher */}
      <FetchPane onFetchComplete={(newCode) => {
        setCode(newCode);
        setSelectedNode(null);
      }} />

      {/* Flat Desktop Resizable Editor/Visualizer Pane Wrapper */}
      <section className="flex-1 w-full overflow-hidden min-h-0 relative z-10">
        <SplitPane
          left={
            <EditorPane
              value={code}
              onChange={setCode}
              onInjectTemplate={handleInjectTemplate}
              onResetToDefault={handleResetToDefault}
              isDarkMode={isDarkMode}
              templates={templates}
              fontSize={fontSize}
            />
          }
          right={
            <VisualizerPane
              parseResult={parseResult}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              fontSize={fontSize}
            />
          }
          defaultSplit={50}
          minWidth={280}
        />
      </section>

      <footer className="h-9 border-t border-border flex items-center justify-center px-6 bg-background select-none shrink-0 text-[10px] font-mono text-muted-foreground relative z-30">
        <div className="flex items-center gap-3">
          <span>created by</span>
          <a
            href="https://github.com/yam-1111"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-bold hover:underline"
          >
            yam-1111
          </a>
          <span>with ❤️</span>
        </div>
      </footer>
    </main>
  );
}
