import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { Mail, Send, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MailList: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 md:p-20 rounded-[4rem] bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-center shadow-2xl relative overflow-hidden border border-slate-200 dark:border-white/10 group"
        >
          {/* Hero-like Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full -ml-64 -mb-64 blur-[120px] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          
          {/* Floating Icons */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 text-blue-400/30 hidden md:block"
          >
            <Send size={40} strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-24 right-24 text-primary/30 hidden md:block"
          >
            <Sparkles size={48} strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-24 right-32 text-indigo-400/30 hidden md:block"
          >
            <Star size={32} strokeWidth={1.5} />
          </motion.div>
          
          <div className="relative z-10 flex justify-center mb-10">
            <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-shadow duration-500">
              <Mail size={40} className="text-slate-900 dark:text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 relative z-10 text-slate-900 dark:text-white tracking-tight">
            {t('stayUpdated')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
            {t('featuresSubtitle')}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input 
              type="email" 
              placeholder={t('mailPlaceholder')}
              className="flex-grow px-8 py-5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-primary/10 transition-all text-lg shadow-inner"
            />
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90 border-none shadow-[0_0_30px_rgba(0,113,227,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,113,227,0.3)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] px-10 rounded-full font-bold text-lg h-auto py-5 transition-all duration-300 hover:-translate-y-1">
              {t('subscribe')}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
