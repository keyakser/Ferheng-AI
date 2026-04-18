import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Key, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Info,
  ArrowRight,
  Globe,
  Zap,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

export const InstitutionalDemo: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: t('demoActiveMembers'), value: '18 / 25', icon: Users, color: 'text-foreground', bg: 'bg-foreground/10' },
    { label: t('demoTranslationsToday'), value: '247', icon: Globe, color: 'text-foreground', bg: 'bg-foreground/10' },
    { label: t('demoTotalMonth'), value: '5,892', icon: Zap, color: 'text-foreground', bg: 'bg-foreground/10' },
    { label: t('demoPlanStatus'), value: 'Active → 2026-09-01', icon: ShieldCheck, color: 'text-foreground', bg: 'bg-foreground/10' },
  ];

  const sidebarItems = [
    { id: 'overview', label: t('demoOverview'), icon: LayoutDashboard },
    { id: 'members', label: t('demoMembers'), icon: Users },
    { id: 'invite-codes', label: t('demoInviteCodes'), icon: Key },
    { id: 'analytics', label: t('demoAnalytics'), icon: BarChart3 },
    { id: 'settings', label: t('demoSettings'), icon: Settings },
  ];

  const members = [
    { email: 'dr.azad@duhok.edu.krd', name: 'Dr. Azad Mahmoud', status: 'Active', today: 24, joined: '2025-09-15', role: t('demoProfessor') },
    { email: 'shilan.hassan@duhok.edu.krd', name: 'Shilan Hassan', status: 'Active', today: 18, joined: '2025-09-20', role: t('demoResearcher') },
    { email: 'berzan.ali@duhok.edu.krd', name: 'Berzan Ali', status: 'Active', today: 31, joined: '2025-10-01', role: t('demoStudent') },
    { email: 'gulizar.demir@duhok.edu.krd', name: 'Gulizar Demir', status: 'Active', today: 12, joined: '2025-10-05', role: t('demoStudent') },
    { email: 'helin.can@duhok.edu.krd', name: 'Helin Can', status: 'Active', today: 45, joined: '2025-10-10', role: t('demoResearcher') },
  ];

  const recentActivity = [
    { user: 'Dr. Azad Mahmoud', action: t('demoActivity1'), time: `10 ${t('demoTimeMinsAgo')}` },
    { user: 'Berzan Ali', action: t('demoActivity2'), time: `25 ${t('demoTimeMinsAgo')}` },
    { user: 'Shilan Hassan', action: t('demoActivity3'), time: `1 ${t('demoTimeHoursAgo')}` },
    { user: 'Helin Can', action: t('demoActivity4'), time: `2 ${t('demoTimeHoursAgo')}` },
  ];

  const inviteCodes = [
    { code: 'DEMO2025', uses: '8 / 10', status: false, expires: '2025-12-31' },
    { code: 'UNIV2025', uses: '10 / 15', status: false, expires: '2025-12-31' },
    { code: 'DUHOK26', uses: '2 / 5', status: true, expires: '2026-06-30' },
  ];

  const topWords = [
    { word: 'water', count: 342 },
    { word: 'love', count: 298 },
    { word: 'sun', count: 267 },
    { word: 'mountain', count: 234 },
    { word: 'peace', count: 212 },
    { word: 'freedom', count: 198 },
    { word: 'heart', count: 176 },
    { word: 'family', count: 165 },
    { word: 'earth', count: 143 },
    { word: 'friend', count: 132 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-display font-bold tracking-tight">{t('demoOverview')}</h2>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                <Calendar size={16} />
                {t('demoLastUpdated')}: Today, 12:06 PM
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-display font-bold tracking-tight">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 glass-card rounded-[3rem] border border-border/50 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8 text-muted-foreground/30">
                  <BarChart3 size={48} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{t('demoAnalyticsTitle')}</h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {t('demoAnalyticsText')}
                </p>
                <div className="mt-10 grid grid-cols-3 gap-8 w-full max-w-2xl">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/20 w-2/3 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-[3rem] border border-border/50 p-10">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoRecentActivity')}</h3>
                <div className="space-y-8">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== recentActivity.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-[-20px] w-px bg-border/30" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50 font-bold text-xs text-muted-foreground">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          <span className="font-bold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-display font-bold tracking-tight">{t('demoMembers')}</h2>
              <Button variant="primary" size="lg" className="rounded-2xl px-8 shadow-lg shadow-primary/20">
                <Plus size={20} className="mr-2" /> {t('demoAddMember')}
              </Button>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/30">
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoEmail')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoName')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoStatus')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoTranslationsToday')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoJoined')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {members.map((member, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors group">
                        <td className="p-6 font-mono text-sm tracking-tight">{member.email}</td>
                        <td className="p-6 font-medium">
                          <div className="flex flex-col">
                            <span>{member.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{member.role}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                            <CheckCircle2 size={12} /> {member.status}
                          </span>
                        </td>
                        <td className="p-6 font-mono font-bold text-lg">{member.today}</td>
                        <td className="p-6 text-muted-foreground font-mono text-sm">{member.joined}</td>
                        <td className="p-6 text-right">
                          <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'invite-codes':
        return (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-display font-bold tracking-tight">{t('demoInviteCodes')}</h2>
              <Button variant="primary" size="lg" className="rounded-2xl px-8 shadow-lg shadow-primary/20">
                <Plus size={20} className="mr-2" /> {t('demoGenerateCode')}
              </Button>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/30">
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoCode')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoUses')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoStatus')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider italic">{t('demoExpires')}</th>
                      <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {inviteCodes.map((code, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors group">
                        <td className="p-6 font-display font-bold text-lg tracking-wider font-mono">{code.code}</td>
                        <td className="p-6 font-mono font-medium">{code.uses}</td>
                        <td className="p-6">
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${code.status ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${code.status ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                        </td>
                        <td className="p-6 text-muted-foreground font-mono text-sm">{code.expires}</td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                              <Copy size={18} />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-8">
            <h2 className="text-4xl font-display font-bold tracking-tight mb-12">{t('demoAnalytics')}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Daily Translations Chart */}
              <div className="lg:col-span-2 glass-card rounded-[2.5rem] border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoDailyTranslations')}</h3>
                <div className="h-64 flex items-end gap-2 px-4 border-l border-b border-border/30">
                  {[45, 25, 35, 60, 85, 55, 40, 75, 15, 12, 65, 78, 50, 62, 30, 28, 58, 88, 52, 68, 42, 32, 48, 64, 22, 38, 56, 72, 44, 34].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-grow bg-primary/40 hover:bg-primary transition-colors rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  <span>02-21</span>
                  <span>03-03</span>
                  <span>03-21</span>
                </div>
              </div>

              {/* Dialect Distribution */}
              <div className="glass-card rounded-[2.5rem] border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoDialectUsage')}</h3>
                <div className="space-y-8">
                  {[
                    { label: t('dialectKurmanji'), value: 65, color: 'bg-blue-500' },
                    { label: t('dialectSorani'), value: 25, color: 'bg-emerald-500' },
                    { label: t('dialectZazaki'), value: 10, color: 'bg-foreground/40' },
                  ].map((d, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{d.label}</span>
                        <span>{d.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Words */}
              <div className="glass-card rounded-[2.5rem] border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoTopWords')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {topWords.map((word, i) => (
                    <div key={i} className="bg-muted/30 p-4 rounded-2xl text-center hover:bg-muted/50 transition-colors">
                      <div className="font-bold mb-1">{word.word}</div>
                      <div className="text-xs text-muted-foreground">{word.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-Member Breakdown */}
              <div className="glass-card rounded-[2.5rem] border border-border/50 p-8">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoMemberBreakdown')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/30">
                    <span>{t('demoEmail')}</span>
                    <span>{t('demoTotalMonth')}</span>
                  </div>
                  {members.map((member, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <span className="font-mono text-sm">{member.email}</span>
                      <span className="font-bold">{(Math.random() * 2000).toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-8">
            <h2 className="text-4xl font-display font-bold tracking-tight mb-12">{t('demoSettings')}</h2>

            <div className="glass-card rounded-[2.5rem] border border-border/50 p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('demoInstitutionName')}</label>
                  <input 
                    type="text" 
                    defaultValue="Duhok University Language Department"
                    className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button variant="primary" className="rounded-2xl h-[58px] px-10 opacity-50 cursor-not-allowed">
                  {t('demoUpdate')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('demoAdminEmail')}</p>
                  <p className="text-lg font-medium">bilsenkidu@gmail.com</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('demoCurrentPlan')}</p>
                  <p className="text-lg font-medium">institution-25 · Active Members: 25</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card rounded-[2.5rem] border border-border/50 p-10">
                <h3 className="text-xl font-display font-bold mb-8">{t('demoSecurity')}</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold">{t('demoTwoFactor')}</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="w-12 h-6 rounded-full p-1 bg-primary cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold">{t('demoApiAccess')}</p>
                      <p className="text-xs text-muted-foreground">Manage API keys for your institution.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] border border-destructive/20 p-10 bg-destructive/5">
                <h3 className="text-2xl font-display font-bold text-destructive mb-4">{t('demoCancelSubscription')}</h3>
                <p className="text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  {t('demoCancelDesc')}
                </p>
                <Button variant="destructive" size="lg" className="rounded-2xl px-10 shadow-lg shadow-destructive/20">
                  {t('demoCancelBtn')}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background/50 backdrop-blur-sm overflow-hidden border-t border-border/50">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-500 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-border/30">
          {sidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                D
              </div>
              <span className="font-display font-bold truncate">Duhok University</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border/30">
          <div className={`flex items-center gap-4 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border/50">
              JD
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">John Doe</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-8 lg:p-12">
        {/* Demo Banner */}
        <div className="mb-12 grainy-blue-gradient rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Info size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">{t('demoBannerTitle')}</h3>
              <p className="text-white/80 font-medium max-w-md">
                {t('demoBannerText')}
              </p>
            </div>
          </div>
          <Link to="/pricing">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-slate-950 hover:bg-white/90 border-none shadow-2xl shadow-black/10 px-10"
            >
              {t('getStarted')} <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
