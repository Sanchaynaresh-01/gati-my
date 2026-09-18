import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ShieldCheck, CheckCircle2, FileText, Award, Calendar, AlertCircle, Sparkles, School, Users, Brain, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Guidelines = () => {
  const rubricItems = [
    { criterion: 'Innovation & Originality', marks: 20, desc: 'Novelty of approach, uniqueness compared to off-the-shelf kits, and creative ingenuity.' },
    { criterion: 'Problem Understanding & Context', marks: 15, desc: 'Clarity of the identified Assam community or ecological challenge and empathy for beneficiaries.' },
    { criterion: 'Technical Implementation & Quality', marks: 20, desc: 'Robustness of hardware prototype, code architecture, sensor calibration, and build craft.' },
    { criterion: 'Feasibility & Practical Utility', marks: 15, desc: 'Workability in real Assam field environments (humidity, power cuts, flood conditions).' },
    { criterion: 'Social & Environmental Impact', marks: 15, desc: 'Potential to protect lives, boost livelihoods in tea/agriculture, or conserve ecology.' },
    { criterion: 'Scalability & Replication', marks: 10, desc: 'Potential for wider district and state-level adoption across other regions.' },
    { criterion: 'Presentation & Documentation', marks: 5, desc: 'Clarity of student explanation, video demo, and structured submission details.' }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official Rulebook</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Rules &amp; Participation Guidelines
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Essential criteria, school coordinator responsibilities, submission guidelines, and official jury evaluation rubric.
          </p>
        </section>

        {/* Guidelines Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
          {/* Section 1: Eligibility & Categories */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-700" />
              <span>Eligibility &amp; Competition Categories</span>
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Open to all bona fide school students studying in Assam across recognized institutions (SEBA, CBSE, ICSE, Government Model Schools, Adarsha Vidyalayas, and Private schools).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200">
                <span className="text-xs font-black text-emerald-800 uppercase">Category 1</span>
                <div className="text-base font-bold text-slate-900 mt-1">Classes VI–VIII</div>
                <div className="text-xs text-slate-500 mt-1">Foundational STEM exploration &amp; curiosity.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200">
                <span className="text-xs font-black text-amber-800 uppercase">Category 2</span>
                <div className="text-base font-bold text-slate-900 mt-1">Classes IX–X</div>
                <div className="text-xs text-slate-500 mt-1">Applied design thinking &amp; hardware kits.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200">
                <span className="text-xs font-black text-blue-800 uppercase">Category 3</span>
                <div className="text-base font-bold text-slate-900 mt-1">Classes XI–XII</div>
                <div className="text-xs text-slate-500 mt-1">Advanced coding, IoT &amp; functional models.</div>
              </div>
            </div>

            {/* Team Size Rule */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Team Composition: </strong>
                <span>Team size will be determined by official program guidelines (typically 3 to 5 students per team led by a designated student leader under mentor guidance).</span>
              </div>
            </div>
          </div>

          {/* Section 2: School & Mentor Responsibilities */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <School className="w-6 h-6 text-amber-700" />
              <span>School &amp; Mentor Responsibilities</span>
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>The Principal nominates a dedicated teacher coordinator (Innovation Mentor) to oversee team registrations on the state portal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Schools facilitate student access to computer lab facilities for the 20-hour online bootcamp and MCQ assessment.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mentors guide students without doing the engineering for them, ensuring student authenticity and learning agency.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Assessment & Quiz Rules */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Brain className="w-6 h-6 text-blue-700" />
              <span>Knowledge Assessment &amp; Quiz Rules</span>
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Following the 20-hour online bootcamp, high-performing teams are shortlisted via an official server-timed MCQ assessment:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>Assessment portal opens on <strong>28 October 2026</strong> and remains active through 30 October 2026.</li>
              <li>Single attempt per enrolled student team; timings are strictly enforced server-side.</li>
              <li>Tests conceptual grasp of human-centered design, problem definition, electronics, and Assam regional needs.</li>
            </ul>
          </div>

          {/* Section 4: Evaluation Rubric (7 Criteria - 100 Marks) */}
          {/* <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-700" />
                <span>Evaluation Rubric (100 Marks Total)</span>
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                Official Jury Grid
              </span>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              {rubricItems.map((r) => (
                <div key={r.criterion} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="sm:pr-4">
                    <div className="text-sm font-bold text-slate-900">{r.criterion}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                  </div>
                  <div className="text-sm font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 w-fit shrink-0">
                    {r.marks} Marks
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Section 5: Code of Conduct */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
            <h2 className="text-xl font-bold text-amber-400">Integrity &amp; Code of Conduct</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              All submitted ideas, code, circuit schematics, and mechanical assemblies must be original work created by the student team. Commercial plagiarism, purchasing ready-made projects from vendors, or impersonation results in immediate disqualification and revocation of school participation credentials.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;
