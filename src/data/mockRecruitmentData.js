export const initialMockJobs = [
  {
    id: 1,
    title: 'Senior Java Backend Engineer',
    department: 'ENGINEERING',
    experienceLevel: 'SENIOR',
    requiredSkills: 'Java 21, Spring Boot 3, Microservices, MySQL, REST API, JPA, Docker',
    niceToHaveSkills: 'Kafka, AWS, Kubernetes, Redis, Elasticsearch',
    minSalary: 120000,
    maxSalary: 160000,
    location: 'Remote / San Francisco, CA',
    jobDescription: 'Architect and scale high-throughput core microservices, lead architectural reviews, and maintain zero-downtime transactional systems.',
    status: 'OPEN',
    candidateCount: 2,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 2,
    title: 'Staff Full-Stack React & Spring Lead',
    department: 'ENGINEERING',
    experienceLevel: 'LEAD',
    requiredSkills: 'React, TypeScript, Java, Spring Security, Tailwind CSS, PostgreSQL',
    niceToHaveSkills: 'Next.js, GraphQL, Weka ML, CI/CD Pipelines',
    minSalary: 145000,
    maxSalary: 190000,
    location: 'Hybrid / New York, NY',
    jobDescription: 'Drive frontend enterprise UX and full-stack integration across distributed engineering squads.',
    status: 'OPEN',
    candidateCount: 1,
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 3,
    title: 'Senior HR People Analytics Specialist',
    department: 'HUMAN_RESOURCES',
    experienceLevel: 'SENIOR',
    requiredSkills: 'HR Analytics, Data Visualization, Talent Retention, Performance Metrics, RapidMiner / Weka',
    niceToHaveSkills: 'Python, SQL, Employee Engagement Surveys',
    minSalary: 95000,
    maxSalary: 130000,
    location: 'Remote / Austin, TX',
    jobDescription: 'Spearhead predictive employee retention models and optimize recruitment pipeline metrics.',
    status: 'OPEN',
    candidateCount: 1,
    createdAt: '2026-08-14T09:15:00Z'
  }
];

export const initialMockCandidates = [
  {
    id: 1,
    jobOpeningId: 1,
    jobTitle: 'Senior Java Backend Engineer',
    department: 'ENGINEERING',
    fullName: 'David K. Vance',
    email: 'david.vance@techcorp.io',
    phone: '+1 (555) 482-9102',
    yearsOfExperience: 6.5,
    currentCompany: 'CloudScale Systems',
    currentTitle: 'Senior Software Engineer',
    highestEducation: "Master of Science in Computer Science, Stanford",
    status: 'SHORTLISTED',
    isEvaluated: true,
    overallMatchScore: 92,
    recommendation: 'STRONG_HIRE',
    resumeFileName: 'David_Vance_Senior_Java_Resume.pdf',
    createdAt: '2026-08-15T11:20:00Z'
  },
  {
    id: 2,
    jobOpeningId: 1,
    jobTitle: 'Senior Java Backend Engineer',
    department: 'ENGINEERING',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@devmail.com',
    phone: '+1 (555) 319-7482',
    yearsOfExperience: 4.0,
    currentCompany: 'FinTech Integrations LLC',
    currentTitle: 'Java Backend Developer',
    highestEducation: "Bachelor of Science in Software Engineering",
    status: 'SCREENED',
    isEvaluated: true,
    overallMatchScore: 78,
    recommendation: 'HIRE',
    resumeFileName: 'Elena_Rostova_Resume.pdf',
    createdAt: '2026-08-16T14:45:00Z'
  },
  {
    id: 3,
    jobOpeningId: 2,
    jobTitle: 'Staff Full-Stack React & Spring Lead',
    department: 'ENGINEERING',
    fullName: 'Marcus Chen',
    email: 'marcus.chen@innovate.co',
    phone: '+1 (555) 892-1144',
    yearsOfExperience: 8.0,
    currentCompany: 'Apex Digital Labs',
    currentTitle: 'Lead Full Stack Architect',
    highestEducation: "Bachelor of Science in Computer Engineering",
    status: 'INTERVIEW_SCHEDULED',
    isEvaluated: true,
    overallMatchScore: 95,
    recommendation: 'STRONG_HIRE',
    resumeFileName: 'Marcus_Chen_Staff_Lead.pdf',
    createdAt: '2026-08-16T16:00:00Z'
  },
  {
    id: 4,
    jobOpeningId: 3,
    jobTitle: 'Senior HR People Analytics Specialist',
    department: 'HUMAN_RESOURCES',
    fullName: 'Amina Al-Mansoor',
    email: 'amina.mansoor@talentinsights.com',
    phone: '+1 (555) 670-3918',
    yearsOfExperience: 5.0,
    currentCompany: 'Global Metrics HR',
    currentTitle: 'People Data Analyst',
    highestEducation: "Master of Human Resource Analytics",
    status: 'APPLIED',
    isEvaluated: false,
    overallMatchScore: null,
    recommendation: null,
    resumeFileName: 'Amina_Mansoor_HR_Analytics.pdf',
    createdAt: '2026-08-17T08:30:00Z'
  }
];

