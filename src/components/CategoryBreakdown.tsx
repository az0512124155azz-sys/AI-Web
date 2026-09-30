import React from 'react';
import { AnalysisResult, CategoryKey } from '../lib/types';
import { MessageSquareText, Palette, LayoutGrid, Image as ImageIcon, Type } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: AnalysisResult['categories'];
  selectedCategory: CategoryKey | 'all';
  onSelectCategory: (cat: CategoryKey | 'all') => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (key: CategoryKey) => {
    switch (key) {
      case 'copywriting':
        return <MessageSquareText className="w-4 h-4" />;
      case 'visualStyling':
        return <Palette className="w-4 h-4" />;
      case 'layoutArchetype':
        return <LayoutGrid className="w-4 h-4" />;
      case 'stockAndAssets':
        return <ImageIcon className="w-4 h-4" />;
      case 'typographyIdentity':
        return <Type className="w-4 h-4" />;
    }
  };

  const getBarColor = (score: number) => {
    if (score > 70) return 'bg-rose-500';
    if (score > 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">פירוט לפי 5 קטגוריות ניתוח</h3>
          <p className="text-xs text-slate-400 mt-1">
            כל קטגוריה נמדדת באמצעות כללים היוריסטיים בלבד (ללא קריאות API למודלי AI)
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          הצג את כל הליקויים
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {(Object.keys(categories) as CategoryKey[]).map((key) => {
          const cat = categories[key];
          const isSelected = selectedCategory === key;

          return (
            <button
              key={key}
              onClick={() => onSelectCategory(isSelected ? 'all' : key)}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                    {getCategoryIcon(key)}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    משקל {cat.weight}%
                  </span>
                </div>

                <div className="font-bold text-sm text-white mb-1">{cat.name}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {cat.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(cat.score)}`}
                    style={{ width: `${Math.min(100, Math.max(5, cat.score))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">מדד AI:</span>
                  <span className="font-mono font-bold text-slate-200">{cat.score}%</span>
                </div>

                {cat.flagCount > 0 && (
                  <div className="mt-1 text-[10px] text-amber-400 font-mono">
                    {cat.flagCount} ליקויים זוהו
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
