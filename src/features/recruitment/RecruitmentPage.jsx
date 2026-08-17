import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import Spinner from '@/shared/components/Spinner';
import { toast } from '@/shared/hooks/useToast';
import api from '@/config/axios';
import { cn } from '@/shared/utils/cn';

import AddJobModal from './AddJobModal';
import AddCandidateModal from './AddCandidateModal';
import AiScreeningResultModal from './AiScreeningResultModal';
import TurnoverSimulatorCard from './TurnoverSimulatorCard';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'jobs' | 'pipeline' | 'screener' | 'simulator'
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [selectedCandidateEval, setSelectedCandidateEval] = useState(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  // Screener Console State
  const [screeningCandidateId, setScreeningCandidateId] = useState(null);
  const [isScreeningRunning, setIsScreeningRunning] = useState(false);
  const [screeningStep, setScreeningStep] = useState(0);

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    setLoading(true);
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        api.get('/api/recruitment/jobs'),
        api.get('/api/recruitment/candidates')
      ]);
      setJobs(jobsRes.data.data || []);
      setCandidates(candidatesRes.data.data || []);
    } catch (err) {
      console.error('Failed to load recruitment data', err);
      toast.error('Failed to load recruitment records');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiScreening = async (candidateId) => {
    setScreeningCandidateId(candidateId);
    setIsScreeningRunning(true);
    setScreeningStep(1);

    const stepTimer1 = setTimeout(() => setScreeningStep(2), 700);
    const stepTimer2 = setTimeout(() => setScreeningStep(3), 1400);

    try {
      const res = await api.post(`/api/recruitment/candidates/${candidateId}/screen`);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setScreeningStep(4);

      toast.success('AI Resume Screening completed! 🎯');
      fetchRecruitmentData();
      setSelectedCandidateEval(res.data.data);
      setIsEvalModalOpen(true);
    } catch (err) {
      console.error('Screening failed', err);
      toast.error(err.response?.data?.message || 'Failed to screen resume');
    } finally {
      setIsScreeningRunning(false);
      setScreeningCandidateId(null);
      setScreeningStep(0);
    }
  };

  const handleViewEvaluation = async (candidateId) => {
    try {
      const res = await api.get(`/api/recruitment/candidates/${candidateId}/evaluation`);
      setSelectedCandidateEval(res.data.data);
      setIsEvalModalOpen(true);
    } catch (err) {
      console.error('Failed to get evaluation', err);
      toast.error('No AI evaluation found for this candidate yet. Run screening first!');
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await api.patch(`/api/recruitment/candidates/${candidateId}/status`, { status: newStatus });
      fetchRecruitmentData();
    } catch (err) {
      console.error('Failed to update candidate status', err);
      toast.error('Failed to update status');
    }
  };

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchJob = selectedJobFilter === 'ALL' || String(c.jobOpeningId) === String(selectedJobFilter);
      const matchStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
      const matchSearch = !searchQuery.trim() ||
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchJob && matchStatus && matchSearch;
    });
  }, [candidates, selectedJobFilter, selectedStatusFilter, searchQuery]);

  // Top KPIs
  const totalOpenings = jobs.filter((j) => j.status === 'OPEN').length;
  const totalCandidatesCount = candidates.length;
  const screenedCount = candidates.filter((c) => c.isEvaluated || c.status === 'SCREENED').length;
  const shortlistedCount = candidates.filter((c) => c.status === 'SHORTLISTED' || c.status === 'INTERVIEW_SCHEDULED').length;

  const getScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-500 dark:bg-gray-800';
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold';
    if (score >= 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold';
    if (score >= 45) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SHORTLISTED':
        return <Badge status="success" dot>Shortlisted</Badge>;
      case 'INTERVIEW_SCHEDULED':
        return <Badge status="info" dot>Interview Scheduled</Badge>;
      case 'SCREENED':
        return <Badge status="pending" dot>Screened by AI</Badge>;
      case 'APPLIED':
        return <Badge status="neutral" dot>New Applicant</Badge>;
      case 'HIRED':
        return <Badge status="success" dot>Hired</Badge>;
      case 'OFFERED':
        return <Badge status="warning" dot>Offer Extended</Badge>;
      default:
        return <Badge status="danger" dot>Rejected</Badge>;
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
          Loading Smart Recruitment workspace...
        </p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Recruitment & AI Screening</h1>
            <span className="px-2 py-0.5 text-xs font-extrabold rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
              AI POWERED
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generative AI resume evaluation, semantic match scoring, tailored interview generation, and Weka ML retention analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setIsAddJobOpen(true)}>
            ➕ Create Job Opening
          </Button>
          <Button variant="primary" onClick={() => setIsAddCandidateOpen(true)}>
            📄 Upload & Screen Resume
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Job Postings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalOpenings}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Hiring across {jobs.length} roles</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-xl">
              💼
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Applicants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalCandidatesCount}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">Active talent pipeline</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">
              👥
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">AI Screened Resumes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{screenedCount}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">Evaluated & scored</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xl">
              🤖
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Shortlisted / Interview</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{shortlistedCount}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Qualified candidates</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-xl">
              ⭐
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Tab Navigation */}
      <motion.div variants={fadeUp} className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={cn(
              'pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'pipeline'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <span>👥</span> Candidate Pipeline ({candidates.length})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={cn(
              'pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'jobs'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <span>📋</span> Job Postings ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={cn(
              'pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2',
              activeTab === 'simulator'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <span>🧠</span> ML Turnover & Retention Lab
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold">
              Weka 3.8.6
            </span>
          </button>
        </div>
      </motion.div>

      {/* Tab Content 1: Candidate Pipeline */}
      {activeTab === 'pipeline' && (
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, email, role..."
                className="px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-64 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />

              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="ALL">All Job Roles</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENED">Screened</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="OFFERED">Offered</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400 self-end md:self-auto">
              Showing {filteredCandidates.length} candidate{filteredCandidates.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Candidate Table / Cards */}
          {filteredCandidates.length === 0 ? (
            <Card variant="solid" padding="lg" className="text-center py-12">
              <span className="text-4xl">📄</span>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-2">No Candidates Found</p>
              <p className="text-xs text-gray-400 mt-1">Upload a candidate resume or change your filter parameters.</p>
              <Button size="sm" variant="primary" className="mt-4" onClick={() => setIsAddCandidateOpen(true)}>
                Upload First Resume
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} variant="solid" padding="md" className="hover:border-primary-500/40 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {candidate.fullName}
                        </h4>
                        {getStatusBadge(candidate.status)}
                        {candidate.overallMatchScore != null && (
                          <span className={cn('px-2 py-0.5 text-xs rounded-full font-bold', getScoreColor(candidate.overallMatchScore))}>
                            🎯 {candidate.overallMatchScore}% Match
                          </span>
                        )}
                        {candidate.recommendation && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                            {candidate.recommendation.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Applying for <span className="font-semibold text-gray-800 dark:text-gray-200">{candidate.jobTitle}</span> ({candidate.department})
                      </p>

                      <div className="flex flex-wrap gap-4 text-[11px] text-gray-400 pt-1">
                        <span>📧 {candidate.email}</span>
                        {candidate.phone && <span>📞 {candidate.phone}</span>}
                        {candidate.yearsOfExperience != null && <span>⏱️ {candidate.yearsOfExperience} yrs exp</span>}
                        {candidate.currentCompany && <span>🏢 {candidate.currentCompany}</span>}
                        {candidate.resumeFileName && <span>📎 {candidate.resumeFileName}</span>}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800">
                      {candidate.isEvaluated ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewEvaluation(candidate.id)}
                        >
                          🔍 View AI Report & Qs
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isScreeningRunning && screeningCandidateId === candidate.id}
                          onClick={() => handleRunAiScreening(candidate.id)}
                        >
                          {isScreeningRunning && screeningCandidateId === candidate.id ? (
                            <span className="flex items-center gap-1.5">
                              <Spinner size="xs" /> Screening...
                            </span>
                          ) : (
                            '🤖 Run AI Screening'
                          )}
                        </Button>
                      )}

                      {/* Status Dropdown */}
                      <select
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENED">Screened</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview</option>
                        <option value="OFFERED">Offered</option>
                        <option value="HIRED">Hired</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab Content 2: Job Openings */}
      {activeTab === 'jobs' && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} variant="solid" padding="md" className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {job.department.replace('_', ' ')} · {job.location || 'Remote'}
                    </p>
                  </div>
                  <Badge status={job.status === 'OPEN' ? 'active' : 'inactive'} dot>
                    {job.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    {job.experienceLevel} Level
                  </span>
                  {job.minSalary && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {job.jobDescription}
                </p>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills?.split(',').map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  👥 {job.candidateCount || 0} applicant{job.candidateCount === 1 ? '' : 's'}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedJobFilter(String(job.id));
                    setActiveTab('pipeline');
                  }}
                >
                  View Pipeline →
                </Button>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Tab Content 3: ML Turnover & Retention Lab */}
      {activeTab === 'simulator' && (
        <motion.div variants={fadeUp}>
          <TurnoverSimulatorCard />
        </motion.div>
      )}

      {/* Modals */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onJobCreated={(newJob) => {
          setJobs((prev) => [newJob, ...prev]);
        }}
      />

      <AddCandidateModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        jobs={jobs}
        onCandidateAdded={() => {
          fetchRecruitmentData();
        }}
      />

      <AiScreeningResultModal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        evaluation={selectedCandidateEval}
        onStatusChange={(candidateId, status) => {
          handleStatusChange(candidateId, status);
        }}
      />
    </motion.div>
  );
}
