import React from 'react';

const SkeletonBase = ({ className }) => (
  <div className={`animate-shimmer bg-gradient-to-r from-[#111111] via-[#1f1f1f] to-[#111111] bg-[length:200%_100%] rounded-lg ${className}`} />
);

export const SkeletonCard = ({ variant = 'problem' }) => {
  if (variant === 'problem') {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex flex-col h-full gap-4">
        <div className="flex gap-2">
          <SkeletonBase className="h-6 w-16 rounded-full" />
          <SkeletonBase className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonBase className="h-7 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
        <div className="mt-auto space-y-2">
          <SkeletonBase className="h-3 w-full" />
          <SkeletonBase className="h-3 w-5/6" />
        </div>
      </div>
    );
  }

  if (variant === 'session') {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <SkeletonBase className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <SkeletonBase className="h-6 w-1/2" />
              <SkeletonBase className="h-5 w-20 rounded-full" />
            </div>
            <SkeletonBase className="h-4 w-1/3" />
            <SkeletonBase className="h-3 w-1/4" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBase className="h-5 w-16 rounded-full" />
          <SkeletonBase className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-full" />
        </div>
        <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
          <SkeletonBase className="h-8 w-full" />
          <SkeletonBase className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SkeletonBase className="p-3 w-14 h-14 rounded-2xl" />
          <SkeletonBase className="h-6 w-16 rounded-full" />
        </div>
        <SkeletonBase className="h-10 w-20" />
        <SkeletonBase className="h-4 w-32" />
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
        <SkeletonBase className="size-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <SkeletonBase className="h-7 w-1/3" />
            <SkeletonBase className="h-5 w-16 rounded-full" />
          </div>
          <SkeletonBase className="h-4 w-1/4" />
          <SkeletonBase className="h-4 w-3/4" />
        </div>
        <SkeletonBase className="size-6 rounded-full shrink-0" />
      </div>
    );
  }

  return null;
};

export default SkeletonCard;
