import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Facebook, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { User } from '../types';

interface FooterProps {
  user: User | null;
}

export const Footer: React.FC<FooterProps> = ({ user }) => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-background/50 backdrop-blur-3xl border-t border-border/30 py-20 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          
          <div className="flex flex-col items-start gap-6">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-foreground group relative">
              Ferheng<span className="text-primary group-hover:text-primary/80 transition-colors">AI</span>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
            </Link>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium max-w-xs leading-relaxed opacity-70">
                {t('footerDesc')}
              </p>
              <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">
                © {year} FerhengAI. {t('rightsReserved')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-all duration-300 hover:translate-x-1">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-all duration-300 hover:translate-x-1">Terms of Service</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300 hover:translate-x-1">
                <Shield size={14} strokeWidth={3} /> Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-all duration-500 transform hover:scale-125 hover:-rotate-12">
              <Twitter size={22} strokeWidth={2} />
            </a>
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-all duration-500 transform hover:scale-125 hover:-rotate-12">
              <Instagram size={22} strokeWidth={2} />
            </a>
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-all duration-500 transform hover:scale-125 hover:-rotate-12">
              <Facebook size={22} strokeWidth={2} />
            </a>
            <a href="#" className="text-muted-foreground/40 hover:text-primary transition-all duration-500 transform hover:scale-125 hover:-rotate-12">
              <Github size={22} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
