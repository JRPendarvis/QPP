/**
 * BorderSizeDisplay Component
 * Displays quilt size calculations with borders
 */
'use client';

import React from 'react';
import { BorderDimensions } from '@/types/Border';
import { BorderSizeUtils } from '@/utils/borderSizeUtils';

interface BorderSizeDisplayProps {
  dimensions: BorderDimensions;
  showDifference?: boolean;
}

export default function BorderSizeDisplay({ 
  dimensions, 
  showDifference = false 
}: BorderSizeDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span className="text-lg">📏</span>
        Size Calculations
      </h4>
      
      <div className="space-y-2 text-sm">
        {/* Quilt Top Size */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Quilt Top Size:</span>
          <span className="font-medium text-gray-900">
            {BorderSizeUtils.formatSize(dimensions.quiltTopWidth, dimensions.quiltTopHeight)}
          </span>
        </div>

        {/* Border Total */}
        {dimensions.totalBorderWidth > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Border Width:</span>
            <span className="font-medium text-indigo-600">
              +{dimensions.totalBorderWidth}" (all sides)
            </span>
          </div>
        )}

        {/* Finished Size */}
        <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
          <span className="text-gray-900 font-semibold">Finished Size:</span>
          <span className="font-bold text-indigo-700 text-base">
            {BorderSizeUtils.formatSize(dimensions.finishedWidth, dimensions.finishedHeight)}
          </span>
        </div>

        {/* Difference from Target */}
        {showDifference && dimensions.differenceFromTarget && (
          <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
            <span className="text-gray-700">Difference from Target:</span>
            <div className="text-right">
              <div className="text-xs text-gray-600">
                Width: {BorderSizeUtils.formatDifference(dimensions.differenceFromTarget.width)}
              </div>
              <div className="text-xs text-gray-600">
                Height: {BorderSizeUtils.formatDifference(dimensions.differenceFromTarget.height)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formula Explanation */}
      {dimensions.totalBorderWidth > 0 && (
        <div className="mt-3 pt-3 border-t border-indigo-200">
          <p className="text-xs text-gray-600">
            <strong>Formula:</strong> Finished Size = Quilt Top + (2 × Total Border Width)
          </p>
        </div>
      )}
    </div>
  );
}
