'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number; // percentage, e.g. 50
  minWidth?: number; // minimum width/height in pixels for either side
}

export function SplitPane({
  left,
  right,
  defaultSplit = 50,
  minWidth = 200, // Slightly smaller minimum to fit mobile screens perfectly
}: SplitPaneProps) {
  const [splitPercent, setSplitPercent] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport (width < 768px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const resize = (e: PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let newPercent = 50;

    if (isMobile) {
      // Portrait Mode: Adjust height
      const clientY = e.clientY;
      const offsetTop = clientY - containerRect.top;
      newPercent = (offsetTop / containerRect.height) * 100;
      
      const minPercent = (minWidth / containerRect.height) * 100;
      const maxPercent = ((containerRect.height - minWidth) / containerRect.height) * 100;
      newPercent = Math.max(minPercent, Math.min(maxPercent, newPercent));
    } else {
      // Landscape Mode: Adjust width
      const clientX = e.clientX;
      const offsetLeft = clientX - containerRect.left;
      newPercent = (offsetLeft / containerRect.width) * 100;
      
      const minPercent = (minWidth / containerRect.width) * 100;
      const maxPercent = ((containerRect.width - minWidth) / containerRect.width) * 100;
      newPercent = Math.max(minPercent, Math.min(maxPercent, newPercent));
    }
    
    setSplitPercent(newPercent);
  };

  const stopResize = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (isDragging) {
      const handlePointerMove = (e: PointerEvent) => {
        resize(e);
      };
      
      window.addEventListener('pointermove', handlePointerMove);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full h-full overflow-hidden select-none bg-background",
        isMobile ? "flex-col" : "flex-row",
        isDragging && "select-none"
      )}
    >
      {/* Left/Top Pane (Editor) */}
      <div
        style={isMobile ? { height: `${splitPercent}%`, width: '100%' } : { width: `${splitPercent}%`, height: '100%' }}
        className="flex flex-col overflow-hidden relative select-text"
      >
        {left}
      </div>

      {/* Flat stark responsive resizer bar */}
      <div
        role="separator"
        aria-valuenow={splitPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={startResize}
        onPointerUp={stopResize}
        className={cn(
          "bg-border transition-colors relative z-20 select-none",
          isMobile 
            ? "h-[3px] w-full cursor-row-resize hover:bg-foreground/40" 
            : "w-[3px] h-full cursor-col-resize hover:bg-foreground/40",
          isDragging && "bg-foreground/50"
        )}
      />

      {/* Right/Bottom Pane (Visualizer) */}
      <div
        className="flex-1 h-full flex flex-col overflow-hidden relative select-text"
      >
        {right}
      </div>
    </div>
  );
}
