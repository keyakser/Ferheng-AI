import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: 'Dr. Aras', role: t('testimonial1Role'), quote: t('testimonial1Quote') },
    { name: 'Selin', role: t('testimonial2Role'), quote: t('testimonial2Quote') },
    { name: 'Kawa', role: t('testimonial3Role'), quote: t('testimonial3Quote') },
  ];

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="font-display text-5xl font-bold tracking-tighter text-center mb-20 text-zinc-950 dark:text-white">
          {t('testimonialsTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
              <div className="flex gap-1 mb-6 text-zinc-950 dark:text-white relative z-10">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-lg text-zinc-950 dark:text-white mb-6 italic relative z-10">"{t.quote}"</p>
              <div className="font-bold text-sm uppercase tracking-widest text-zinc-950 dark:text-white relative z-10">{t.name}</div>
              <div className="text-xs text-zinc-600 dark:text-white/40 relative z-10">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
