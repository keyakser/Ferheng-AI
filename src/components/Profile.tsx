import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FavoriteItem, User } from '../types';
import { Star, ArrowRight, CreditCard, ShieldCheck, Zap, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User | null;
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onSelect: (item: FavoriteItem) => void;
}

interface Subscription {
  status: string;
  plan: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
}

interface Payment {
  id: string;
  checkout_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
  product_name: string;
}

export const Profile: React.FC<ProfileProps> = ({ user, favorites, onRemoveFavorite, onSelect }) => {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionInfo(user.id);
    }
  }, [user?.id]);

  const fetchSubscriptionInfo = async (userId: string) => {
    setLoadingPayments(true);
    try {
      const response = await fetch('/api/get-user-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch subscription info:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8">
           <h2 className="text-2xl font-bold mb-4 text-foreground">{t('loginTitle')}</h2>
           <p className="text-muted-foreground mb-6">{t('loginSubtitle')}</p>
        </div>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    console.log('1. Cancel button clicked, user ID:', user?.id);
    if (!user?.id) {
      console.error('User ID missing');
      return;
    }
    
    console.log('3. Proceeding with cancellation...');

    try {
      console.log('4. Sending request to /api/cancel-subscription...');
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      console.log('5. Fetch request completed. Status:', response.status);
      
      // Check if response is empty or not JSON
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Response is not JSON:', text);
        data = { error: text || 'Sunucudan geçersiz yanıt döndü' };
      }
      
      console.log('6. Response data:', data);

      if (response.ok) {
        alert('Aboneliğiniz başarıyla iptal edildi.');
        window.location.reload();
      } else {
        console.error('Server error:', data);
        alert(`İptal başarısız: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('7. Cancel subscription error:', error);
      alert('İptal işlemi sırasında bir hata oluştu. Lütfen konsolu kontrol edin.');
    }
  };

  const isSubscriptionActive = subscription?.status === 'premium' || user.plan === 'pro';

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 p-10 glass-card rounded-[3rem] shadow-2xl border border-border/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
        
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-foreground flex items-center justify-center text-background text-5xl font-display font-bold shadow-2xl shadow-black/20 ring-4 ring-background">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute -bottom-2 -right-2 text-primary-foreground p-2.5 rounded-full shadow-xl ring-4 ring-background ${isSubscriptionActive ? 'bg-primary' : 'bg-gray-400'}`}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="flex-grow text-center md:text-left space-y-4 relative z-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground font-medium text-lg">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg ${
              isSubscriptionActive 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-foreground text-background'
            }`}>
              {isSubscriptionActive ? 'Premium ✓' : (user.plan === 'free' ? t('freePlan') : user.plan)}
            </span>
            {user.role === 'admin' && (
              <span className="px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                Administrator
              </span>
            )}
            {isSubscriptionActive && (
              <div className="flex gap-2">
                <Button variant="ghost" className="text-xs text-red-500 hover:text-red-600" onClick={handleCancelSubscription}>
                  Aboneliği İptal Et
                </Button>
                <a href="https://polar.sh/dashboard" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="text-xs">
                    Kart Bilgilerini Güncelle
                  </Button>
                </a>
              </div>
            )}
            <span className="px-6 py-2 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
              ID: {user.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      {/* Membership & Payment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card rounded-[3rem] p-10 border border-border/50 shadow-xl space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Zap size={28} />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">Üyelik Detayları</h2>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
              isSubscriptionActive 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isSubscriptionActive ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              {isSubscriptionActive ? 'Aktif' : 'Serbest'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-muted/20 rounded-[1.5rem] border border-border/30 hover:bg-muted/30 transition-colors">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Mevcut Plan</span>
              <span className="font-display font-bold text-xl text-foreground capitalize">{subscription?.plan || user.plan}</span>
            </div>
            
            {subscription?.subscription_start_date && (
              <div className="flex justify-between items-center p-5 bg-muted/20 rounded-[1.5rem] border border-border/30 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Başlangıç</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(subscription.subscription_start_date).toLocaleDateString('tr-TR')}
                </span>
              </div>
            )}

            {isSubscriptionActive && !subscription?.subscription_end_date && (
              <div className="flex justify-between items-center p-5 bg-green-50 dark:bg-green-900/10 rounded-[1.5rem] border border-green-200 dark:border-green-800/50">
                <span className="text-sm font-bold uppercase tracking-widest text-green-700 dark:text-green-400">Yenileme</span>
                <span className="text-sm font-bold text-green-700 dark:text-green-400">Otomatik (Aktif)</span>
              </div>
            )}

            {subscription?.subscription_end_date && (
              <div className="flex justify-between items-center p-5 bg-amber-50 dark:bg-amber-900/10 rounded-[1.5rem] border border-amber-200 dark:border-amber-800/50">
                <span className="text-sm font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">Bitiş Tarihi</span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {new Date(subscription.subscription_end_date).toLocaleDateString('tr-TR')}
                </span>
              </div>
            )}
          </div>

          {user.plan === 'free' && (
            <Link to="/pricing" className="block pt-4">
              <Button className="w-full !py-5 shadow-2xl shadow-primary/20 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02]" variant="primary">
                Premium'a Geç
              </Button>
            </Link>
          )}
        </div>

        {/* Payment History */}
        <div className="glass-card rounded-[3rem] p-10 border border-border/50 shadow-xl space-y-8 relative overflow-hidden group">
          <div className="flex items-center gap-4 text-primary">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <CreditCard size={28} />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">Ödeme Geçmişi</h2>
          </div>

          {loadingPayments ? (
            <div className="flex items-center justify-center h-56 bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
              <div className="text-center">
                <Clock className="text-muted-foreground/50 mx-auto mb-2 animate-spin" size={32} />
                <p className="text-sm text-muted-foreground">Yükleniyor...</p>
              </div>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.map((payment) => (
                <div 
                  key={payment.id}
                  className="p-4 bg-muted/10 hover:bg-muted/20 rounded-2xl border border-border/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground">{payment.product_name}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="font-bold text-foreground">
                      {payment.amount} {payment.currency?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-56 bg-muted/10 rounded-[2rem] border border-dashed border-border/50 text-center p-8 group-hover:bg-muted/20 transition-colors duration-500">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <AlertCircle className="text-muted-foreground/50" size={32} />
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Henüz ödeme yok
              </p>
              <p className="text-xs text-muted-foreground/60 italic max-w-[200px]">
                Ödeme yaptığında burada gösterilecektir.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Favorites */}
      <div className="glass-card rounded-[3rem] shadow-2xl border border-border/50 overflow-hidden group">
        <div className="px-10 py-8 border-b border-border/50 flex items-center justify-between bg-muted/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-amber-400/10 rounded-xl">
              <Star className="text-amber-400 fill-amber-400" size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">{t('favorites')}</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground bg-muted px-4 py-1.5 rounded-full">
            {favorites.length} Kayıt
          </span>
        </div>
        
        <div className="divide-y divide-border/30 bg-background/20">
          {favorites.length > 0 ? (
            favorites.map(fav => (
              <div 
                key={fav.id} 
                className="flex items-center justify-between group/item hover:bg-primary/5 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary scale-y-0 group-hover/item:scale-y-100 transition-transform duration-500 origin-center" />
                <div 
                  className="p-8 flex-grow relative z-10" 
                  onClick={() => onSelect(fav)}
                >
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3 group-hover/item:text-primary transition-colors group-hover/item:translate-x-2 duration-500">{fav.term}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover/item:text-primary/70 transition-colors">
                    <span className="bg-muted px-3 py-1 rounded-full">{fav.sourceLang}</span>
                    <ArrowRight size={16} strokeWidth={3} className="text-primary/40" />
                    <div className="flex gap-2">
                      {(fav.targetLangs || []).map(lang => (
                        <span key={lang} className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/10">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center pr-8">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(fav.id);
                    }}
                    className="p-4 text-muted-foreground/30 hover:text-destructive transition-all duration-300 hover:scale-125 hover:rotate-12"
                  >
                    <Star className="fill-current" size={24} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-24 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                <Star className="text-muted-foreground/20" size={40} />
              </div>
              <p className="text-xl text-muted-foreground italic font-serif opacity-40">
                {t('noFavorites')}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
