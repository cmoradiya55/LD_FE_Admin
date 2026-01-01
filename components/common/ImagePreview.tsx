"use client";

import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ImagePreviewProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.25;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const clampZoom = useCallback((value: number) => {
    return Math.min(maxZoom, Math.max(minZoom, Number(value.toFixed(2))));
  }, []);

  const adjustZoom = useCallback((delta: number) => {
    setZoom((prev) => {
      const next = clampZoom(prev + delta);
      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }, [clampZoom]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const direction = event.deltaY < 0 ? zoomStep : -zoomStep;
      adjustZoom(direction);
    },
    [adjustZoom]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (zoom === 1) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        offsetX: offset.x,
        offsetY: offset.y,
      };
    },
    [zoom, offset]
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    setOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy,
    });
  }, [isDragging]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const imageTransform = useMemo(() => {
    return {
      transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
      cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }, [zoom, offset, isDragging]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={(className ?? '') + ' cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]'}
        onClick={() => setIsOpen(true)}
        style={{ objectFit: "cover" }}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          {/* Close Button - Top Right */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-gray-900/90 backdrop-blur-md text-white hover:bg-gray-800 transition-all duration-200 hover:scale-110 border border-gray-700/50 shadow-lg"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="select-none max-w-full max-h-full object-contain"
              style={imageTransform}
            />
          </div>

          {/* Floating Controls - Bottom Center */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-gray-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => adjustZoom(-zoomStep)}
              disabled={zoom <= minZoom}
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 px-3">
              <span className="text-sm font-medium text-white min-w-[50px] text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
            </div>
            
            <button
              type="button"
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => adjustZoom(zoomStep)}
              disabled={zoom >= maxZoom}
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-600/50 mx-1" />
            
            <button
              type="button"
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={resetZoom}
              disabled={zoom === 1}
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}


