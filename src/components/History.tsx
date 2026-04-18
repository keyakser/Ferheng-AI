import React, { useState } from 'react';
import { SearchHistoryItem, LanguageCode } from '../types';
import { Clock, Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoryProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(item => 
    item.word.toLowerCase().includes(filter.toLowerCase())
  );

  if (history.length === 0) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="relative group mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all duration-500 group-focus-within:scale-110" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('searchHistoryPlaceholder')}
          className="w-full bg-muted/30 text-foreground text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-500 placeholder:text-muted-foreground/40 border border-border/30 focus:border-primary/30 focus:bg-background shadow-inner"
        />
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-5 rounded-2xl hover:bg-primary/5 transition-all duration-500 group border border-transparent hover:border-primary/10 relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
              <div className="flex items-center justify-between gap-4 relative z-10">
                <span className="font-bold text-base text-foreground group-hover:translate-x-2 transition-transform duration-500 flex-shrink-0">
                  {item.word}
                </span>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black group-hover:text-primary transition-colors min-w-0 flex-1 ml-auto overflow-hidden">
                   <span className="bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 flex-shrink-0">{item.sourceLang}</span>
                   <ArrowRight size={10} strokeWidth={3} className="opacity-40 flex-shrink-0" />
                   <div className="flex -space-x-1.5 overflow-hidden flex-shrink-0">
                     {(item.targetLangs || []).map(lang => (
                       <span key={lang} className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 shadow-sm flex-shrink-0">{lang}</span>
                     ))}
                   </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground italic font-serif opacity-40">{t('noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
