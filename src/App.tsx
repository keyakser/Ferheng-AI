import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Dictionary } from './components/Dictionary';
import { History } from './components/History';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { InstitutionalDemo } from './components/InstitutionalDemo';
import { SidebarAd } from './components/SidebarAd';
import { Footer } from './components/Footer';
import { Button } from './components/ui/Button';
import { SearchHistoryItem, User, FavoriteItem, LanguageCode } from './types';
import { Check, Crown, Sparkles, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth } from './firebase';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { signOut, signInWithCustomToken } from 'firebase/auth';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { DataDeletion } from './pages/DataDeletion';
import { CookieBanner } from './components/CookieBanner';
import { Home } from './components/Home';
import { Features } from './components/Features';

import { useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';

const Success: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyAndLogin = async () => {
            try {
                const checkoutId = searchParams.get('checkout_id');

                if (!checkoutId) {
                    setStatus('error');
                    setErrorMessage('Checkout ID not found');
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                const verifyResponse = await fetch('/api/verify-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ checkout_id: checkoutId })
                });

                if (!verifyResponse.ok) {
                    throw new Error('Payment verification failed');
                }

                const verifyData = await verifyResponse.json();
                const userId = verifyData.user_id;
                const customToken = verifyData.customToken;

                if (!userId) {
                    throw new Error('User ID not returned');
                }

                if (customToken) {
                    await signInWithCustomToken(auth, customToken);
                }

                // User'ı localStorage'a kaydet
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data() as any;
                    localStorage.setItem('ferhengai_user', JSON.stringify({
                        id: userId,
                        email: userData.email,
                        name: userData.name,
                        plan: userData.plan || 'pro',
                        subscription_status: userData.subscription_status,
                        createdAt: userData.createdAt,
                        role: userData.role,
                    }));
                }

                setStatus('success');
                setTimeout(() => {
                    navigate('/profile');
                    window.location.reload();
                }, 3000);
            } catch (error) {
                console.error('Verification failed:', error);
                setStatus('error');
                setErrorMessage('Payment verification failed');
                setTimeout(() => navigate('/'), 5000);
            }
        };
        verifyAndLogin();
    }, [navigate, searchParams]);

    return (
        <div className="flex-grow flex items-center justify-center py-20">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-3xl shadow-xl text-center max-w-md mx-auto border border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-green-600 dark:text-green-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('paymentSuccessTitle') || 'Ödeme Başarılı!'}
                </h2>
                <p className="text-gray-500 mb-8">
                    {t('paymentSuccessText') || 'Premium aboneliğiniz aktive edildi.'}
                </p>
                <p className="text-xs text-gray-400 mb-4">Ana sayfaya yönlendiriliyorsun...</p>
                <Link to="/">
                    <button className="w-full py-3 bg-[#0071E3] text-white font-semibold rounded-full hover:bg-[#0077ED] transition-colors">
                        {t('backToHome') || 'Ana Sayfaya Dön'}
                    </button>
                </Link>
            </div>
        </div>
    );
};

// Backend verification fonksiyonu
async function verifyCheckout(checkoutId: string) {
    try {
        const response = await fetch('/api/verify-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkout_id: checkoutId })
        });
        
        if (!response.ok) throw new Error('Verification failed');
        return await response.json();
    } catch (error) {
        console.error('Checkout verification failed:', error);
        throw error;
    }
}
// Wrapper to handle layout based on route
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col relative overflow-x-hidden font-sans">
            <div className="atmospheric-bg" />
            <div className="relative z-10 flex flex-col flex-grow">
                {children}
            </div>
        </div>
    );
};

