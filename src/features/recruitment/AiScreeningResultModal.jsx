import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import Badge from '@/shared/components/Badge';
import Card from '@/shared/components/Card';
import { toast } from '@/shared/hooks/useToast';
import { cn } from '@/shared/utils/cn';

export default function AiScreeningResultModal({ isOpen, onClose, evaluation, onStatusChange }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'breakdown' | 'summary'

  if (!evaluation) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 stroke-blue-500';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400 stroke-amber-500';
    return 'text-red-600 dark:text-red-400 stroke-red-500';
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'STRONG_HIRE':
        return <Badge status="success" className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">⭐ STRONG HIRE</Badge>;
      case 'HIRE':
        return <Badge status="info" className="text-xs px-3 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">✓ RECOMMENDED TO HIRE</Badge>;
      case 'CONSIDER':
        return <Badge status="warning" className="text-xs px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold">⚠️ CONSIDER WITH INTERVIEW</Badge>;
      default:
        return <Badge status="danger" className="text-xs px-3 py-1 bg-red-500/10 text-red-600 border border-red-500/20 font-bold">✕ DO NOT ADVANCE</Badge>;
    }
  };

  const copyQuestions = () => {
    if (!evaluation.suggestedInterviewQuestions?.length) return;
    const text = evaluation.suggestedInterviewQuestions.map((q, i) =>
      `[${q.category}] Question ${i + 1}:\n${q.question}\n\nRationale:\n${q.rationale}\n\nExpected Answer Rubric:\n${q.expectedAnswerRubric}\n`
    ).join('\n---\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Interview questions copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Resume Screening & Interview Guide" size="xl">
      <div className="space-y-6">
        {/* Candidate & Role Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50/40 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {evaluation.candidateName}
              </h3>
              {getRecommendationBadge(evaluation.recommendation)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Evaluating for <span className="font-semibold text-gray-800 dark:text-gray-200">{evaluation.jobTitle}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                Engine: {evaluation.screeningProvider || 'NexusHR AI Agent'}
              </span>
              <span className="text-xs text-gray-400">
                · {evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
          </div>

          {/* Overall Match Score Circular Indicator */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Match Score</p>
              <p className={cn('text-3xl font-extrabold', getScoreColor(evaluation.overallMatchScore))}>
                {evaluation.overallMatchScore}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-primary-500/20 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-lg">
              🎯
            </div>
          </div>
        </div>

        {/* Sub-Scores Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="glass" padding="sm" className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Skills Fit</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{evaluation.skillsMatchScore || 80}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${evaluation.skillsMatchScore || 80}%` }} />
            </div>
          </Card>

          <Card variant="glass" padding="sm" className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Experience Match</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{evaluation.experienceMatchScore || 75}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${evaluation.experienceMatchScore || 75}%` }} />
            </div>
          </Card>

          <Card variant="glass" padding="sm" className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Education Fit</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{evaluation.educationMatchScore || 85}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${evaluation.educationMatchScore || 85}%` }} />
            </div>
          </Card>
        </div>

        {/* Skills Matched & Missing Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Matched Core Skills ({evaluation.matchedSkills?.length || 0})
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.matchedSkills?.length > 0 ? (
                evaluation.matchedSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No exact skill matches detected</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-600 font-bold">⚠️</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Missing / Gap Skills ({evaluation.missingSkills?.length || 0})
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.missingSkills?.length > 0 ? (
                evaluation.missingSkills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-medium">✓ All required skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation for Detailed Sections */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('questions')}
              className={cn(
                'pb-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5',
                activeTab === 'questions'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <span>❓</span> Tailored Interview Questions ({evaluation.suggestedInterviewQuestions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={cn(
                'pb-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5',
                activeTab === 'breakdown'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <span>📊</span> Strengths & Weaknesses
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                'pb-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-1.5',
                activeTab === 'summary'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <span>📝</span> Executive AI Summary
            </button>
          </div>
        </div>

        {/* Tab 1: Suggested Interview Questions */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Custom questions synthesized directly from candidate's verified projects and identified skill gaps.
              </p>
              <Button size="sm" variant="secondary" onClick={copyQuestions}>
                {copied ? '✓ Copied!' : '📋 Copy All Questions'}
              </Button>
            </div>

            <div className="space-y-3">
              {evaluation.suggestedInterviewQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
                      q.category === 'TECHNICAL' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                      q.category === 'SYSTEM_DESIGN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                      q.category === 'GAP_PROBE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    )}>
                      {q.category?.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">Question {idx + 1}</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {q.question}
                  </p>

                  <div className="pt-1 text-xs space-y-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Why Ask This:</span> {q.rationale}
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      <span className="font-semibold">Target Evaluation Rubric:</span> {q.expectedAnswerRubric}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Strengths & Weaknesses */}
        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span>💪</span> Key Candidate Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc list-inside">
                {evaluation.strengths?.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/30 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <span>🔍</span> Areas for Interview Validation
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc list-inside">
                {evaluation.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Summary */}
        {activeTab === 'summary' && (
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Agent Executive Summary
            </h4>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {evaluation.evaluationSummary}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Pipeline Actions:</span>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onStatusChange?.(evaluation.candidateId, 'SHORTLISTED');
                toast.success(`${evaluation.candidateName} moved to Shortlisted! 🌟`);
                onClose();
              }}
            >
              Shortlist Candidate
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onStatusChange?.(evaluation.candidateId, 'INTERVIEW_SCHEDULED');
                toast.success(`Interview Scheduled with ${evaluation.candidateName}! 📅`);
                onClose();
              }}
            >
              Schedule Interview
            </Button>
          </div>

          <Button variant="secondary" onClick={onClose}>
            Close Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
