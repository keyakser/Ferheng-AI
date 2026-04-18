import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Globe, User, ShieldCheck, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../constants';
import { Button } from './ui/Button';
import { User as UserType } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
  user: UserType | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = (
    <>
      <Link to="/dictionary" onClick={() => setIsMenuOpen(false)}>
        <Button variant="ghost" size="sm" className={`text-sm font-bold tracking-wide ${location.pathname === '/dictionary' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
          {t('dictionary')}
        </Button>
      </Link>
      <Link to="/features" onClick={() => setIsMenuOpen(false)}>
        <Button variant="ghost" size="sm" className={`text-sm font-bold tracking-wide ${location.pathname === '/features' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
          {t('features')}
        </Button>
      </Link>
      <Link to="/about" onClick={() => setIsMenuOpen(false)}>
        <Button variant="ghost" size="sm" className={`text-sm font-bold tracking-wide ${location.pathname === '/about' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
          {t('about')}
        </Button>
      </Link>
      <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
        <Button variant="ghost" size="sm" className={`text-sm font-bold tracking-wide ${location.pathname === '/pricing' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
          {t('pricing')}
        </Button>
      </Link>
      {user?.role === 'admin' && (
        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
          <Button variant="ghost" size="sm" className={`text-sm font-bold tracking-wide flex items-center gap-2 ${location.pathname === '/admin' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
            <ShieldCheck size={16} />
            Admin
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full glass border-b border-white/10 dark:border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'} 
              alt="FerhengAI Logo" 
              className="w-11 h-11 rounded-2xl transition-all duration-500 shadow-inner"
              referrerPolicy="no-referrer"
            />
            <span className="text-2xl font-display font-bold tracking-tight text-foreground">
              Ferheng<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks}
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`p-2.5 rounded-full transition-all duration-300 active:scale-95 ${
                  isLangOpen ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe size={20} strokeWidth={2} />
              </button>
              <div className={`absolute right-0 top-full mt-4 w-64 bg-popover/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border transition-all duration-300 transform origin-top-right z-50 overflow-hidden ${
                isLangOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}>
                <div className="px-5 py-3 border-b border-border/50 bg-muted/30">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Language</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm hover:bg-muted/50 transition-all flex items-center justify-between group/item ${
                        language === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-foreground font-medium'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      {language === lang.code && <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-muted transition-all duration-300 text-muted-foreground hover:text-foreground active:scale-95"
            >
              {theme === 'light' ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-full hover:bg-muted transition-all duration-300 text-muted-foreground hover:text-foreground active:scale-95"
            >
              {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>

            {/* Auth (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-border/50">
              {user ? (
                <div className="flex items-center gap-4">
                   <Link to="/profile">
                     <span className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer tracking-tight">
                       {user.name}
                     </span>
                   </Link>
                   <Button variant="secondary" size="sm" onClick={onLogout} className="rounded-2xl px-6 font-bold text-xs tracking-widest uppercase">
                     Log Out
                   </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={onOpenAuth} className="gap-2 rounded-2xl px-7 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 font-bold active:scale-95">
                  <User size={18} strokeWidth={2.5} />
                  <span className="tracking-tight">{t('login')}</span>
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden glass border-t border-white/10 dark:border-white/5 overflow-hidden transition-all duration-300 ${
        isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-6 flex flex-col gap-4">
          {navLinks}
          <div className="pt-4 border-t border-border/50">
            {user ? (
              <div className="flex flex-col gap-4">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                  {user.name}
                </Link>
                <Button variant="secondary" size="sm" onClick={() => { onLogout(); setIsMenuOpen(false); }} className="rounded-2xl px-6 font-bold text-xs tracking-widest uppercase w-full">
                  Log Out
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => { onOpenAuth(); setIsMenuOpen(false); }} className="gap-2 rounded-2xl px-7 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 font-bold active:scale-95 w-full">
                <User size={18} strokeWidth={2.5} />
                <span className="tracking-tight">{t('login')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
