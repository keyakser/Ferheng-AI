import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import { Mail, MessageSquare } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero / Info */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-display font-bold text-foreground tracking-tight">{t('aboutTitle')}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-serif italic">
          {t('aboutText')}
        </p>
      </div>

      {/* Contact Form */}
      <div className="glass-card rounded-[2.5rem] shadow-2xl border border-border/50 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/50 to-primary"></div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground flex items-center justify-center gap-3">
            <Mail className="text-primary" size={28} strokeWidth={2.5} />
            {t('contactUs')}
          </h2>
        </div>

        <form className="space-y-8 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3 group">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">{t('name')}</label>
              <input 
                type="text" 
                className="w-full bg-muted/30 border border-transparent focus:border-primary/20 rounded-xl px-5 py-4 text-foreground focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-3 group">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">{t('email')}</label>
              <input 
                type="email" 
                className="w-full bg-muted/30 border border-transparent focus:border-primary/20 rounded-xl px-5 py-4 text-foreground focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-3 group">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">{t('message')}</label>
            <textarea 
              rows={4}
              className="w-full bg-muted/30 border border-transparent focus:border-primary/20 rounded-xl px-5 py-4 text-foreground focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-muted-foreground/50"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full gap-2 !py-4 text-lg font-bold shadow-lg shadow-primary/20" variant="primary">
              <MessageSquare size={20} strokeWidth={2.5} />
              {t('sendMessage')}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};
