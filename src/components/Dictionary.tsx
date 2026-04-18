import React, { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, Loader2, Share2, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchDefinitions } from '../services/geminiService';
import { DictionaryResult, LanguageCode, SearchHistoryItem, FavoriteItem, User, Ad } from '../types';
import { LANGUAGES } from '../constants';
import { Button } from './ui/Button';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc, increment, query, where, getDocs } from 'firebase/firestore';

interface DictionaryProps {
  onSearch: (item: SearchHistoryItem) => void;
  onFavorite: (item: FavoriteItem) => void;
  favorites: FavoriteItem[];
  activeRequest?: { term: string; sourceLang: LanguageCode; targetLangs: LanguageCode[] } | null;
  user: User | null;
}

export const Dictionary: React.FC<DictionaryProps> = ({ onSearch, onFavorite, favorites, activeRequest, user }) => {
  const { t, language } = useLanguage();
  
  // Mode state
  const [mode, setMode] = useState<'world-to-kurdish' | 'kurdish-to-world'>('world-to-kurdish');

  const WORLD_LANGUAGES: LanguageCode[] = ['en', 'tr', 'fa', 'ar', 'ru', 'de', 'fr', 'it', 'es', 'pt'];
  const KURDISH_DIALECTS: LanguageCode[] = ['ku', 'ckb', 'kiu'];

  const getFlag = (code: LanguageCode) => {
    switch(code) {
      case 'en': return '🇬🇧';
      case 'tr': return '🇹🇷';
      case 'fa': return '🇮🇷';
      case 'ar': return '🇸🇦';
      case 'ru': return '🇷🇺';
      case 'de': return '🇩🇪';
      case 'fr': return '🇫🇷';
      case 'it': return '🇮🇹';
      case 'es': return '🇪🇸';
      case 'pt': return '🇵🇹';
      case 'ku': return '🏔️';
      case 'ckb': return '🌙';
      case 'kiu': return '🏔️';
      default: return '🌐';
    }
  };

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLangs, setTargetLangs] = useState<LanguageCode[]>(['ku']);
  const [results, setResults] = useState<DictionaryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  
  const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
  const [isTargetPickerOpen, setIsTargetPickerOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const q = query(collection(db, 'ads'), where('active', '==', true));
      const snapshot = await getDocs(q);
      setAds(snapshot.docs.map(doc => ({ ...(doc.data() as any), id: doc.id } as Ad)));
    };
    fetchAds();
  }, []);

  // Sync with global language changes
  useEffect(() => {
    if (!activeRequest) {
        if (language === 'tr') {
           setMode('world-to-kurdish');
           setSourceLang('tr');
           setTargetLangs(['ku']);
        } else if (language === 'ku' || language === 'ckb' || language === 'kiu') {
           setMode('kurdish-to-world');
           setSourceLang(language as LanguageCode);
           setTargetLangs(['en']);
        }
    }
  }, [language]);

  // Handle external search requests
  useEffect(() => {
    if (activeRequest) {
        const langs = activeRequest.targetLangs || [];
        setSearchQuery(activeRequest.term);
        setSourceLang(activeRequest.sourceLang);
        setTargetLangs(langs);
        
        // Determine mode based on request
        if (KURDISH_DIALECTS.includes(activeRequest.sourceLang)) {
          setMode('kurdish-to-world');
        } else {
          setMode('world-to-kurdish');
        }
        
        performSearch(activeRequest.term, activeRequest.sourceLang, langs);
    }
  }, [activeRequest]);

  const toggleMode = (newMode: 'world-to-kurdish' | 'kurdish-to-world') => {
    if (newMode === mode) return;
    setMode(newMode);
    // Swap defaults
    if (newMode === 'world-to-kurdish') {
      setSourceLang('en');
      setTargetLangs(['ku']);
    } else {
      setSourceLang('ku');
      setTargetLangs(['en']);
    }
  };

  const handleSwap = () => {
    const newMode = mode === 'world-to-kurdish' ? 'kurdish-to-world' : 'world-to-kurdish';
    setMode(newMode);
    
    const oldSource = sourceLang;
    const oldTargets = targetLangs;
    
    // Use the first target as the new source, and the old source as the new target
    setSourceLang(oldTargets[0]);
    setTargetLangs([oldSource]);
  };

  const logSearchActivity = async (searchTerm: string, source: string, targets: string[]) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'activities'), {
        uid: user.id,
        email: user.email,
        type: 'search',
        details: `Searched for "${searchTerm}" from ${source} to ${targets.join(', ')}`,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error logging search activity:', error);
    }
  };

  const checkAndIncrementSearchLimit = async (): Promise<boolean> => {
    setSearchError(null);
    const today = new Date().toISOString().split('T')[0];

    if (!user) {
      // For unauthenticated users, use localStorage
      const localData = localStorage.getItem('guestSearchData');
      let data = localData ? JSON.parse(localData) : { date: today, count: 0 };
      
      if (data.date !== today) {
        data = { date: today, count: 0 };
      }
      
      if (data.count >= 5) {
        setSearchError(t('guestSearchLimitReached') || 'Günlük ücretsiz arama limitinize (5) ulaştınız. Lütfen giriş yapın veya planınızı yükseltin.');
        return false;
      }
      
      data.count += 1;
      localStorage.setItem('guestSearchData', JSON.stringify(data));
      return true;
    }

    try {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return true; // Fallback if user doc doesn't exist
      
      const userData = userSnap.data();
      const lastSearchDate = userData.lastSearchDate || today;
      let currentCount = userData.dailySearchCount || 0;
      
      if (lastSearchDate !== today) {
        currentCount = 0;
      }
      
      const plan = userData.plan || 'free';
      let limit = 5;
      if (plan === 'pro') limit = 100;
      if (plan === 'enterprise') limit = 150;
      
      if (currentCount >= limit) {
        const errorMsg = t('searchLimitReached') || 'Günlük arama limitinize ({limit}) ulaştınız. Lütfen planınızı yükseltin.';
        setSearchError(errorMsg.replace('{limit}', limit.toString()));
        return false;
      }
      
      await updateDoc(userRef, {
        dailySearchCount: currentCount + 1,
        lastSearchDate: today,
        translationCount: increment(1)
      });
      
      return true;
    } catch (error) {
      console.error('Error checking search limit:', error);
      return true; // Allow search if there's a DB error to not block user
    }
  };

  const performSearch = async (searchTerm: string, source: LanguageCode, targets: LanguageCode[]) => {
    if (!searchTerm.trim() || targets.length === 0) return;

    const canSearch = await checkAndIncrementSearchLimit();
    if (!canSearch) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const sourceName = LANGUAGES.find(l => l.code === source)?.name || source;
      const targetLangsInfo = targets.map(code => ({
        code,
        name: LANGUAGES.find(l => l.code === code)?.name || code
      }));

      const data = await fetchDefinitions(searchTerm, sourceName, targetLangsInfo, user?.id);
      
      // Normalize results to ensure targetLang matches one of our codes
      const normalizedData = data.map(result => {
        if (targets.includes(result.targetLang as any)) return result;
        
        // Try to find by name if code doesn't match
        const foundByName = LANGUAGES.find(l => 
          l.name.toLowerCase().includes(result.targetLang.toLowerCase()) ||
          result.targetLang.toLowerCase().includes(l.name.toLowerCase())
        );
        
        if (foundByName && targets.includes(foundByName.code)) {
          return { ...result, targetLang: foundByName.code };
        }
        
        // If only one target was requested, assume it belongs to that
        if (targets.length === 1) {
          return { ...result, targetLang: targets[0] };
        }
        
        return result;
      });

      setResults(normalizedData);

      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        word: searchTerm,
        sourceLang: source,
        targetLangs: targets,
        timestamp: Date.now()
      };
      onSearch(historyItem);
      logSearchActivity(searchTerm, sourceName, targetLangsInfo.map(l => l.name));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    performSearch(searchQuery, sourceLang, targetLangs);
  };

  const handleFavoriteToggle = () => {
    if (!searchQuery.trim()) return;
    const item: FavoriteItem = {
      id: `${searchQuery}-${sourceLang}-${targetLangs.join('-')}`,
      term: searchQuery,
      sourceLang,
      targetLangs,
      timestamp: Date.now()
    };
    onFavorite(item);
  };

  const toggleTargetLang = (code: LanguageCode) => {
    setTargetLangs(prev => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev; // Prevent selecting 0 languages
        return prev.filter(c => c !== code);
      }
      return [...prev, code];
    });
  };

  const getGenderLabel = (rawGender: string | undefined) => {
    if (!rawGender) return null;
    const key = rawGender.toLowerCase().trim();
    
    if (['nêr', 'ner', 'masculine', 'masc', 'm', 'eril', 'masculin', 'male'].includes(key)) return t('gender_masc');
    if (['mê', 'me', 'feminine', 'fem', 'f', 'dişil', 'féminin', 'female'].includes(key)) return t('gender_fem');
    
    return rawGender;
  };

  const isFavorited = favorites.some(f => f.term.toLowerCase() === searchQuery.toLowerCase());

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      
      {/* Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="glass p-1.5 rounded-[2rem] flex items-center shadow-2xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => toggleMode('world-to-kurdish')}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.75rem] transition-all duration-500 font-bold text-sm tracking-tight ${
              mode === 'world-to-kurdish' 
                ? 'bg-primary text-primary-foreground shadow-xl scale-105' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="text-xl">🏔️</span>
            <span>{t('toKurdish')}</span>
          </button>
          <button 
            onClick={() => toggleMode('kurdish-to-world')}
            className={`flex items-center gap-3 px-8 py-3 rounded-[1.75rem] transition-all duration-500 font-bold text-sm tracking-tight ${
              mode === 'kurdish-to-world' 
                ? 'bg-primary text-primary-foreground shadow-xl scale-105' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="text-xl">🌍</span>
            <span>{t('fromKurdish')}</span>
          </button>
        </div>
      </div>

      {/* Search Area */}
      <div className="bg-slate-950 dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-white/10 dark:border-white/5 relative group z-20">
        <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full -ml-64 -mb-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        {/* Language Selection Grid */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-12 relative z-30">
          
          {/* Left Side: Source Picker */}
          <div className="flex-1 w-full space-y-5 relative">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-center md:text-left opacity-60">
              {mode === 'world-to-kurdish' ? t('translateFrom') : t('kurdishDialect')}
            </h4>
            
            <button 
              onClick={() => setIsSourcePickerOpen(!isSourcePickerOpen)}
              className="w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 group/btn shadow-inner"
            >
              <span className="text-3xl drop-shadow-sm">{getFlag(sourceLang)}</span>
              <span className="font-display font-bold text-xl text-white tracking-tight">{LANGUAGES.find(l => l.code === sourceLang)?.name}</span>
              <div className={`ml-auto transition-transform duration-500 ${isSourcePickerOpen ? 'rotate-180' : ''}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover/btn:text-primary transition-colors"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>

            {isSourcePickerOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-4 bg-background border border-border shadow-2xl rounded-[2rem] z-50 p-4 animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-h-[362px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 grid grid-cols-1 gap-2">
                  {(mode === 'world-to-kurdish' ? WORLD_LANGUAGES : KURDISH_DIALECTS).map(code => {
                    const lang = LANGUAGES.find(l => l.code === code);
                    const isSelected = sourceLang === code;
                    return (
                      <button
                        key={`source-${code}`}
                        onClick={() => {
                          setSourceLang(code);
                          setIsSourcePickerOpen(false);
                        }}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-primary/10 border-primary/30 text-primary shadow-inner' 
                            : 'hover:bg-muted border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-2xl">{getFlag(code)}</span>
                        <span className="font-bold text-sm truncate tracking-tight">{lang?.name}</span>
                        {isSelected && (
                          <div className="ml-auto text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center relative z-10">
            <button
              onClick={handleSwap}
              className="p-4 rounded-2xl bg-white/5 hover:bg-primary/10 text-white/40 hover:text-primary transition-all duration-500 group border border-white/10 shadow-lg active:scale-90"
              title={t('swapLanguages') || 'Swap Languages'}
            >
              <ArrowRightLeft className="group-hover:rotate-180 transition-transform duration-700 rotate-90 md:rotate-0" size={26} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Side: Target Picker (Multiple) */}
          <div className="flex-1 w-full space-y-5 relative">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-center md:text-left opacity-60">
              {mode === 'world-to-kurdish' ? t('kurdishDialect') : t('translateFrom')}
            </h4>
            
            <button 
              onClick={() => setIsTargetPickerOpen(!isTargetPickerOpen)}
              className="w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 group/btn shadow-inner"
            >
              <div className="flex -space-x-3">
                {targetLangs.slice(0, 3).map(code => (
                  <span key={`flag-${code}`} className="text-3xl ring-4 ring-slate-900 rounded-full bg-slate-900 shadow-sm">{getFlag(code)}</span>
                ))}
                {targetLangs.length > 3 && (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-black ring-4 ring-slate-900 shadow-lg">
                    +{targetLangs.length - 3}
                  </div>
                )}
              </div>
              <span className="font-display font-bold text-xl text-white truncate tracking-tight">
                {targetLangs.length === 1 
                  ? LANGUAGES.find(l => l.code === targetLangs[0])?.name 
                  : `${targetLangs.length} ${t('languages')}`}
              </span>
              <div className={`ml-auto transition-transform duration-500 ${isTargetPickerOpen ? 'rotate-180' : ''}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover/btn:text-primary transition-colors"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </button>

            {isTargetPickerOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-4 bg-background border border-border shadow-2xl rounded-[2rem] z-50 p-4 animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-h-[362px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 grid grid-cols-1 gap-2">
                  {(mode === 'world-to-kurdish' ? KURDISH_DIALECTS : WORLD_LANGUAGES).map(code => {
                    const lang = LANGUAGES.find(l => l.code === code);
                    const isSelected = targetLangs.includes(code);
                    return (
                      <button
                        key={`target-${code}`}
                        onClick={() => toggleTargetLang(code)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-primary/10 border-primary/30 text-primary shadow-inner' 
                            : 'hover:bg-muted border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-2xl">{getFlag(code)}</span>
                        <span className="font-bold text-sm truncate tracking-tight">{lang?.name}</span>
                        {isSelected && (
                          <div className="ml-auto text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-border/50 mt-2">
                  <Button 
                    onClick={() => setIsTargetPickerOpen(false)}
                    className="w-full !h-12 text-xs font-black tracking-widest uppercase rounded-xl"
                  >
                    {t('confirmSelection')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearch} className="relative group/form z-10">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <Search className={`h-8 w-8 transition-all duration-500 ${loading ? 'text-primary scale-110' : 'text-muted-foreground group-focus-within/form:text-foreground group-focus-within/form:scale-110'}`} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsSourcePickerOpen(false);
              setIsTargetPickerOpen(false);
            }}
            className="block w-full pl-20 pr-40 py-8 bg-white/5 rounded-2xl border border-white/10 focus:border-primary/30 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 text-3xl font-serif font-bold text-white placeholder-white/20 transition-all duration-500 shadow-sm hover:shadow-md"
            placeholder={t('searchPlaceholder') || 'Kürtçe kelime ara...'}
            autoFocus
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Button 
              type="submit" 
              disabled={loading || !searchQuery.trim()}
              variant="primary"
              className="!h-16 !px-12 rounded-xl shadow-xl shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : t('search')}
            </Button>
          </div>
        </form>

        {searchError && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center font-medium animate-in fade-in slide-in-from-top-2">
            {searchError}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
           <div className="relative">
             <div className="w-20 h-20 rounded-full border-4 border-primary/10"></div>
             <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
           </div>
           <p className="text-muted-foreground font-black tracking-[0.3em] animate-pulse uppercase text-[10px]">{t('analyzing')}</p>
        </div>
      ) : hasSearched ? (
        results.length > 0 ? (
          <div className="space-y-12 stagger-fade-in">
            {user?.plan === 'free' && ads.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 p-6 bg-muted/20 rounded-2xl border border-border/50">
                {ads.filter(a => a.orientation === 'vertical').slice(0, 1).map(ad => (
                  <div key={ad.id} className="w-full md:w-64">
                    {ad.type === 'adsense' ? (
                      <div dangerouslySetInnerHTML={{ __html: ad.content }} />
                    ) : (
                      <a href={ad.link} target="_blank" rel="noopener noreferrer">
                        <img src={ad.content} alt="Ad" referrerPolicy="no-referrer" className="w-full h-auto rounded-xl" />
                      </a>
                    )}
                  </div>
                ))}
                {ads.filter(a => a.orientation === 'horizontal').slice(0, 1).map(ad => (
                  <div key={ad.id} className="flex-1">
                    {ad.type === 'adsense' ? (
                      <div dangerouslySetInnerHTML={{ __html: ad.content }} />
                    ) : (
                      <a href={ad.link} target="_blank" rel="noopener noreferrer">
                        <img src={ad.content} alt="Ad" referrerPolicy="no-referrer" className="w-full h-auto rounded-xl" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            {targetLangs.map(langCode => {
              const langResults = results.filter(r => r.targetLang === langCode);
              const langInfo = LANGUAGES.find(l => l.code === langCode);
              const isRTL = langInfo?.dir === 'rtl';
              const hasResults = langResults.length > 0;

              return (
                <div key={`results-${langCode}`} className="p-6 bg-white border border-zinc-100 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-indigo-100 shadow-sm">
                  <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2 rounded-full border border-zinc-200">
                        <span className="text-2xl">{getFlag(langCode)}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{langInfo?.name}</span>
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-zinc-950 tracking-tight">
                        {t('resultsFor')} <span className="text-indigo-600">"{searchQuery}"</span>
                      </h2>
                    </div>
                    <div className="flex gap-3">
                       <button 
                        onClick={handleFavoriteToggle}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isFavorited ? 'text-amber-500 bg-amber-50' : 'text-zinc-400 hover:text-amber-500 hover:bg-zinc-100'
                        }`}
                      >
                        <Star size={20} fill={isFavorited ? "currentColor" : "none"} strokeWidth={2} />
                      </button>
                       <button className="p-3 rounded-full text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 transition-all duration-300"><Share2 size={20} strokeWidth={2} /></button>
                    </div>
                  </div>
                  
                  {!hasResults ? (
                    <div className="p-24 text-center text-zinc-500 italic font-serif text-xl opacity-60">
                      {t('noResults')}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-100 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                            <th className="px-10 py-5 w-40">{t('category')}</th>
                            <th className="px-10 py-5 w-32">{t('type')}</th>
                            <th className={`px-10 py-5 ${isRTL ? 'text-right' : ''}`}>{t('term')}</th>
                            <th className="px-10 py-5 hidden md:table-cell">{t('definition')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {langResults.map((res, idx) => (
                            <React.Fragment key={idx}>
                              <tr className="group hover:bg-zinc-50 transition-all duration-300">
                                <td className="px-10 py-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                  {res.category}
                                </td>
                                <td className="px-10 py-8 text-sm text-zinc-500 italic font-serif opacity-70">
                                  {res.type}
                                </td>
                                <td className={`px-10 py-8 ${isRTL ? 'text-right' : ''}`}>
                                  <div className="flex flex-col gap-2">
                                    <div className="text-3xl font-serif font-bold text-zinc-950 flex items-center gap-4 flex-wrap tracking-tight">
                                      {res.term}
                                      {res.transliteration && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">{t('latin')}</span>
                                          <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                            {res.transliteration}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {res.gender && (
                                      <div className="flex">
                                        <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest ${
                                          ['mê', 'me', 'feminine', 'fem', 'f', 'dişil', 'féminin', 'female'].includes(res.gender.toLowerCase().trim())
                                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                          {getGenderLabel(res.gender)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-lg text-zinc-700 hidden md:table-cell leading-relaxed">
                                  {res.definition}
                                </td>
                              </tr>
                              <tr className="bg-zinc-50/50">
                                 <td colSpan={4} className="px-10 py-6 text-sm text-zinc-600 border-b border-zinc-100 last:border-0">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 items-start">
                                      <span className="font-bold text-zinc-400 text-[10px] uppercase tracking-widest shrink-0 mt-2">{t('example')}</span>
                                      <div className="flex flex-col gap-3 w-full">
                                        <span className="font-serif italic text-zinc-900 text-xl leading-relaxed">"{res.example_source}"</span>
                                        <span className={`text-zinc-600 font-bold text-lg ${isRTL ? 'text-right' : ''} opacity-80`}>
                                          "{res.example_target}"
                                        </span>
                                      </div>
                                    </div>
                                 </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-4 text-zinc-300">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-serif font-bold text-zinc-950">{t('noResults')}</h3>
            <p className="text-zinc-500">{t('checkSpelling') || 'Farklı bir kelime aramayı deneyin.'}</p>
          </div>
        )
      ) : (
        // Empty State / Landing visual
        <div className="hidden sm:flex flex-col items-center justify-center py-32 opacity-40 transition-all duration-1000">
           <h3 className="text-6xl font-serif font-bold text-zinc-950 mb-4 tracking-tighter">Ferheng<span className="text-indigo-600">AI</span></h3>
           <p className="text-xl text-zinc-500 font-medium tracking-widest uppercase opacity-60">{t('poweredBy')} Gemini 3.0 Flash</p>
        </div>
      )}

    </div>
  );
};
