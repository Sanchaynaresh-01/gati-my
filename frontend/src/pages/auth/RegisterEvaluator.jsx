import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, Mail, Phone, Building, Briefcase, Award, Lock, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RegisterEvaluator = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    domain_expertise: 'IoT & Embedded Sensors',
    years_experience: 5,
    bio: '',
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password !== form.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/evaluators/register', form);
      setSuccess(true);
      addToast('Evaluator registration submitted for approval.', 'success');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Registration failed.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Application Under Review
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your registration has been submitted for approval. Our administrative committee will review your academic and industrial credentials.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/login/evaluator"
                  className="px-6 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm shadow-md hover:bg-blue-800 transition-all"
                >
                  Evaluator Login
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Homepage
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 sm:p-10 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Jury &amp; Evaluation Panel</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Join as an Evaluator
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                  Evaluate student prototypes across Assam using our standardized 7-criteria innovation rubric.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name &amp; Title *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Dr. / Prof. / Er."
                      value={form.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="expert@institute.edu"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 94350 XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Institute *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      placeholder="e.g. IIT Guwahati / CSIR-NEIST / Gauhati Univ"
                      value={form.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      name="designation"
                      required
                      placeholder="e.g. Associate Professor / Senior Scientist"
                      value={form.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Expertise *</label>
                    <select
                      name="domain_expertise"
                      value={form.domain_expertise}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    >
                      <option value="IoT & Embedded Sensors">IoT &amp; Embedded Sensors</option>
                      <option value="Robotics & Hardware Engineering">Robotics &amp; Hardware Engineering</option>
                      <option value="Smart Agriculture & Bio-energy">Smart Agriculture &amp; Bio-energy</option>
                      <option value="Tea Technology & Agro-processing">Tea Technology &amp; Agro-processing</option>
                      <option value="Flood Hydrology & Environmental Monitoring">Flood Hydrology &amp; Environmental</option>
                      <option value="AI / ML & Software Systems">AI / ML &amp; Software Systems</option>
                      <option value="Sustainable Materials & Bamboo Tech">Sustainable Materials &amp; Bamboo Tech</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Short Professional Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      placeholder="Summary of research or industrial background..."
                      value={form.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Create password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirm_password"
                      required
                      placeholder="Confirm password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Evaluator Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterEvaluator;
