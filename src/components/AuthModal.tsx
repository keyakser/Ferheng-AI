import React, { useState } from 'react';
import { X, LogIn, Mail, Apple, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = async (providerType: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError(null);
    try {
      let provider;
      if (providerType === 'google') {
        provider = new GoogleAuthProvider();
      } else if (providerType === 'facebook') {
        provider = new FacebookAuthProvider();
      } else {
        provider = new OAuthProvider('apple.com');
      }

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser) throw new Error('No user found');
      await syncUserWithFirestore(firebaseUser);
    } catch (err: any) {
      console.error(`${providerType} login error:`, err);
      setError(err.message || `Failed to login with ${providerType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let firebaseUser;
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
        await updateProfile(firebaseUser, { displayName: name });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
      }

      if (!firebaseUser) throw new Error('No user found');
      await syncUserWithFirestore(firebaseUser);
    } catch (err: any) {
      console.error('Email auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const syncUserWithFirestore = async (firebaseUser: any) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    let userDoc;
    try {
      userDoc = await getDoc(userDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
    }

    let userData: User;

    if (!userDoc.exists()) {
      const role: UserRole = firebaseUser.email === 'cihadilbas@gmail.com' ? 'admin' : 'user';
      
      userData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || name || 'User',
        email: firebaseUser.email || '',
        plan: 'free',
        role: role,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        loginCount: 1,
        apiUsage: 0,
        translationCount: 0,
        dailySearchCount: 0,
        lastSearchDate: new Date().toISOString().split('T')[0]
      };

      try {
        await setDoc(userDocRef, {
          ...userData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
    } else {
      const data = userDoc.data();
      const currentLoginCount = (data.loginCount || 0) + 1;
      userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        plan: data.plan || 'free',
        role: data.role || 'user',
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
        lastLogin: Date.now(),
        loginCount: currentLoginCount,
        apiUsage: data.apiUsage || 0,
        translationCount: data.translationCount || 0,
        dailySearchCount: data.dailySearchCount || 0,
        lastSearchDate: data.lastSearchDate || new Date().toISOString().split('T')[0]
      };

      try {
        await setDoc(userDocRef, { 
          lastLogin: serverTimestamp(),
          loginCount: currentLoginCount,
          apiUsage: data.apiUsage || 0,
          translationCount: data.translationCount || 0,
          dailySearchCount: data.dailySearchCount || 0,
          lastSearchDate: data.lastSearchDate || new Date().toISOString().split('T')[0]
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
    }

    onLogin(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-[440px] glass-card rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-10 sm:p-12 animate-in fade-in zoom-in-95 duration-500 border border-slate-200 dark:border-white/10">
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-muted transition-all duration-300 text-muted-foreground hover:text-foreground hover:rotate-90"
        >
            <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-4xl font-display font-bold tracking-tight text-foreground">
                {showEmailForm ? (isSignUp ? t('signUp') : t('signIn')) : t('loginTitle')}
              </h2>
              <p className="text-sm text-muted-foreground font-medium opacity-60">
                {showEmailForm ? t('enterDetails') : t('loginSubtitle')}
              </p>
            </div>
            
            {error && (
              <div className="w-full p-4 bg-destructive/5 border border-destructive/20 rounded-2xl text-destructive text-xs font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            {!showEmailForm ? (
              <div className="w-full space-y-4">
                <Button 
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full !py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
                  variant="primary"
                >
                  <LogIn size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  {t('continueGoogle')}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={loading}
                    className="w-full !py-4 text-[10px] font-bold uppercase tracking-[0.1em] bg-[#1877F2] hover:bg-[#166fe5] text-white border-none flex items-center justify-center gap-2 group"
                  >
                    <Facebook size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    {t('facebook')}
                  </Button>

                  <Button 
                    onClick={() => handleSocialLogin('apple')}
                    disabled={loading}
                    className="w-full !py-4 text-[10px] font-bold uppercase tracking-[0.1em] bg-black hover:bg-black/90 text-white border-none flex items-center justify-center gap-2 group"
                  >
                    <Apple size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    {t('apple')}
                  </Button>
                </div>

                <Button 
                  onClick={() => setShowEmailForm(true)}
                  disabled={loading}
                  variant="secondary"
                  className="w-full !py-5 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 group"
                >
                  <Mail size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  {t('continueEmail')}
                </Button>

                <div className="pt-6 border-t border-border/30">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t('noAccount')}{' '}
                    <button 
                      onClick={() => {
                        setShowEmailForm(true);
                        setIsSignUp(true);
                      }}
                      className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
                    >
                      {t('signUp')}
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="w-full space-y-5">
                {isSignUp && (
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">{t('fullName')}</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-muted/30 border border-border/50 focus:border-primary/40 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-foreground placeholder:text-muted-foreground/30"
                      required
                    />
                  </div>
                )}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">{t('emailAddress')}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 focus:border-primary/40 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-foreground placeholder:text-muted-foreground/30"
                    required
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">{t('password')}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 focus:border-primary/40 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-foreground placeholder:text-muted-foreground/30"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full !py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 mt-4"
                  variant="primary"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    isSignUp ? t('signUp') : t('signIn')
                  )}
                </Button>
                
                <div className="flex flex-col gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-xs text-primary font-bold hover:underline underline-offset-4 decoration-2"
                  >
                    {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest hover:text-foreground transition-colors"
                  >
                    {t('backToSocial')}
                  </button>
                </div>
              </form>
            )}
            
            <p className="text-[10px] text-muted-foreground font-medium px-8 leading-relaxed opacity-50">
              {t('termsPrivacy')}
            </p>
        </div>
      </div>
    </div>
  );
};
