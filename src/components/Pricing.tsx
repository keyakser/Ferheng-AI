import React, { useState } from 'react';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { User } from '../types';

interface PricingProps {
  user: User | null;
}

export const Pricing: React.FC<PricingProps> = ({ user }) => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, isFree: boolean) => {
    if (isFree) {
      window.location.href = '/#/';
      return;
    }

    if (!user) {
      // Open auth modal if not logged in
      (window as any).openAuthModal?.();
      return;
    }

    // Polar.sh checkout link
    const POLAR_CHECKOUT_LINK = 'https://buy.polar.sh/polar_cl_AgMxJdzyt5tUiYETZaLlDbYIXeOfUUZdGtqfE0syaua';
    
    // Redirect directly to Polar.sh checkout
    window.location.href = POLAR_CHECKOUT_LINK;
  };

  const plans = [
    {
      name: t('freePlan'),
      price: '$0',
      subtitle: t('planFreeSubtitle'),
      period: t('forever'),
      features: [
        t('planFreeFeat1'),
      ],
      notIncluded: [],
      cta: t('startForFree'),
      primary: false,
      isFree: true
    },
    {
      name: t('personalPlan'),
      price: billingCycle === 'monthly' ? '$4.90' : '$49',
      subtitle: t('planPersonalSubtitle'),
      period: billingCycle === 'monthly' ? t('monthly') : t('yearly'),
      features: [
        t('planPersonalFeat1'),
        t('planPersonalFeat2'),
        t('planPersonalFeat3'),
        t('planPersonalFeat4'),
        t('planPersonalFeat5'),
        t('planPersonalFeat6'),
      ],
      notIncluded: [],
      cta: billingCycle === 'monthly' ? t('subscribeMonthly') : t('subscribeYearly'),
      primary: true,
      isFree: false
    },
    {
      name: t('institutionPlan'),
      prices: [
        { amount: '$999', label: t('planInstitutionPrice1') },
        { amount: '$1,999', label: t('planInstitutionPrice2') }
      ],
      subtitle: t('planInstitutionSubtitle'),
      features: [
        t('planInstitutionFeat1'),
        t('planInstitutionFeat2'),
        t('planInstitutionFeat3'),
        t('planInstitutionFeat4'),
        t('planInstitutionFeat5'),
        t('planInstitutionFeat6'),
      ],
      notIncluded: [],
      cta: t('getInstitutionPlan'),
      primary: false,
      isFree: false,
      isInstitution: true
    }
  ];

  return (
    <div className="py-20 sm:py-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="text-center mb-20">
        <h2 className="text-6xl sm:text-7xl font-display font-bold tracking-tight mb-8 text-zinc-950 dark:text-white">
          {t('pricing')}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 font-serif italic opacity-80">
          {t('loginSubtitle')}
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center p-1.5 glass rounded-full border border-border/50 shadow-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-10 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
              billingCycle === 'monthly'
                ? 'bg-foreground text-background shadow-2xl scale-105'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-10 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
              billingCycle === 'yearly'
                ? 'bg-foreground text-background shadow-2xl scale-105'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('yearly')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-6">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative rounded-[2.5rem] p-12 transition-all duration-700 hover:-translate-y-4 border group flex flex-col ${
              plan.primary 
                ? 'bg-slate-950 dark:bg-slate-900 text-white shadow-2xl scale-105 z-10 border-white/5' 
                : 'glass-card text-foreground border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5'
            }`}
          >
            {plan.primary && (
              <>
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 blur-2xl" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl z-20 flex items-center gap-2">
                  <span className="relative top-[1.5px]">✦</span> {t('mostPopular')}
                </div>
              </>
            )}
            
            <h3 className="text-3xl font-display font-bold mb-6 tracking-tight relative z-10">{plan.name}</h3>
            
            <div className="mb-8 relative z-10">
              {plan.prices ? (
                <div className="space-y-4">
                  {plan.prices.map((p, idx) => (
                    <div key={idx} className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-bold tracking-tighter">{p.amount}</span>
                      <span className={`text-xs font-bold uppercase tracking-[0.1em] ${plan.primary ? 'text-white/70' : 'text-muted-foreground'}`}>{p.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-display font-bold tracking-tighter">{plan.price}</span>
                  <span className={`text-xs font-bold uppercase tracking-[0.1em] ${plan.primary ? 'text-white/70' : 'text-muted-foreground'}`}>/{plan.period}</span>
                </div>
              )}
              <p className={`text-sm mt-2 ${plan.primary ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.subtitle}</p>
            </div>

            <div className="space-y-6 mb-12 flex-grow relative z-10">
              {plan.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <Check size={18} className={`${plan.primary ? 'text-white' : 'text-foreground'} mt-0.5 shrink-0`} strokeWidth={3} />
                  <span className={`text-sm font-medium leading-relaxed ${plan.primary ? 'text-white/80' : 'text-muted-foreground'}`}>{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto relative z-10">
              <Button 
                className={`w-full ${plan.primary ? 'bg-primary text-primary-foreground hover:opacity-90 border-none shadow-xl' : 'bg-background text-foreground border border-foreground/20 hover:bg-foreground hover:text-background'}`}
                size="xl"
                onClick={() => {
                  if (plan.isInstitution) {
                    window.location.href = 'mailto:sales@ferhengai.com';
                  } else {
                    handleSubscribe(plan.name, !!plan.isFree);
                  }
                }}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  plan.cta
                )}
              </Button>

              {plan.isInstitution && (
                <Link 
                  to="/institutional-demo" 
                  className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-6 group/demo"
                >
                  <ArrowRight size={14} className="text-foreground" />
                  {t('viewInstitutionalDemo')}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
