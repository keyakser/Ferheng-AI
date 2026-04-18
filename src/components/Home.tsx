import React from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { MailList } from './MailList';
import { AboutSection } from './AboutSection';
import { FAQ } from './FAQ';
import { Dictionary } from './Dictionary';
import { Pricing } from './Pricing';
import { UpgradeToPro } from './UpgradeToPro';
import { SearchHistoryItem, User, FavoriteItem, LanguageCode } from '../types';

interface HomeProps {
  user: User | null;
  history: SearchHistoryItem[];
  favorites: FavoriteItem[];
  addToHistory: (item: SearchHistoryItem) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  clearHistory: () => void;
  onHistorySelect: (item: SearchHistoryItem) => void;
  searchRequest: { term: string; sourceLang: LanguageCode; targetLangs: LanguageCode[] } | null;
}

export const Home: React.FC<HomeProps> = ({ user, history, favorites, addToHistory, toggleFavorite, clearHistory, onHistorySelect, searchRequest }) => {
  return (
    <div className="flex flex-col">
      <Hero />
      <div id="dictionary" className="py-12">
        <Dictionary 
          onSearch={addToHistory} 
          onFavorite={toggleFavorite}
          favorites={favorites}
          activeRequest={searchRequest}
          user={user}
        />
      </div>
      <UpgradeToPro />
      <Features />
      <div id="about">
        <AboutSection />
      </div>
      <Pricing />
      <Testimonials />
      <FAQ />
      <MailList />
    </div>
  );
};
