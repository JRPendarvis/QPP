/**
 * BorderPreview Component
 * Visual representation of borders around quilt preview
 */
'use client';

import React from 'react';
import { Border } from '@/types/Border';

interface BorderPreviewProps {
  borders: Border[];
  fabricColors: string[];  // Hex colors for each fabric
  quiltTopWidth: number;
  quiltTopHeight: number;
}

export default function BorderPreview({ 
  borders, 
  fabricColors,
  quiltTopWidth,
  quiltTopHeight
}: BorderPreviewProps) {
  if (!borders.length) {
    return null;
  }

  // Sort borders by order (innermost to outermost)
  const sortedBorders = [...borders].sort((a, b) => a.order - b.order);
  
  // Calculate scale factor to fit preview (max 400px)
  const maxDimension = Math.max(quiltTopWidth, quiltTopHeight);
  const totalBorderWidth = borders.reduce((sum, b) => sum + b.width, 0);
  const maxDimensionWithBorders = maxDimension + (2 * totalBorderWidth);
  const scale = Math.min(400 / maxDimensionWithBorders, 1);
  
  // Scaled dimensions
  const scaledQuiltWidth = quiltTopWidth * scale;
  const scaledQuiltHeight = quiltTopHeight * scale;
  
  // Calculate nested border dimensions
  let currentWidth = scaledQuiltWidth;
  let currentHeight = scaledQuiltHeight;
  
  const borderLayers = sortedBorders.map((border) => {
    const scaledBorderWidth = border.width * scale;
    const color = fabricColors[border.fabricIndex] || '#cccccc';
    
    const layer = {
      width: currentWidth + (2 * scaledBorderWidth),
      height: currentHeight + (2 * scaledBorderWidth),
      borderWidth: scaledBorderWidth,
      color,
      order: border.order
    };
    
    currentWidth = layer.width;
    currentHeight = layer.height;
    
    return layer;
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🎨</span>
        Border Preview
      </h4>
      
      <div className="flex justify-center">
        <div className="relative" style={{ 
          width: `${currentWidth}px`, 
          height: `${currentHeight}px` 
        }}>
          {/* Render borders from outermost to innermost */}
          {[...borderLayers].reverse().map((layer, index) => {
            const offset = borderLayers
              .slice(borderLayers.length - index)
              .reduce((sum, l) => sum + l.borderWidth, 0);
            
            return (
              <div
                key={layer.order}
                className="absolute border-2 border-gray-300"
                style={{
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  backgroundColor: layer.color,
                  top: `${offset}px`,
                  left: `${offset}px`,
                  opacity: 0.8
                }}
                title={`Border ${layer.order}`}
              />
            );
          })}
          
          {/* Quilt top (innermost) */}
          <div
            className="absolute bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-400"
            style={{
              width: `${scaledQuiltWidth}px`,
              height: `${scaledQuiltHeight}px`,
              top: `${borderLayers.reduce((sum, l) => sum + l.borderWidth, 0)}px`,
              left: `${borderLayers.reduce((sum, l) => sum + l.borderWidth, 0)}px`
            }}
          >
            <div className="flex items-center justify-center h-full text-gray-500 text-sm font-medium">
              Quilt Top
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2 font-semibold">Border Order:</p>
        <div className="space-y-1">
          {sortedBorders.map((border) => {
            const color = fabricColors[border.fabricIndex] || '#cccccc';
            return (
              <div key={border.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color, opacity: 0.8 }}
                />
                <span className="text-gray-700">
                  Border {border.order} - {border.width}" width
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
