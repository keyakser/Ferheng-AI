import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { ArrowRight, Crown, Sparkles, Gem, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const UpgradeToPro: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 md:p-20 rounded-[4rem] bg-slate-950 dark:bg-slate-900 text-white text-center shadow-2xl relative overflow-hidden border border-white/10 dark:border-white/5 group"
        >
          {/* Hero-like Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full -ml-64 -mb-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />

          {/* Floating Icons */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-16 text-yellow-500/40 hidden md:block"
          >
            <Crown size={48} strokeWidth={1} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-20 text-primary/30 hidden md:block"
          >
            <Gem size={56} strokeWidth={1} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-24 right-32 text-blue-400/30 hidden md:block"
          >
            <Sparkles size={40} strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, 45, 0] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-32 text-indigo-400/30 hidden md:block"
          >
            <Star size={32} strokeWidth={1.5} />
          </motion.div>
          
          <div className="relative z-10 flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-600 p-[2px] shadow-[0_0_50px_rgba(234,179,8,0.3)]">
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center">
                <Crown size={40} className="text-yellow-500" strokeWidth={2} />
              </div>
            </div>
          </div>

          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 relative z-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {t('upgradeToProTitle')}
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
            {t('upgradeToProDesc')}
          </p>
          
          <Link to="/pricing" className="relative z-10 inline-block">
            <Button size="xl" variant="primary" className="gap-3 border-none shadow-[0_10px_40px_rgba(0,113,227,0.4)] hover:shadow-[0_15px_50px_rgba(0,113,227,0.6)] hover:-translate-y-1 transition-all duration-300 px-12 h-16 rounded-full text-lg font-bold">
              {t('upgradeToProBtn')} <ArrowRight size={20} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
