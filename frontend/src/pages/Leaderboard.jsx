import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Trophy, Filter, Search, School, MapPin, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const ASSAM_DISTRICTS = [
  'All Districts', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar',
  'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh',
  'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat',
  'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
  'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
  'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
];

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let url = '/leaderboard?';
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      if (districtFilter !== 'all' && districtFilter !== 'All Districts') url += `district=${districtFilter}&`;
      const res = await api.get(url);
      if (res.data && res.data.data) {
        setIsPublic(res.data.data.is_public !== false);
        setEntries(res.data.data.entries || []);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [categoryFilter, districtFilter]);

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (e.team_name && e.team_name.toLowerCase().includes(term)) ||
      (e.school_name && e.school_name.toLowerCase().includes(term)) ||
      (e.district && e.district.toLowerCase().includes(term)) ||
      (e.team_code && e.team_code.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4 border border-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>State Innovation Standings</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Official State Leaderboard
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Real-time merit rankings based on 20-hour assessment benchmarks and official jury evaluations across Assam.
          </p>
        </section>

        {/* Filter Bar */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'VI-VIII', label: 'VI–VIII' },
                { id: 'IX-X', label: 'IX–X' },
                { id: 'XI-XII', label: 'XI–XII' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === tab.id
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* District Dropdown & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-emerald-600"
              >
                <option value="all">All Districts (Across Assam)</option>
                {ASSAM_DISTRICTS.filter(d => d !== 'All Districts').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search team, school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Table / Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {!isPublic ? (
            <div className="p-12 rounded-3xl bg-amber-50 border border-amber-200/90 text-center max-w-xl mx-auto shadow-sm">
              <Trophy className="w-10 h-10 mx-auto text-amber-600 mb-3" />
              <h3 className="text-lg font-bold text-amber-950">Official Leaderboard Under Review</h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-2 leading-relaxed">
                Leaderboard will be published after official evaluation by the jury committee. Check back soon for the verified divisional rankings.
              </p>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs font-semibold text-slate-500 mt-3">Computing verified merit scores...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <h3 className="text-base font-bold text-slate-800">No teams matching current criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the district or category filter.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#faf8f5] text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-6">Rank</th>
                      <th className="py-4 px-6">Team &amp; Code</th>
                      <th className="py-4 px-6">School &amp; District</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6 text-right">Merit Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEntries.map((team, idx) => {
                      const rank = team.rank || idx + 1;
                      return (
                        <tr key={team.id || team.team_code} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black ${
                                rank === 1
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : rank === 2
                                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                  : rank === 3
                                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                  : 'text-slate-600'
                              }`}
                            >
                              {rank === 1 ? <Trophy className="w-4 h-4 text-amber-600" /> : `#${rank}`}
                            </span>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{team.team_name}</div>
                            <div className="text-xs font-mono text-emerald-800 font-semibold">{team.team_code}</div>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                              <School className="w-3.5 h-3.5 text-slate-400" />
                              <span>{team.school_name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{team.district}, Assam</span>
                            </div>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                              {team.category}
                            </span>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap text-right">
                            <span className="text-lg font-black text-emerald-800">
                              {team.score}
                            </span>
                            <span className="text-xs text-slate-400 font-normal"> / 100</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