const MainContent: React.FC<{
  user: User | null;
  history: SearchHistoryItem[];
  favorites: FavoriteItem[];
  addToHistory: (item: SearchHistoryItem) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  clearHistory: () => void;
  onHistorySelect: (item: SearchHistoryItem) => void;
  searchRequest: { term: string; sourceLang: LanguageCode; targetLangs: LanguageCode[] } | null;
}> = ({ user, history, favorites, addToHistory, toggleFavorite, clearHistory, onHistorySelect, searchRequest }) => {
    const { t } = useLanguage();
  
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Dictionary Area */}
              <div className="lg:col-span-8">
                  <Dictionary 
                    onSearch={addToHistory} 
                    onFavorite={toggleFavorite}
                    favorites={favorites}
                    activeRequest={searchRequest}
                    user={user}
                  />
              </div>
              
              {/* Sidebar History */}
              <div className="lg:col-span-4">
                  <div className="sticky top-28 space-y-8">
                      {user && (
                        <div className="glass-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
                          <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-primary rounded-full" />
                            {t('history')}
                          </h3>
                          <History 
                              history={history} 
                              onSelect={onHistorySelect} 
                              onClear={clearHistory}
                          />
                        </div>
                      )}

                      {!user && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-950 dark:bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/10 dark:border-white/5"
                          >
                              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 blur-[60px] group-hover:scale-110 transition-transform duration-700" />
                              
                              {/* Floating Icons */}
                              <motion.div 
                                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} 
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 right-8 text-yellow-500/40"
                              >
                                <Crown size={24} strokeWidth={1.5} />
                              </motion.div>
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-24 right-12 text-blue-400/30"
                              >
                                <Sparkles size={20} strokeWidth={1.5} />
                              </motion.div>

                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-600 p-[2px] shadow-[0_0_30px_rgba(234,179,8,0.3)] mb-6 relative z-10">
                                <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center">
                                  <Crown size={28} className="text-yellow-500" strokeWidth={2} />
                                </div>
                              </div>
                              
                              <h4 className="font-display font-bold text-3xl mb-4 relative z-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{t('upgradeTitle')}</h4>
                              <p className="text-sm text-white/70 mb-8 leading-relaxed relative z-10 font-medium">{t('upgradeText')}</p>
                              
                              <Link to="/pricing" className="relative z-10 block">
                                <Button 
                                  size="lg" 
                                  className="w-full border-none shadow-[0_10px_30px_rgba(0,113,227,0.3)] hover:shadow-[0_15px_40px_rgba(0,113,227,0.5)] hover:-translate-y-1 transition-all duration-300 font-bold rounded-2xl h-14"
                                  variant="primary"
                                >
                                    {t('viewPlans')}
                                </Button>
                              </Link>
                          </motion.div>
                      )}

                      <SidebarAd />
                  </div>
              </div>
          </div>
      </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchRequest, setSearchRequest] = useState<{ term: string; sourceLang: LanguageCode; targetLangs: LanguageCode[] } | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Migrate old data structure (targetLang -> targetLangs)
        const migrated = parsed.map((item: any) => ({
          ...item,
          targetLangs: item.targetLangs || (item.targetLang ? [item.targetLang] : [])
        }));
        setHistory(migrated);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        // Migrate old data structure (targetLang -> targetLangs)
        const migrated = parsed.map((item: any) => ({
          ...item,
          targetLangs: item.targetLangs || (item.targetLang ? [item.targetLang] : [])
        }));
        setFavorites(migrated);
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const addToHistory = (item: SearchHistoryItem) => {
    const newHistory = [item, ...history.filter(h => h.word.toLowerCase() !== item.word.toLowerCase())].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const toggleFavorite = (item: FavoriteItem) => {
    const exists = favorites.find(f => f.term.toLowerCase() === item.term.toLowerCase());
    let newFavorites;
    if (exists) {
      newFavorites = favorites.filter(f => f.term.toLowerCase() !== item.term.toLowerCase());
    } else {
      newFavorites = [item, ...favorites];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFavoriteById = (id: string) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleHistorySelect = (item: SearchHistoryItem) => {
    // Generate a new object reference to ensure useEffect fires even for same word
    setSearchRequest({
        term: item.word,
        sourceLang: item.sourceLang,
        targetLangs: item.targetLangs
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteSelect = (item: FavoriteItem) => {
    setSearchRequest({
        term: item.term,
        sourceLang: item.sourceLang,
        targetLangs: item.targetLangs
    });
    navigate('/dictionary');
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await addDoc(collection(db, 'activities'), {
          uid: user.id,
          email: user.email,
          type: 'logout',
          details: 'User logged out',
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error logging logout:', error);
      }
    }
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    (window as any).openAuthModal = () => setAuthOpen(true);
  }, []);

  return (
    <Layout>
        <Navbar 
            onOpenAuth={() => setAuthOpen(true)} 
            user={user} 
            onLogout={handleLogout}
        />
        
        <div className="pt-20 flex flex-col flex-grow">
            <Routes>
                <Route path="/" element={
                    <Home 
                        user={user} 
                        history={history} 
                        favorites={favorites}
                        addToHistory={addToHistory}
                        toggleFavorite={toggleFavorite}
                        clearHistory={clearHistory}
                        onHistorySelect={handleHistorySelect}
                        searchRequest={searchRequest}
                    />
                } />
                <Route path="/dictionary" element={
                    <MainContent 
                        user={user} 
                        history={history} 
                        favorites={favorites}
                        addToHistory={addToHistory}
                        toggleFavorite={toggleFavorite}
                        clearHistory={clearHistory}
                        onHistorySelect={handleHistorySelect}
                        searchRequest={searchRequest}
                    />
                } />
                <Route path="/features" element={<div className="flex-grow"><Features /></div>} />
                <Route path="/privacy" element={<div className="flex-grow"><PrivacyPolicy /></div>} />
                <Route path="/terms" element={<div className="flex-grow"><TermsOfService /></div>} />
                <Route path="/veri-silme" element={<div className="flex-grow"><DataDeletion /></div>} />
                <Route path="/pricing" element={<div className="flex-grow"><Pricing user={user} /></div>} />
                <Route path="/success" element={<Success />} />
                <Route path="/about" element={<div className="flex-grow"><About /></div>} />
                <Route path="/admin" element={
                  user?.role === 'admin' ? <div className="flex-grow"><AdminPanel /></div> : <Navigate to="/" replace />
                } />
                <Route path="/institutional-demo" element={<div className="flex-grow"><InstitutionalDemo /></div>} />
                <Route path="/profile" element={
                  <div className="flex-grow">
                    <Profile 
                      user={user} 
                      favorites={favorites} 
                      onRemoveFavorite={removeFavoriteById} 
                      onSelect={handleFavoriteSelect}
                    />
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer user={user} />
        </div>

        <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setAuthOpen(false)} 
            onLogin={(u) => {
                setUser(u);
                setAuthOpen(false);
            }} 
        />
        <CookieBanner />
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
