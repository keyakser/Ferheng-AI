import React from 'react';
import { motion } from 'motion/react';
import { Mountain, Moon, Globe, Users, MessageSquare, Languages, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const dialects = [
    { icon: Mountain, title: 'Kurmanji', desc: t('dialectKurmanjiDesc'), script: t('dialectKurmanjiScript') },
    { icon: Moon, title: 'Sorani', desc: t('dialectSoraniDesc'), script: t('dialectSoraniScript') },
    { icon: Mountain, title: 'Zazaki', desc: t('dialectZazakiDesc'), script: t('dialectZazakiScript') },
    { icon: Globe, title: t('dialectFamilyTitle'), desc: t('dialectFamilyDesc'), script: t('dialectFamilyScript') },
  ];

  const stats = [
    { label: t('statSpeakers'), icon: Users, color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-400' },
    { label: t('statDialects'), icon: MessageSquare, color: 'from-indigo-500/20 to-primary/20', iconColor: 'text-indigo-400' },
    { label: t('statLanguages'), icon: Languages, color: 'from-primary/20 to-cyan-500/20', iconColor: 'text-primary' },
    { label: t('statAI'), icon: BrainCircuit, color: 'from-cyan-500/20 to-teal-500/20', iconColor: 'text-cyan-400' },
    { label: t('statRules'), icon: ShieldCheck, color: 'from-teal-500/20 to-emerald-500/20', iconColor: 'text-teal-400' },
  ];

  return (
    <section id="about" className="py-32 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl font-bold tracking-tighter mb-6 text-gray-900 dark:text-white">{t('aboutSectionTitle')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t('aboutSectionSubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 mb-20">
          <div className="space-y-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('aboutText1')}
            </p>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('aboutWhyTitle')}</h3>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3"><span>•</span> {t('aboutWhy1')}</li>
                <li className="flex gap-3"><span>•</span> {t('aboutWhy2')}</li>
                <li className="flex gap-3"><span>•</span> {t('aboutWhy3')}</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('aboutTechTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('aboutTechText')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {dialects.map((d, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />
                <div className="flex items-center gap-4 mb-2 relative z-10">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                    <d.icon className="text-slate-900 dark:text-white" size={20} />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-white">{d.title}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-white/60 relative z-10">{d.desc}</p>
                <p className="text-xs text-slate-700 dark:text-white/80 font-medium mt-2 relative z-10 inline-block px-2 py-1 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">{d.script}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center text-slate-900 dark:text-white shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center min-h-[180px]"
            >
              {/* Premium Gradients */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`} />
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full -mr-12 -mt-12 blur-xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />
              
              {/* Floating Icon */}
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className="relative z-10 mb-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:bg-slate-100 dark:group-hover:bg-white/10">
                  <s.icon className={`${s.iconColor} transition-transform duration-500 group-hover:scale-110`} size={28} strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Sparkle Animation */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0], rotate: [0, 45, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="absolute top-6 right-6 text-primary dark:text-primary hidden group-hover:block"
              >
                <Sparkles size={14} />
              </motion.div>

              <div className="relative z-10 font-display font-bold text-lg md:text-xl whitespace-pre-line tracking-tight leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-white/70 transition-all duration-300">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
