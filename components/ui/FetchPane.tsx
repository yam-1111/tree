'use client';

import React, { useState } from 'react';
import { fetchRepoTree } from '@/lib/fetcher';
import { transformPathsToTreeText } from '@/lib/transform';
import { cn } from '@/lib/utils';
import { CloudArrowDown, Warning, CaretDown } from '@phosphor-icons/react';

interface FetchPaneProps {
  onFetchComplete: (code: string) => void;
}

export function FetchPane({ onFetchComplete }: FetchPaneProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const entries = await fetchRepoTree(repoUrl, branch);
      if (entries.length === 0) {
        throw new Error('No files or directories found in the specified repository branch.');
      }

      const treeText = transformPathsToTreeText(entries);
      onFetchComplete(treeText);
      setIsCollapsed(true); // Automatically collapse on successful fetch
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while fetching the repository.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background border-b border-border select-none shrink-0 relative z-20 transition-colors duration-150">
      {/* Header Title (Toggles Collapse State on Click) */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-10 flex flex-row items-center justify-between px-6 bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CloudArrowDown size={14} className="text-foreground/80 shrink-0" />
          <h3 className="font-mono font-medium text-xs tracking-tight text-foreground uppercase">
            FETCH REMOTE REPOSITORY
          </h3>
          <span className="font-mono text-[9px] text-muted-foreground uppercase hidden sm:inline">
            — Pull public file trees dynamically
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] text-muted-foreground uppercase">
            {isCollapsed ? 'EXPAND' : 'COLLAPSE'}
          </span>
          <CaretDown
            size={12}
            className={cn("text-muted-foreground transition-transform duration-150", !isCollapsed && "rotate-180")}
          />
        </div>
      </div>

      {/* Inputs Form Container (Visible only when Expanded) */}
      {!isCollapsed && (
        <form onSubmit={handleFetch} className="p-5 flex flex-col gap-4 border-t border-border bg-background animate-in slide-in-from-top-1 duration-150">
          {/* Inputs Layout */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* URL Input */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="repo-url" className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                REPOSITORY URL (i.e Github, Gitlab, Codeberg or Gitea )
              </label>
              <input
                id="repo-url"
                type="url"
                required
                disabled={loading}
                placeholder="e.g. https://github.com/torvalds/linux"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className={cn(
                  "w-full border border-border p-2 font-mono text-xs bg-background text-foreground outline-none",
                  "focus:ring-1 focus:ring-ring focus:border-border rounded transition-all font-mono",
                  "placeholder:text-muted-foreground/45"
                )}
              />
            </div>

            {/* Branch Input */}
            <div className="w-full md:w-[180px] flex flex-col gap-1.5">
              <label htmlFor="repo-branch" className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                BRANCH NAME
              </label>
              <input
                id="repo-branch"
                type="text"
                required
                disabled={loading}
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={cn(
                  "w-full border border-border p-2 font-mono text-xs bg-background text-foreground outline-none",
                  "focus:ring-1 focus:ring-ring focus:border-border rounded transition-all font-mono",
                  "placeholder:text-muted-foreground/45"
                )}
              />
            </div>

            {/* Trigger Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={loading || !repoUrl.trim()}
                className={cn(
                  "w-full md:w-auto h-[34px] px-5 border border-border font-mono font-bold text-xs uppercase transition-colors select-none rounded",
                  "bg-background text-foreground hover:bg-muted cursor-pointer outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? 'Fetching Tree...' : 'FETCH TREE'}
              </button>
            </div>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="flex items-start gap-2 border border-destructive/20 bg-destructive/10 text-destructive font-mono text-[10px] p-3 rounded select-text animate-in slide-in-from-top-1 duration-150">
              <Warning size={14} className="shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="font-bold">FETCH FAILED:</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-[9px] underline font-bold cursor-pointer uppercase select-none hover:opacity-85"
              >
                Dismiss
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
