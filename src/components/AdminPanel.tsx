import React, { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType, storage } from '../firebase';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Activity, Ad, ApiUsage, Discount } from '../types';
import { Users, Activity as ActivityIcon, BarChart3, Megaphone, Plus, Save, Trash2, CheckCircle2, XCircle, Upload, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import toast, { Toaster } from 'react-hot-toast';

export const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'activities' | 'api' | 'ads' | 'discounts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [apiUsage, setApiUsage] = useState<ApiUsage[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For Discount Management
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({ active: true });

  // Sorting state for users
  const [userSortField, setUserSortField] = useState<'lastLogin' | 'apiUsage' | 'translationCount' | 'loginCount'>('lastLogin');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('desc');

  // For Ad Management
  const [newAd, setNewAd] = useState<Partial<Ad>>({ type: 'manual', active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, userSortField, userSortDirection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Always fetch users for mapping
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      
      // For the users tab, we need sorted/limited users
      if (activeTab === 'users') {
        const q = query(collection(db, 'users'), orderBy(userSortField, userSortDirection), limit(50));
        const snapshot = await getDocs(q);
        setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
      } else {
        setUsers(allUsers);
      }

      if (activeTab === 'activities') {
        const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        setActivities(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Activity)));
      } else if (activeTab === 'api') {
        const q = query(collection(db, 'api_usage'), orderBy('timestamp', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        setApiUsage(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ApiUsage)));
      } else if (activeTab === 'ads') {
        const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setAds(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ad)));
      } else if (activeTab === 'discounts') {
        const q = query(collection(db, 'discounts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setDiscounts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Discount)));
      }
    } catch (error) {
      toast.error('Error fetching admin data');
      console.error('Error fetching admin data:', error);
      handleFirestoreError(error, OperationType.LIST, activeTab);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAd = async () => {
    if (!newAd.content && !selectedFile) return;
    
    setUploading(true);
    try {
      let adContent = newAd.content;

      // If a file is selected, upload it first
      if (newAd.type === 'manual' && selectedFile) {
        const storageRef = ref(storage, `ads/${Date.now()}_${selectedFile.name}`);
        const uploadResult = await uploadBytes(storageRef, selectedFile);
        adContent = await getDownloadURL(uploadResult.ref);
      }

      await addDoc(collection(db, 'ads'), {
        ...newAd,
        content: adContent,
        orientation: newAd.orientation || 'horizontal',
        createdAt: Date.now(),
        active: true
      });
      
      setNewAd({ type: 'manual', active: true });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchData();
    } catch (error) {
      console.error('Error adding ad:', error);
      handleFirestoreError(error, OperationType.CREATE, 'ads');
    } finally {
      setUploading(false);
    }
  };

  const toggleUserPremium = async (userId: string, currentPlan: string) => {
    try {
      const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
      await updateDoc(doc(db, 'users', userId), { plan: newPlan });
      fetchData();
    } catch (error) {
      console.error('Error toggling user premium:', error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleAddDiscount = async () => {
    if (!newDiscount.code || !newDiscount.percentage) return;
    try {
      await addDoc(collection(db, 'discounts'), {
        code: newDiscount.code,
        percentage: Number(newDiscount.percentage),
        createdAt: Date.now(),
        active: true
      });
      setNewDiscount({ active: true });
      fetchData();
      toast.success('Discount added successfully');
    } catch (error) {
      console.error('Error adding discount:', error);
      handleFirestoreError(error, OperationType.CREATE, 'discounts');
    }
  };

  // ... (rest of the component)

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'ads', adId), { active: !currentStatus });
      fetchData();
    } catch (error) {
      console.error('Error toggling ad status:', error);
      handleFirestoreError(error, OperationType.UPDATE, `ads/${adId}`);
    }
  };

  const totalApiCost = apiUsage.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Toaster />
      <div className="flex flex-col space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-bold text-foreground tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground font-serif italic">Manage your application ecosystem</p>
          </div>
          <div className="flex bg-muted/30 p-1.5 rounded-[1.5rem] border border-border/50 backdrop-blur-md shadow-xl">
            <button 
              onClick={() => setActiveTab('users')}
              aria-label="Manage Users"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === 'users' ? 'bg-foreground text-background shadow-2xl scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users size={18} /> Users
            </button>
            <button 
              onClick={() => setActiveTab('activities')}
              aria-label="Manage Activities"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === 'activities' ? 'bg-foreground text-background shadow-2xl scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ActivityIcon size={18} /> Activities
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              aria-label="Manage API Usage"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === 'api' ? 'bg-foreground text-background shadow-2xl scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BarChart3 size={18} /> API
            </button>
            <button 
              onClick={() => setActiveTab('ads')}
              aria-label="Manage Ads"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === 'ads' ? 'bg-foreground text-background shadow-2xl scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Megaphone size={18} /> Ads
            </button>
            <button 
              onClick={() => setActiveTab('discounts')}
              aria-label="Manage Discounts"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 ${activeTab === 'discounts' ? 'bg-foreground text-background shadow-2xl scale-105' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Plus size={18} /> Discounts
            </button>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 min-h-[600px] shadow-2xl border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[500px] space-y-6">
              <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-xl shadow-primary/10" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Loading Data</p>
            </div>
          ) : (
            <>
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black">
                        <th className="px-8 py-8">Name</th>
                        <th className="px-8 py-8">Email</th>
                        <th className="px-8 py-8">Role</th>
                        <th className="px-8 py-8">Plan</th>
                        <th 
                          className="px-8 py-8 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            if (userSortField === 'apiUsage') {
                              setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setUserSortField('apiUsage');
                              setUserSortDirection('desc');
                            }
                          }}
                        >
                          API Usage {userSortField === 'apiUsage' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="px-8 py-8 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            if (userSortField === 'translationCount') {
                              setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setUserSortField('translationCount');
                              setUserSortDirection('desc');
                            }
                          }}
                        >
                          Translations {userSortField === 'translationCount' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="px-8 py-8 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            if (userSortField === 'loginCount') {
                              setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setUserSortField('loginCount');
                              setUserSortDirection('desc');
                            }
                          }}
                        >
                          Logins {userSortField === 'loginCount' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="px-8 py-8 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            if (userSortField === 'lastLogin') {
                              setUserSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setUserSortField('lastLogin');
                              setUserSortDirection('desc');
                            }
                          }}
                        >
                          Last Login {userSortField === 'lastLogin' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-primary/[0.03] transition-all duration-300 group">
                          <td className="px-8 py-8 font-display font-bold text-xl group-hover:text-primary transition-colors">{user.name}</td>
                          <td className="px-8 py-8 text-muted-foreground font-medium text-sm">{user.email}</td>
                          <td className="px-8 py-8">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'bg-muted/50 text-muted-foreground border border-border/50'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-8">
                            <span className="px-4 py-1.5 rounded-xl bg-foreground/5 text-foreground text-[9px] font-black uppercase tracking-[0.15em] border border-foreground/10 shadow-sm">
                              {user.plan}
                            </span>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="ml-4 text-[9px]"
                              onClick={() => toggleUserPremium(user.id, user.plan)}
                            >
                              Toggle
                            </Button>
                          </td>
                          <td className="px-8 py-8 text-sm font-bold text-muted-foreground">
                            {user.apiUsage || 0}
                          </td>
                          <td className="px-8 py-8 text-sm font-bold text-muted-foreground">
                            {user.translationCount || 0}
                          </td>
                          <td className="px-8 py-8 text-sm font-bold text-muted-foreground">
                            {user.loginCount || 0}
                          </td>
                          <td className="px-8 py-8 text-xs text-muted-foreground font-medium">
                            {new Date(user.lastLogin).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black">
                        <th className="px-8 py-8">User</th>
                        <th className="px-8 py-8">Type</th>
                        <th className="px-8 py-8">Details</th>
                        <th className="px-8 py-8">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {activities.map(activity => (
                        <tr key={activity.id} className="hover:bg-primary/[0.03] transition-all duration-300 group">
                          <td className="px-8 py-8 font-bold text-sm group-hover:text-primary transition-colors">
                              {users.find(u => u.id === activity.uid)?.name || activity.email}
                            </td>
                          <td className="px-8 py-8">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${
                              activity.type === 'login' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                              activity.type === 'search' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' : 
                              'bg-muted/50 text-muted-foreground border border-border/50'
                            }`}>
                              {activity.type}
                            </span>
                          </td>
                          <td className="px-8 py-8 text-sm text-muted-foreground truncate max-w-xs italic font-serif">{activity.details}</td>
                          <td className="px-8 py-8 text-xs text-muted-foreground font-medium">
                            {new Date(activity.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-muted/20 p-8 rounded-[2rem] border border-border/50 shadow-lg hover:bg-muted/30 transition-all duration-500">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-3">Total Calls</p>
                      <p className="text-5xl font-display font-bold tracking-tighter">{apiUsage.length}</p>
                    </div>
                    <div className="bg-muted/20 p-8 rounded-[2rem] border border-border/50 shadow-lg hover:bg-muted/30 transition-all duration-500">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-3">Total Tokens</p>
                      <p className="text-5xl font-display font-bold tracking-tighter">{apiUsage.reduce((acc, curr) => acc + curr.tokens, 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 shadow-xl shadow-primary/5 hover:bg-primary/10 transition-all duration-500">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-3">Estimated Cost</p>
                      <p className="text-5xl font-display font-bold tracking-tighter text-primary">${totalApiCost.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                          <th className="px-8 py-6">Model</th>
                          <th className="px-8 py-6">Tokens</th>
                          <th className="px-8 py-6">Cost</th>
                          <th className="px-8 py-6">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {apiUsage.map(usage => (
                          <tr key={usage.id} className="hover:bg-primary/[0.02] transition-colors group">
                            <td className="px-8 py-6 font-display font-bold text-lg group-hover:text-primary transition-colors">{usage.model}</td>
                            <td className="px-8 py-6 font-mono text-sm">{usage.tokens.toLocaleString()}</td>
                            <td className="px-8 py-6 text-primary font-bold text-lg">${usage.estimatedCost.toFixed(6)}</td>
                            <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                              {new Date(usage.timestamp).toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'discounts' && (
                <div className="space-y-12">
                  <div className="bg-muted/20 p-10 rounded-[3rem] border border-border/50 space-y-8 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <Plus size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-display font-bold tracking-tight text-foreground">Add New Discount</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text"
                        placeholder="Discount Code"
                        value={newDiscount.code || ''}
                        onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm text-foreground"
                      />
                      <input 
                        type="number"
                        placeholder="Percentage"
                        value={newDiscount.percentage || ''}
                        onChange={e => setNewDiscount({ ...newDiscount, percentage: Number(e.target.value) })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm text-foreground"
                      />
                      <Button onClick={handleAddDiscount} className="md:col-span-2">
                        Add Discount
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                          <th className="px-8 py-6">Code</th>
                          <th className="px-8 py-6">Percentage</th>
                          <th className="px-8 py-6">Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {discounts.map(discount => (
                          <tr key={discount.id} className="hover:bg-primary/[0.02] transition-colors group">
                            <td className="px-8 py-6 font-display font-bold text-lg text-foreground">{discount.code}</td>
                            <td className="px-8 py-6 font-mono text-sm text-foreground">{discount.percentage}%</td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${discount.active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-muted text-muted-foreground border border-border/50'}`}>
                                {discount.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="space-y-12">
                  <div className="bg-muted/20 p-10 rounded-[3rem] border border-border/50 space-y-8 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <Megaphone size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-display font-bold tracking-tight text-foreground">Add New Ad</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <select 
                        value={newAd.type || 'manual'}
                        onChange={e => setNewAd({ ...newAd, type: e.target.value as 'adsense' | 'manual' })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm text-foreground"
                      >
                        <option value="manual">Manual</option>
                        <option value="adsense">AdSense</option>
                      </select>
                      <select 
                        value={newAd.orientation || 'horizontal'}
                        onChange={e => setNewAd({ ...newAd, orientation: e.target.value as 'vertical' | 'horizontal' })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm text-foreground"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                      <input 
                        type="text"
                        placeholder="Content (AdSense Code or Image URL)"
                        value={newAd.content || ''}
                        onChange={e => setNewAd({ ...newAd, content: e.target.value })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm md:col-span-2 text-foreground"
                      />
                      <input 
                        type="text"
                        placeholder="Link (Optional)"
                        value={newAd.link || ''}
                        onChange={e => setNewAd({ ...newAd, link: e.target.value })}
                        className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm md:col-span-2 text-foreground"
                      />
                      {newAd.type === 'manual' && (
                        <input 
                          type="file"
                          onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                          className="w-full bg-background border border-border/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm md:col-span-2 text-foreground"
                        />
                      )}
                      <Button onClick={handleAddAd} className="md:col-span-2" disabled={uploading}>
                        {uploading ? <Loader2 className="animate-spin" /> : 'Add Ad'}
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                          <th className="px-8 py-6">Type</th>
                          <th className="px-8 py-6">Orientation</th>
                          <th className="px-8 py-6">Content</th>
                          <th className="px-8 py-6">Active</th>
                          <th className="px-8 py-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {ads.map(ad => (
                          <tr key={ad.id} className="hover:bg-primary/[0.02] transition-colors group">
                            <td className="px-8 py-6 font-display font-bold text-lg capitalize text-foreground">{ad.type}</td>
                            <td className="px-8 py-6 font-display font-bold text-lg capitalize text-foreground">{ad.orientation}</td>
                            <td className="px-8 py-6 font-mono text-sm truncate max-w-xs text-foreground">{ad.content}</td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${ad.active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-muted text-muted-foreground border border-border/50'}`}>
                                {ad.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <Button variant="secondary" size="sm" onClick={() => toggleAdStatus(ad.id, ad.active)}>
                                Toggle
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
