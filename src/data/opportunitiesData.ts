import { Opportunity, ProficiencyLevel, WorkMode, OpportunityType } from '../types';
import { INDUSTRY_COMPANIES } from './companiesData';

interface OppTemplate {
  title: string;
  type: OpportunityType;
  domain: string;
  duration?: string;
  stipendOrSalary: string;
  stipendRange?: string;
  salaryRange?: string;
  workMode: WorkMode;
  location: string;
  minCgpa: number;
  openings: number;
  applicantCount: number;
  eligibility: string;
  minQualification: string;
  graduationYears: number[];
  experienceRequired: string;
  requiredSkills: { skillName: string; proficiency: ProficiencyLevel; mandatory: boolean }[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
}

// Structured role templates mapped to company industry profiles
const ROLE_TEMPLATES: Record<string, OppTemplate[]> = {
  'Software / IT': [
    {
      title: 'Graduate Software Engineer Trainee',
      type: 'Full-Time Placement',
      domain: 'Software Engineering',
      stipendOrSalary: '₹7.0 - 9.5 LPA',
      salaryRange: '₹7 - 10 LPA',
      workMode: 'Hybrid',
      location: 'Bengaluru / Pune / Hyderabad',
      minCgpa: 6.5,
      openings: 50,
      applicantCount: 142,
      eligibility: 'B.E. / B.Tech / M.Tech in CS / IT / ECE with minimum 65% aggregate.',
      minQualification: 'B.Tech / B.E. / MCA',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / 0-1 Years',
      requiredSkills: [
        { skillName: 'Java', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Data Structures', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Spring Boot', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Git', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Cloud Basics (AWS/Azure)', 'REST APIs', 'Unit Testing'],
      description: 'Join our flagship digital engineering practice designing robust enterprise services, scalable microservices, and modern cloud solutions.',
      responsibilities: [
        'Develop, test, and maintain backend microservices in Java / Spring Boot.',
        'Collaborate with cross-functional architecture and QA teams.',
        'Write clean, modular code with unit test coverage exceeding 80%.',
        'Participate in agile sprint ceremonies and code reviews.'
      ]
    },
    {
      title: 'Full Stack Development Intern',
      type: 'Internship + PPO',
      domain: 'Web & Full Stack',
      duration: '6 Months',
      stipendOrSalary: '₹25,000 / month',
      stipendRange: '₹20,000 - ₹30,000 / mo',
      salaryRange: '₹8.0 LPA post PPO',
      workMode: 'Hybrid',
      location: 'Chennai / Bengaluru',
      minCgpa: 7.0,
      openings: 25,
      applicantCount: 88,
      eligibility: 'Pre-final and Final Year B.Tech / MCA students graduating in 2025 or 2026.',
      minQualification: 'B.Tech / B.E. / MCA',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / Intern',
      requiredSkills: [
        { skillName: 'React', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'JavaScript', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Node.js', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'HTML', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'CSS', proficiency: 'Intermediate', mandatory: false }
      ],
      preferredSkills: ['TypeScript', 'Tailwind CSS', 'Docker basics'],
      description: 'Hands-on full stack internship building customer-facing digital portals and responsive web applications.',
      responsibilities: [
        'Build responsive web interfaces using React and modern CSS.',
        'Implement RESTful API endpoints using Node.js and Express.',
        'Integrate state management and asynchronous data fetching.',
        'Assist in deployment to containerized development environments.'
      ]
    }
  ],
  'Product': [
    {
      title: 'Software Development Engineer - I (SDE-1)',
      type: 'Full-Time Placement',
      domain: 'Core Product Engineering',
      stipendOrSalary: '₹18.0 - 24.0 LPA',
      salaryRange: '₹18 - 25 LPA',
      workMode: 'Hybrid',
      location: 'Bengaluru / Hyderabad',
      minCgpa: 7.5,
      openings: 15,
      applicantCount: 230,
      eligibility: 'B.Tech / B.E. / M.Tech in Computer Science or allied branches with strong foundation in CS fundamentals.',
      minQualification: 'B.Tech / B.E. / M.Tech in CS/IT',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Data Structures', proficiency: 'Advanced', mandatory: true },
        { skillName: 'Algorithms', proficiency: 'Advanced', mandatory: true },
        { skillName: 'Problem Solving', proficiency: 'Advanced', mandatory: true },
        { skillName: 'Java', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'System Design', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Distributed Systems', 'Go / C++', 'Microservices Architecture'],
      description: 'Architect and scale critical customer-facing product features handling millions of daily concurrent requests.',
      responsibilities: [
        'Write highly optimized, distributed backend services with sub-millisecond response latency.',
        'Design fault-tolerant databases and caching layers using Redis and PostgreSQL.',
        'Participate in high-level and low-level system design discussions.',
        'Triage and resolve production incidents with automated recovery.'
      ]
    },
    {
      title: 'Frontend Engineering Intern',
      type: 'Internship',
      domain: 'UI/UX & Frontend Platforms',
      duration: '3 Months',
      stipendOrSalary: '₹60,000 / month',
      stipendRange: '₹50,000 - ₹75,000 / mo',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      minCgpa: 7.5,
      openings: 8,
      applicantCount: 165,
      eligibility: '3rd / 4th Year B.Tech / Dual Degree students passionate about web performance and UI engineering.',
      minQualification: 'B.Tech / Dual Degree',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / Portfolio Projects',
      requiredSkills: [
        { skillName: 'React', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'TypeScript', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'JavaScript', proficiency: 'Advanced', mandatory: true },
        { skillName: 'CSS', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Git', proficiency: 'Intermediate', mandatory: false }
      ],
      preferredSkills: ['Next.js', 'Web Performance Optimization', 'State Machines (Zustand/Redux)'],
      description: 'Collaborate with world-class designers and engineers to create fluid, accessible, and ultra-fast web user interfaces.',
      responsibilities: [
        'Build modular, reusable component libraries with strict TypeScript typings.',
        'Optimize Core Web Vitals (LCP, FID, CLS) across desktop and mobile browsers.',
        'Conduct accessibility (a11y) audits adhering to WCAG standards.',
        'Participate in design systems evolution and peer code reviews.'
      ]
    }
  ],
  'FinTech': [
    {
      title: 'FinTech Backend Engineering Intern',
      type: 'Internship + PPO',
      domain: 'Payments & Financial Systems',
      duration: '6 Months',
      stipendOrSalary: '₹45,000 / month',
      stipendRange: '₹40,000 - ₹55,000 / mo',
      salaryRange: '₹14 - 18 LPA post PPO',
      workMode: 'Hybrid',
      location: 'Bengaluru / Noida',
      minCgpa: 7.0,
      openings: 12,
      applicantCount: 110,
      eligibility: 'B.Tech Computer Science / IT / ECE with keen interest in high-concurrency transactional architectures.',
      minQualification: 'B.Tech / B.E.',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / Academic Projects',
      requiredSkills: [
        { skillName: 'Node.js', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'PostgreSQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Data Structures', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Docker', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Redis Caching', 'Message Queues (Kafka/RabbitMQ)', 'Idempotency in Payments'],
      description: 'Build mission-critical payment gateways, UPI transaction rails, and ledger settlement microservices.',
      responsibilities: [
        'Implement resilient double-entry accounting and ledgering services.',
        'Build webhook processing pipelines with guaranteed at-least-once delivery.',
        'Optimize SQL query execution plans for sub-second database transactions.',
        'Enforce bank-grade security standards and data encryption at rest.'
      ]
    }
  ],
  'Banking': [
    {
      title: 'Digital Banking Technology Associate',
      type: 'Full-Time Placement',
      domain: 'Core Banking & APIs',
      stipendOrSalary: '₹11.0 - 15.0 LPA',
      salaryRange: '₹11 - 15 LPA',
      workMode: 'Hybrid',
      location: 'Mumbai / Bengaluru',
      minCgpa: 7.0,
      openings: 20,
      applicantCount: 95,
      eligibility: 'B.Tech / MCA graduates with strong mathematical or computer science background.',
      minQualification: 'B.Tech / B.E. / MCA',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Java', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Spring Boot', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Problem Solving', proficiency: 'Intermediate', mandatory: true }
      ],
      preferredSkills: ['API Security (OAuth2/JWT)', 'Oracle Database', 'CI/CD Pipelines'],
      description: 'Innovate digital banking platforms, instant loan appraisal algorithms, and omnichannel customer apps.',
      responsibilities: [
        'Develop secure REST APIs for net banking and mobile banking apps.',
        'Integrate anti-money laundering (AML) and fraud scoring services.',
        'Maintain high availability (99.99%) uptime across financial services.',
        'Ensure compliance with regulatory banking guidelines and audit logs.'
      ]
    }
  ],
  'E-commerce': [
    {
      title: 'E-commerce Platforms & Logistics Intern',
      type: 'Internship',
      domain: 'Supply Chain & Catalog Platforms',
      duration: '6 Months',
      stipendOrSalary: '₹35,000 / month',
      stipendRange: '₹30,000 - ₹45,000 / mo',
      workMode: 'Hybrid',
      location: 'Bengaluru / Gurugram',
      minCgpa: 6.8,
      openings: 14,
      applicantCount: 125,
      eligibility: 'B.Tech / Dual Degree students graduating in 2025/2026 with strong coding and problem-solving skills.',
      minQualification: 'B.Tech / Dual Degree',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher',
      requiredSkills: [
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Data Structures', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Algorithms', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Git', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Django / FastAPI', 'ElasticSearch', 'Kafka Streaming'],
      description: 'Optimize search relevance, inventory allocations, and rapid dispatch logistics for millions of orders.',
      responsibilities: [
        'Design automated stock reconciliation and dark-store routing tools.',
        'Enhance product catalog indexing and search ranking algorithms.',
        'Build analytical pipelines to predict seasonal demand surges.',
        'Collaborate with operations teams to streamline courier tracking APIs.'
      ]
    }
  ],
  'Consulting': [
    {
      title: 'Technology Advisory & Cloud Consultant',
      type: 'Full-Time Placement',
      domain: 'Tech Strategy & Architecture',
      stipendOrSalary: '₹12.0 - 16.0 LPA',
      salaryRange: '₹12 - 16 LPA',
      workMode: 'Hybrid',
      location: 'Gurugram / Mumbai / Hyderabad',
      minCgpa: 7.2,
      openings: 18,
      applicantCount: 140,
      eligibility: 'B.Tech / Dual Degree with excellent problem solving, communication, and software engineering acumen.',
      minQualification: 'B.Tech / B.E. / Dual Degree',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Problem Solving', proficiency: 'Advanced', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'AWS', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Linux', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Enterprise Architecture', 'Data Visualization', 'Client Presentation'],
      description: 'Advise Fortune 500 CXOs on modern cloud architectures, cybersecurity posturing, and AI roadmaps.',
      responsibilities: [
        'Assess legacy client systems and formulate cloud migration blueprints.',
        'Conduct benchmark evaluations across competing tech stacks.',
        'Build proof-of-concept prototypes to validate technical feasibility.',
        'Present analytical recommendations directly to client leadership.'
      ]
    }
  ],
  'Telecom': [
    {
      title: '5G Core & Network Software Intern',
      type: 'Internship + PPO',
      domain: 'Telecommunications & Edge Computing',
      duration: '6 Months',
      stipendOrSalary: '₹30,000 / month',
      stipendRange: '₹25,000 - ₹35,000 / mo',
      salaryRange: '₹9 - 12 LPA post PPO',
      workMode: 'On-site',
      location: 'Navi Mumbai / Gurugram',
      minCgpa: 6.8,
      openings: 10,
      applicantCount: 72,
      eligibility: 'B.Tech in ECE / CS / Telecom with knowledge of computer networking and Linux.',
      minQualification: 'B.Tech in ECE/CS/IT',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher',
      requiredSkills: [
        { skillName: 'Networking', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Docker', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Data Structures', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['TCP/IP Protocol Stack', 'Wireshark', 'Kubernetes Edge'],
      description: 'Work on standalone 5G software-defined networking, packet core telemetry, and real-time cellular edge services.',
      responsibilities: [
        'Develop telemetry scripts monitoring 5G base station latency and throughput.',
        'Configure network slicing profiles for low-latency enterprise applications.',
        'Analyze IP traffic and debug packet drops using Linux tracing utilities.',
        'Support Open RAN integration and automated RF testing suites.'
      ]
    }
  ],
  'Cloud': [
    {
      title: 'Cloud Infrastructure & DevOps Engineer',
      type: 'Full-Time Placement',
      domain: 'Cloud & Platform Engineering',
      stipendOrSalary: '₹16.0 - 22.0 LPA',
      salaryRange: '₹16 - 22 LPA',
      workMode: 'Remote',
      location: 'Bengaluru / Remote',
      minCgpa: 7.2,
      openings: 8,
      applicantCount: 180,
      eligibility: 'B.Tech / M.Tech in CS / IT with hands-on experience in containerization and CI/CD pipelines.',
      minQualification: 'B.Tech / M.Tech in CS/IT',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'AWS', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Docker', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Kubernetes', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'CI/CD', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: true }
      ],
      preferredSkills: ['Terraform (IaC)', 'Prometheus / Grafana', 'Python Scripting'],
      description: 'Manage scalable global cloud clusters, automated zero-downtime deployments, and infrastructure as code.',
      responsibilities: [
        'Maintain multi-region Kubernetes clusters running production workloads.',
        'Author declarative Terraform configurations for automated provisioning.',
        'Build resilient GitHub Actions CI/CD pipelines with security scanning.',
        'Implement real-time alerting, logging, and incident automated remediation.'
      ]
    }
  ],
  'Cybersecurity': [
    {
      title: 'Security Operations & Threat Analyst Intern',
      type: 'Internship',
      domain: 'Information Security & SecOps',
      duration: '6 Months',
      stipendOrSalary: '₹35,000 / month',
      stipendRange: '₹30,000 - ₹40,000 / mo',
      workMode: 'Hybrid',
      location: 'Bengaluru / Pune',
      minCgpa: 7.0,
      openings: 6,
      applicantCount: 90,
      eligibility: 'B.Tech students with demonstrable knowledge of OWASP Top 10, penetration testing, or CTF competitions.',
      minQualification: 'B.Tech / B.E. / BCA / MCA',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / CTF Experience',
      requiredSkills: [
        { skillName: 'Cybersecurity', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'OWASP', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Networking', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Python', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Burp Suite', 'Cloud Security (AWS IAM)', 'Vulnerability Assessment'],
      description: 'Defend enterprise infrastructure against advanced threats, conduct penetration tests, and audit source code.',
      responsibilities: [
        'Perform static and dynamic application security testing (SAST/DAST).',
        'Analyze SIEM logs to investigate suspicious access attempts and anomalies.',
        'Document vulnerability assessment reports with actionable remediation advice.',
        'Participate in red-team simulated attacks and security awareness drills.'
      ]
    }
  ],
  'AI / Data': [
    {
      title: 'AI / Machine Learning Engineer Trainee',
      type: 'Full-Time Placement',
      domain: 'Artificial Intelligence & Data Science',
      stipendOrSalary: '₹14.0 - 20.0 LPA',
      salaryRange: '₹14 - 20 LPA',
      workMode: 'Hybrid',
      location: 'Bengaluru / Mumbai',
      minCgpa: 7.5,
      openings: 12,
      applicantCount: 215,
      eligibility: 'B.Tech / M.Tech / M.S. in CS / AI / Data Science / Mathematics with high proficiency in Python and ML frameworks.',
      minQualification: 'B.Tech / M.Tech in CS/AI',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Python', proficiency: 'Advanced', mandatory: true },
        { skillName: 'Machine Learning', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Deep Learning', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Pandas', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true }
      ],
      preferredSkills: ['PyTorch / TensorFlow', 'Generative AI / LLM Fine-Tuning', 'Vector Databases'],
      description: 'Develop state-of-the-art predictive models, NLP pipelines, and generative AI features embedded in enterprise products.',
      responsibilities: [
        'Train, evaluate, and fine-tune transformer models for domain tasks.',
        'Build scalable feature engineering pipelines processing terabytes of data.',
        'Deploy models as low-latency microservices with Triton or FastAPI.',
        'Monitor model drift and retrain pipelines with automated validation.'
      ]
    }
  ],
  'Electronics / Semiconductor': [
    {
      title: 'VLSI & Embedded Systems Design Intern',
      type: 'Internship',
      domain: 'Hardware & Silicon Engineering',
      duration: '6 Months',
      stipendOrSalary: '₹40,000 / month',
      stipendRange: '₹35,000 - ₹50,000 / mo',
      salaryRange: '₹15 - 20 LPA post PPO',
      workMode: 'On-site',
      location: 'Bengaluru / Hyderabad',
      minCgpa: 7.5,
      openings: 10,
      applicantCount: 112,
      eligibility: 'B.Tech / M.Tech in ECE / EEE / Microelectronics with solid understanding of digital logic and Verilog/C.',
      minQualification: 'B.Tech / M.Tech in ECE/EEE',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher / Lab Projects',
      requiredSkills: [
        { skillName: 'Data Structures', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Problem Solving', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Algorithms', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Python', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Verilog / SystemVerilog', 'C / C++ Embedded', 'FPGA Prototyping'],
      description: 'Contribute to RTL design, pre-silicon verification, and firmware integration for next-gen silicon chips.',
      responsibilities: [
        'Develop automated testbenches in SystemVerilog/UVM for block verification.',
        'Write low-level hardware abstraction firmware in C.',
        'Perform static timing analysis and power optimization trade-offs.',
        'Collaborate with physical design teams to resolve layout DRC violations.'
      ]
    }
  ],
  'Automotive': [
    {
      title: 'EV Telematics & Embedded Software Engineer',
      type: 'Full-Time Placement',
      domain: 'Electric Vehicles & Mobility Tech',
      stipendOrSalary: '₹9.0 - 13.0 LPA',
      salaryRange: '₹9 - 13 LPA',
      workMode: 'On-site',
      location: 'Pune / Bengaluru',
      minCgpa: 6.8,
      openings: 15,
      applicantCount: 84,
      eligibility: 'B.Tech in CS / ECE / Mechanical / Mechatronics with software coding competence.',
      minQualification: 'B.Tech / B.E.',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Problem Solving', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Networking', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Git', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['CAN Bus / OBD-II', 'Battery Management Systems (BMS)', 'MQTT / IoT'],
      description: 'Engineer software for electric vehicle clusters, connected telematics modules, and battery health analytics.',
      responsibilities: [
        'Write firmware drivers communicating over CAN bus protocols.',
        'Implement cloud synchronization algorithms for battery charge metrics.',
        'Test over-the-air (OTA) update security mechanisms on test bench vehicles.',
        'Diagnose field telemetry errors and collaborate on firmware patches.'
      ]
    }
  ],
  'Healthcare / HealthTech': [
    {
      title: 'HealthTech Systems & Data Intern',
      type: 'Internship + PPO',
      domain: 'Digital Health & Clinical Informatics',
      duration: '6 Months',
      stipendOrSalary: '₹28,000 / month',
      stipendRange: '₹25,000 - ₹35,000 / mo',
      salaryRange: '₹8 - 12 LPA post PPO',
      workMode: 'Hybrid',
      location: 'Bengaluru / Hyderabad',
      minCgpa: 7.0,
      openings: 8,
      applicantCount: 64,
      eligibility: 'B.Tech / MCA in CS / IT / Biomedical Engineering with passion for healthcare impact.',
      minQualification: 'B.Tech / MCA / B.E.',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher',
      requiredSkills: [
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'React', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Data Structures', proficiency: 'Beginner', mandatory: false },
        { skillName: 'Machine Learning', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['FHIR / HL7 Standards', 'HIPAA Privacy Compliance', 'REST APIs'],
      description: 'Build patient-centric digital tools, doctor consultation portals, and secure electronic health record systems.',
      responsibilities: [
        'Develop secure patient data exchange APIs complying with privacy norms.',
        'Build responsive clinician dashboards displaying lab diagnostic trends.',
        'Assist in automated medical record text extraction and summarization.',
        'Perform load testing on emergency teleconsultation video streams.'
      ]
    }
  ],
  'Manufacturing': [
    {
      title: 'Industry 4.0 & Smart Manufacturing Associate',
      type: 'Full-Time Placement',
      domain: 'Industrial IoT & Automation',
      stipendOrSalary: '₹8.0 - 11.5 LPA',
      salaryRange: '₹8 - 12 LPA',
      workMode: 'On-site',
      location: 'Vadodara / Mumbai / Bengaluru',
      minCgpa: 6.5,
      openings: 12,
      applicantCount: 55,
      eligibility: 'B.Tech in Mechanical / Electrical / CS / Instrumentation interested in factory automation.',
      minQualification: 'B.Tech / B.E.',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Python', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Intermediate', mandatory: false },
        { skillName: 'Problem Solving', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Docker', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['PLC / SCADA', 'Industrial IoT Protocols (Modbus/OPC-UA)', 'Time-Series Databases'],
      description: 'Deploy IoT sensor gateways, predictive equipment maintenance algorithms, and digital twins across modern manufacturing plants.',
      responsibilities: [
        'Aggregate vibration and temperature telemetry from factory plant equipment.',
        'Develop automated anomaly detection alerts for preventative maintenance.',
        'Visualize shop-floor yield and overall equipment effectiveness (OEE).',
        'Maintain edge computing servers situated inside factory control rooms.'
      ]
    }
  ],
  'EdTech': [
    {
      title: 'EdTech Web & Interactive Platform Intern',
      type: 'Internship',
      domain: 'Learning Platforms & Multimedia',
      duration: '3 Months',
      stipendOrSalary: '₹22,000 / month',
      stipendRange: '₹20,000 - ₹28,000 / mo',
      workMode: 'Remote',
      location: 'Bengaluru / Remote',
      minCgpa: 6.5,
      openings: 8,
      applicantCount: 78,
      eligibility: 'Passionate coders with good frontend foundation and interest in gamified educational products.',
      minQualification: 'B.Tech / B.Sc CS / BCA / MCA',
      graduationYears: [2025, 2026],
      experienceRequired: 'Fresher',
      requiredSkills: [
        { skillName: 'JavaScript', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'React', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'HTML', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'CSS', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Git', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Next.js', 'WebRTC Video Streaming', 'Canvas / HTML5 Games'],
      description: 'Build interactive quizzes, low-bandwidth video playback modules, and student progression analytics.',
      responsibilities: [
        'Create interactive problem-solving widgets for student learning apps.',
        'Optimize live lecture player controls for 2G/3G mobile connectivity.',
        'Implement peer discussion forums and gamified badge achievements.',
        'Participate in usability tests with school and college students.'
      ]
    }
  ],
  'Government / PSU Tech': [
    {
      title: 'Scientific Software & Public Infrastructure Engineer',
      type: 'Full-Time Placement',
      domain: 'Public Digital Infrastructure & Aerospace',
      stipendOrSalary: '₹8.5 - 12.0 LPA',
      salaryRange: '₹8 - 12 LPA',
      workMode: 'On-site',
      location: 'Bengaluru / New Delhi / Pune',
      minCgpa: 7.0,
      openings: 25,
      applicantCount: 190,
      eligibility: 'First Class B.Tech / B.E. / M.Tech in Computer Science / IT / Electronics from recognized universities.',
      minQualification: 'B.Tech / B.E. / M.Tech',
      graduationYears: [2025, 2026],
      experienceRequired: '0-1 Years',
      requiredSkills: [
        { skillName: 'Data Structures', proficiency: 'Advanced', mandatory: true },
        { skillName: 'Algorithms', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Linux', proficiency: 'Advanced', mandatory: true },
        { skillName: 'SQL', proficiency: 'Intermediate', mandatory: true },
        { skillName: 'Cybersecurity', proficiency: 'Beginner', mandatory: false }
      ],
      preferredSkills: ['Distributed Computing', 'High-Performance Computing (HPC)', 'Data Encryption'],
      description: 'Engineer sovereign software solutions, national payment switch architectures, and satellite data analytics for India.',
      responsibilities: [
        'Design secure, high-throughput computational algorithms for national digital initiatives.',
        'Hardening systems against cybersecurity threats and unauthorized intrusion.',
        'Conduct rigorous code audits and mathematical verification for critical missions.',
        'Author technical specifications and compliance documentation adhering to national standards.'
      ]
    }
  ]
};

// Generate 100+ opportunities across all 100 companies
export const INDUSTRY_OPPORTUNITIES: Opportunity[] = (() => {
  const opps: Opportunity[] = [];

  INDUSTRY_COMPANIES.forEach((company, index) => {
    const templates = ROLE_TEMPLATES[company.industry] || ROLE_TEMPLATES['Software / IT'];
    
    // Assign primary template
    const primaryTemplate = templates[index % templates.length];
    const isInternship = primaryTemplate.type === 'Internship' || primaryTemplate.type === 'Internship + PPO';
    
    opps.push({
      id: `opp-${company.id}-1`,
      opportunity_id: `opp-${company.id}-1`,
      companyId: company.id,
      company_id: company.id,
      companyName: company.name,
      title: `${primaryTemplate.title}`,
      type: isInternship ? 'Internship' : 'Job',
      opportunity_type: primaryTemplate.type,
      department: primaryTemplate.domain,
      domain: company.industry,
      location: primaryTemplate.location.split('/')[0].trim(),
      workMode: primaryTemplate.workMode,
      work_mode: primaryTemplate.workMode,
      duration: primaryTemplate.duration || (isInternship ? '6 Months' : undefined),
      stipendOrSalary: primaryTemplate.stipendOrSalary,
      stipendRange: primaryTemplate.stipendRange,
      salaryRange: primaryTemplate.salaryRange,
      eligibility: primaryTemplate.eligibility,
      minimumQualification: primaryTemplate.minQualification,
      minQualification: primaryTemplate.minQualification,
      graduationYears: primaryTemplate.graduationYears,
      graduationYear: '2025 / 2026',
      experienceRequired: primaryTemplate.experienceRequired,
      minCgpa: primaryTemplate.minCgpa,
      requiredSkills: primaryTemplate.requiredSkills,
      preferredSkills: primaryTemplate.preferredSkills,
      description: `${company.name} is seeking motivated talent. ${primaryTemplate.description}`,
      responsibilities: primaryTemplate.responsibilities,
      applicationDeadline: '2026-09-30',
      openings: primaryTemplate.openings,
      applicantCount: primaryTemplate.applicantCount,
      status: 'Open',
      opportunityStatus: 'Demo Opportunity Data',
      isDemoData: true,
      createdAt: '2026-03-01T00:00:00.000Z'
    });

    // For selected marquee companies (first 10), add a second complementary opportunity (internship or placement)
    if (index < 10 && templates.length > 1) {
      const secondaryTemplate = templates[(index + 1) % templates.length];
      const isSecInternship = secondaryTemplate.type === 'Internship' || secondaryTemplate.type === 'Internship + PPO';
      
      opps.push({
        id: `opp-${company.id}-2`,
        opportunity_id: `opp-${company.id}-2`,
        companyId: company.id,
        company_id: company.id,
        companyName: company.name,
        title: `${secondaryTemplate.title}`,
        type: isSecInternship ? 'Internship' : 'Job',
        opportunity_type: secondaryTemplate.type,
        department: secondaryTemplate.domain,
        domain: company.industry,
        location: secondaryTemplate.location.split('/')[1]?.trim() || secondaryTemplate.location.split('/')[0].trim(),
        workMode: secondaryTemplate.workMode,
        work_mode: secondaryTemplate.workMode,
        duration: secondaryTemplate.duration || (isSecInternship ? '3 Months' : undefined),
        stipendOrSalary: secondaryTemplate.stipendOrSalary,
        stipendRange: secondaryTemplate.stipendRange,
        salaryRange: secondaryTemplate.salaryRange,
        eligibility: secondaryTemplate.eligibility,
        minimumQualification: secondaryTemplate.minQualification,
        minQualification: secondaryTemplate.minQualification,
        graduationYears: secondaryTemplate.graduationYears,
        graduationYear: '2025 / 2026',
        experienceRequired: secondaryTemplate.experienceRequired,
        minCgpa: secondaryTemplate.minCgpa,
        requiredSkills: secondaryTemplate.requiredSkills,
        preferredSkills: secondaryTemplate.preferredSkills,
        description: `${company.name} is hosting technical selection rounds. ${secondaryTemplate.description}`,
        responsibilities: secondaryTemplate.responsibilities,
        applicationDeadline: '2026-10-15',
        openings: secondaryTemplate.openings,
        applicantCount: secondaryTemplate.applicantCount,
        status: 'Open',
        opportunityStatus: 'Demo Opportunity Data',
        isDemoData: true,
        createdAt: '2026-03-05T00:00:00.000Z'
      });
    }
  });

  return opps;
})();
