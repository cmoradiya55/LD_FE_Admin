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
      transition: isDragging ? 'none' : 'transform 150ms ease',
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
        className={(className ?? '') + ' cursor-zoom-in'}
        onClick={() => setIsOpen(true)}
        style={{ objectFit: "cover" }}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-6 -right-6 flex items-center justify-center h-6 w-6 rounded-full border shadow-lg bg-white/95 text-gray-900 hover:bg-white hover:text-black transition-colors"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="overflow-hidden rounded-lg bg-black/80 flex items-center justify-center max-w-[90vw] max-h-[80vh]"
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
                className="select-none"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  ...imageTransform,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium bg-white border-gray-300"
                onClick={() => adjustZoom(-zoomStep)}
                disabled={zoom <= minZoom}
                style={{ opacity: zoom <= minZoom ? 0.5 : 1 }}
              >
                <Minus className="w-4 h-4" /> Zoom out
              </button>
              <span className="text-xs text-gray-300 min-w-[60px] text-center">
                {(zoom * 100).toFixed(0)}%
              </span>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium bg-white border-gray-300"
                onClick={() => adjustZoom(zoomStep)}
                disabled={zoom >= maxZoom}
                style={{ opacity: zoom >= maxZoom ? 0.5 : 1 }}
              >
                <Plus className="w-4 h-4" /> Zoom in
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium bg-white border-gray-300"
                onClick={resetZoom}
                disabled={zoom === 1}
                style={{ opacity: zoom === 1 ? 0.5 : 1 }}
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