export const mockEvaluations = {
  1: {
    id: 1,
    candidateId: 1,
    candidateName: 'David K. Vance',
    jobOpeningId: 1,
    jobTitle: 'Senior Java Backend Engineer',
    overallMatchScore: 92,
    skillsMatchScore: 95,
    experienceMatchScore: 90,
    educationMatchScore: 92,
    recommendation: 'STRONG_HIRE',
    matchedSkills: ['Java 21', 'Spring Boot 3', 'Microservices', 'MySQL', 'REST API', 'JPA', 'Docker', 'Redis'],
    missingSkills: ['Kafka', 'Kubernetes'],
    strengths: [
      'Over 6.5 years designing distributed Java & Spring Boot microservices with sub-millisecond response latency',
      'Extensive database optimization in MySQL, custom indexing, and JPA batching',
      'Demonstrated leadership architecting containerized services on Docker'
    ],
    weaknesses: [
      'Limited production experience with Apache Kafka event streaming clusters',
      'No explicit mention of Kubernetes Helm charts in recent assignments'
    ],
    evaluationSummary: 'Exceptional candidate with rigorous core backend engineering principles. Surpasses the required seniority threshold and exhibits verified mastery of modern Java 21 virtual threads and Spring ecosystem.',
    screeningProvider: 'NexusHR GenAI Agent (Gemini 1.5 Pro / NLP)',
    suggestedInterviewQuestions: [
      {
        question: 'How do you handle distributed transactional consistency across independent Spring Boot microservices when a downstream service fails?',
        category: 'SYSTEM_DESIGN',
        rationale: 'Validates experience with saga patterns, outbox event patterns, or two-phase commit alternatives.',
        expectedAnswerRubric: 'Candidate should describe the Saga orchestration/choreography pattern, compensating transactions, or Idempotency Keys with Dead Letter Queues.'
      },
      {
        question: 'In Java 21, how do Virtual Threads (Project Loom) differ from platform threads, and what pitfalls exist regarding synchronized blocks?',
        category: 'TECHNICAL',
        rationale: 'Probes modern Java 21 runtime knowledge and thread pinning awareness.',
        expectedAnswerRubric: 'Candidate should explain carrier threads, unblocking I/O scheduling, and the thread pinning issue with "synchronized" vs ReentrantLock.'
      },
      {
        question: 'How would you ramp up on Apache Kafka if tasked with building an asynchronous event pipeline within your first 30 days?',
        category: 'GAP_PROBE',
        rationale: 'Addresses the identified gap in Kafka production telemetry.',
        expectedAnswerRubric: 'Candidate should articulate consumer groups, partition offset semantics, and exactly-once delivery guarantees.'
      },
      {
        question: 'Describe a situation where you had to push back on an unrealistic engineering deadline from product management while maintaining team velocity.',
        category: 'BEHAVIORAL',
        rationale: 'Assesses senior-level stakeholder communication and risk mitigation.',
        expectedAnswerRubric: 'Candidate demonstrates objective estimation, scoping down non-critical MVP deliverables, and transparent communication.'
      }
    ],
    evaluatedAt: '2026-08-15T11:25:00Z'
  },
  2: {
    id: 2,
    candidateId: 2,
    candidateName: 'Elena Rostova',
    jobOpeningId: 1,
    jobTitle: 'Senior Java Backend Engineer',
    overallMatchScore: 78,
    skillsMatchScore: 82,
    experienceMatchScore: 72,
    educationMatchScore: 80,
    recommendation: 'HIRE',
    matchedSkills: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'JPA'],
    missingSkills: ['Microservices Architecture', 'Docker', 'Kafka'],
    strengths: [
      'Solid 4 years in monolithic and modular Java backend application maintenance',
      'Strong SQL query tuning and database transaction fundamentals'
    ],
    weaknesses: [
      'Seniority is at 4 years, slightly below the target 5+ year benchmark for Senior band',
      'Lacks containerization (Docker) production deployment experience'
    ],
    evaluationSummary: 'Strong mid-level candidate with high growth trajectory. Recommend proceeding to technical interview with focus on architectural scaling scenarios.',
    screeningProvider: 'NexusHR GenAI Agent',
    suggestedInterviewQuestions: [
      {
        question: 'Explain how Spring Boot handles JPA N+1 query problems and how you profile database query executions.',
        category: 'TECHNICAL',
        rationale: 'Evaluates practical Hibernate/JPA debugging skills.',
        expectedAnswerRubric: 'Should mention JOIN FETCH, EntityGraph, @BatchSize, or Hibernate query statistics.'
      },
      {
        question: 'What strategies have you used to migrate a monolithic service into decoupled independent components?',
        category: 'SYSTEM_DESIGN',
        rationale: 'Tests candidate readiness to step up from modular monoliths into distributed microservices.',
        expectedAnswerRubric: 'Strangler Fig pattern, domain boundary decomposition, and API gateway routing.'
      }
    ],
    evaluatedAt: '2026-08-16T14:50:00Z'
  },
  3: {
    id: 3,
    candidateId: 3,
    candidateName: 'Marcus Chen',
    jobOpeningId: 2,
    jobTitle: 'Staff Full-Stack React & Spring Lead',
    overallMatchScore: 95,
    skillsMatchScore: 98,
    experienceMatchScore: 95,
    educationMatchScore: 92,
    recommendation: 'STRONG_HIRE',
    matchedSkills: ['React', 'TypeScript', 'Java', 'Spring Security', 'Tailwind CSS', 'PostgreSQL', 'CI/CD'],
    missingSkills: ['Weka ML'],
    strengths: [
      '8+ years full stack architecture spanning React, TypeScript, and enterprise Spring Security',
      'Proven track record leading squads of 10+ software engineers',
      'Author of internal design systems and high-scale state management libraries'
    ],
    weaknesses: [
      'Minor gap in native machine learning libraries (Weka), but possesses strong data-layer integration'
    ],
    evaluationSummary: 'Top-tier Staff level hire. Possesses exceptional dual-mastery across frontend React component trees and backend Spring Security micro-architectures.',
    screeningProvider: 'NexusHR GenAI Agent',
    suggestedInterviewQuestions: [
      {
        question: 'How do you design a shared design system with React, Tailwind CSS, and Framer Motion ensuring 60fps animations and keyboard accessibility?',
        category: 'TECHNICAL',
        rationale: 'Tests frontend system architecture and WCAG compliance mastery.',
        expectedAnswerRubric: 'Candidate discusses headless UI primitives, compound components, CSS variables, and ARIA attributes.'
      },
      {
        question: 'How do you architect JWT token renewal with sliding window refresh tokens and silent iframe rotation in high-security environments?',
        category: 'SYSTEM_DESIGN',
        rationale: 'Tests depth in enterprise OAuth2 / JWT stateless security.',
        expectedAnswerRubric: 'Candidate explains HTTP-only Secure SameSite cookies, refresh token rotation, and in-memory access token storage.'
      }
    ],
    evaluatedAt: '2026-08-16T16:10:00Z'
  }
};
