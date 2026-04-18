import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Ad } from '../types';

import { useLanguage } from '../context/LanguageContext';

export const SidebarAd: React.FC = () => {
  const { t } = useLanguage();
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const q = query(collection(db, 'ads'), where('active', '==', true), limit(5));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          // Pick a random ad from the active ones
          const ads = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ad));
          const randomAd = ads[Math.floor(Math.random() * ads.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);
        handleFirestoreError(error, OperationType.LIST, 'ads');
      }
    };
    fetchAd();
  }, []);

  if (!ad) return null;

  return (
    <div className="mt-8 glass-card rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl relative group">
      <div className="bg-muted/20 px-6 py-3 border-b border-border/50 flex items-center justify-between backdrop-blur-xl">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{t('advertisement')}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
      </div>
      <div className="p-6">
        {ad.type === 'adsense' ? (
          <div className="rounded-2xl overflow-hidden" dangerouslySetInnerHTML={{ __html: ad.content }} />
        ) : (
          <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700">
            <img 
              src={ad.content} 
              alt={t('advertisement')} 
              className="w-full h-auto object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </a>
        )}
      </div>
    </div>
  );
};
