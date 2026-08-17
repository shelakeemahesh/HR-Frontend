import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import { toast } from '@/shared/hooks/useToast';
import api from '@/config/axios';

const DEPARTMENTS = [
  'ENGINEERING',
  'HUMAN_RESOURCES',
  'FINANCE',
  'MARKETING',
  'SALES',
  'OPERATIONS',
  'DESIGN',
  'LEGAL'
];

const EXPERIENCE_LEVELS = [
  'ENTRY',
  'JUNIOR',
  'MID',
  'SENIOR',
  'LEAD',
  'EXECUTIVE'
];

export default function AddJobModal({ isOpen, onClose, onJobCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'ENGINEERING',
    experienceLevel: 'SENIOR',
    jobDescription: '',
    requiredSkills: '',
    niceToHaveSkills: '',
    minSalary: '',
    maxSalary: '',
    location: 'Remote / Hybrid',
    status: 'OPEN'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.jobDescription.trim() || !formData.requiredSkills.trim()) {
      toast.error('Please fill in all required fields (Title, Skills, Description).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
      };
      const res = await api.post('/api/recruitment/jobs', payload);
      toast.success('Job Opening created successfully!');
      onJobCreated?.(res.data.data);
      onClose();
    } catch (err) {
      console.error('Failed to create job opening', err);
      toast.error(err.response?.data?.message || 'Failed to create job opening');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job Opening" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Java Backend Engineer"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Experience Level *
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco (Hybrid)"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Min Salary ($)
            </label>
            <input
              type="number"
              name="minSalary"
              value={formData.minSalary}
              onChange={handleChange}
              placeholder="e.g. 100000"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Max Salary ($)
            </label>
            <input
              type="number"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleChange}
              placeholder="e.g. 140000"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
            Required Core Skills * (comma-separated)
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="e.g. Java, Spring Boot, Microservices, MySQL, REST API, JPA"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
            Nice-to-Have Skills (comma-separated)
          </label>
          <input
            type="text"
            name="niceToHaveSkills"
            value={formData.niceToHaveSkills}
            onChange={handleChange}
            placeholder="e.g. Docker, Kubernetes, AWS, Kafka, Redis, Elasticsearch"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
            Job Description & Responsibilities *
          </label>
          <textarea
            name="jobDescription"
            rows={4}
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Describe role responsibilities, key project milestones, and tech stack details..."
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Job Opening'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
