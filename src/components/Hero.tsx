import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const KURDISH_WORDS = ['Roj', 'Welat', 'Ziman', 'Çand'];

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % KURDISH_WORDS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center p-12 sm:p-20 rounded-[4rem] bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl relative overflow-hidden border border-slate-200 dark:border-white/5"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full -ml-48 -mb-48 blur-[100px] pointer-events-none" />
          
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white mb-8 relative z-10"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('heroBadge')}</span>
            </motion.div>
          
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4 relative z-10">
            {t('heroTitle')}
          </h1>

          <div className="h-20 md:h-24 mb-8 relative z-10 flex justify-center items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="font-display text-5xl md:text-7xl font-black tracking-tight text-primary absolute"
              >
                {KURDISH_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <p className="text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed relative z-10 font-medium">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button size="xl" className="gap-2 shadow-xl shadow-primary/20" onClick={() => document.getElementById('dictionary')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('heroStartBtn')} <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="xl" className="bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/10" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('heroLearnMoreBtn')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
