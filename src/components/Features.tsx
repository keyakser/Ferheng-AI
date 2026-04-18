import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Zap, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Features: React.FC = () => {
  const { t } = useLanguage();
  const features = [
    { icon: BookOpen, title: t('feat1Title'), description: t('feat1Desc') },
    { icon: Zap, title: t('feat2Title'), description: t('feat2Desc') },
    { icon: Globe, title: t('feat3Title'), description: t('feat3Desc') },
    { icon: Shield, title: t('feat4Title'), description: t('feat4Desc') },
  ];

  return (
    <section className="py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-6">
            {t('featuresTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <feature.icon size={28} />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-zinc-950 dark:text-white relative z-10">{feature.title}</h3>
              <p className="text-zinc-700 dark:text-white/60 leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
