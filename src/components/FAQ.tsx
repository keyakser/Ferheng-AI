import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
    { q: t('faq7Q'), a: t('faq7A') },
  ];

  return (
    <section className="py-32 bg-muted/30">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <h2 className="font-display text-5xl font-bold tracking-tighter text-center mb-20 text-black dark:text-white">
          {t('faqTitle')}
        </h2>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-8 flex items-center justify-between gap-4 relative z-10 text-left"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="text-primary" size={24} />
                  <h3 className="font-display font-bold text-xl text-black dark:text-white">{faq.q}</h3>
                </div>
                <ChevronDown 
                  className={`text-black dark:text-white transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={24} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground dark:text-white/70 px-8 pb-8 pt-0 relative z-10">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
