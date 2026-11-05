import { ResumeData, ResumeSchema } from './schema';

export const resumeData: ResumeData = ResumeSchema.parse({
  name: 'Rudar Sharma',
  title: 'Student Developer',
  location: 'Delhi, India',
  email: 'rudarsharma.dev@gmail.com',
  summary:
    'Class 10 student in Delhi who builds real products across web, Flutter apps and AI. Strongest in web development, with client websites, hackathon projects and startup collaborations behind me. Most curious about where software, AI and hardware meet.',
  pdfUrl: '/resume.pdf',
  links: [
    {
      label: 'Portfolio',
      url: 'https://rudar.vercel.app',
      icon: 'globe',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/rudarsharma382-cell',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/rudarsharma-dev',
      icon: 'linkedin',
    },
    {
      label: 'SafeWare',
      url: 'https://safeware-woad.vercel.app',
      icon: 'globe',
    },
  ],
  education: [
    {
      degree: 'Class 10, CBSE (2026 to 2027) — STEM Stream',
      institution: 'CM Shri School, Sector 18, Rohini, Delhi',
      period: '2026 — 2027',
      score: 'Top Percentile',
      highlights: [
        'Selected for the prestigious STEM stream at SoSE Rohini Sector 18 in Class 9',
        'Top 5 in Delhi in the JNV Entrance Examination',
        'Head of Tech & Robotics Club; mentoring cohorts in competitive coding and hardware projects',
      ],
    },
  ],
  experience: [
    {
      role: 'Web & App Developer',
      company: 'Hoollow',
      period: 'Left Aug 2026',
      location: 'Remote',
      description:
        'Worked on responsive website and app development, supported outreach, sponsor communications, and technical hiring pipelines.',
      achievements: [
        'Architected core frontend interface modules and cross-platform app views',
        'Helped grow the Hoollow LinkedIn community and follower base from 15 to 150+ actively engaged engineers',
        'Streamlined sponsor onboarding and technical partner communications',
      ],
      stack: ['Flutter', 'Dart', 'Web Development', 'Community Growth', 'Git'],
    },
    {
      role: 'Freelance & Client Web Developer',
      company: 'Divine Herbalife & Bielco Digital',
      period: '2025 — Present',
      location: 'Delhi / Remote',
      description:
        'Built full-scale production client websites and collaborated on digital engineering at Bielco covering websites, SEO, and GEO analytics.',
      achievements: [
        'Designed and delivered the complete business website for Divine Herbalife as a foundational commercial delivery',
        'Delivered responsive client projects at Bielco with modern web performance, local SEO optimization, and GEO targeting',
        'Maintained sub-second core web vitals across mobile and desktop viewport profiles',
      ],
      stack: ['JavaScript', 'HTML5/CSS3', 'SEO', 'GEO Analytics', 'Responsive Design', 'Three.js'],
    },
    {
      role: 'Startup Collaborator & Frontend Engineer',
      company: 'Kubi & Zetklo',
      period: '2025 — 2026',
      location: 'Remote',
      description:
        'Collaborated with early-stage tech startups on responsive web platforms, brand visibility, and organic growth infrastructure.',
      achievements: [
        'Built modern landing pages and interactive product prototypes for Kubi and Zetklo',
        'Integrated automated SEO optimization, social OpenGraph cards, and developer portfolio showcases',
        'Coordinated technical content strategy to strengthen startup digital presence and community discovery',
      ],
      stack: ['Web Architecture', 'Next.js', 'React', 'SEO Optimization', 'LinkedIn Growth'],
    },
  ],
  skills: {
    languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Dart', 'C++', 'SQL'],
    frameworks: ['Flutter', 'Three.js / React Three Fiber', 'React', 'Next.js', 'Serverpod'],
    tools: ['Git & GitHub', 'VS Code', 'Antigravity IDE', 'ADB Android Testing', 'Google Auth', 'SQLite', 'Neon'],
    specialties: [
      'Gemini & LLM Integration (Hugging Face, Ollama)',
      'Edge Computer Vision',
      'Hardware Prototyping (Arduino, ESP32, IoT)',
      'Responsive Web Architecture & SEO',
      'Tactile OS Interface Design',
    ],
  },
  achievements: [
    {
      title: 'Top 140 Nationwide — Delhi AI Grand Hackathon',
      org: 'Delhi AI Grand Hackathon (~5 Lakh Participants)',
      date: '2026',
      description:
        'Ranked among the Top 140 teams across India with SafeWare AI, an intelligent driver fatigue and hazard detection platform.',
      badge: 'Top 140 India',
    },
    {
      title: 'ISRO Official Visit Selection (Bengaluru)',
      org: 'Indian Space Research Organisation (ISRO)',
      date: 'Nov 30 — Dec 4, 2026',
      description:
        'One of only 110 Class 10 students selected across all Delhi schools for an official educational delegation visit to ISRO Bengaluru.',
      badge: 'State Selected',
    },
    {
      title: 'Top 5 in Delhi — JNV Entrance Examination',
      org: 'Jawahar Navodaya Vidyalaya Selection',
      date: 'Class 6 Cohort',
      description:
        'Secured rank in the Top 5 candidates across the entire Delhi region in the competitive entrance evaluation.',
      badge: 'Top 5 Delhi',
    },
    {
      title: 'Finalist — Delhi AI Grind (District Level)',
      org: 'Delhi Govt Dept of Education & NEEEV',
      date: '2026',
      description:
        'Advanced as district-level finalist in Delhi AI Grind, demonstrating civic-scale AI problem-solving and rapid prototyping.',
      badge: 'District Finalist',
    },
    {
      title: 'Google Gurugram AI Skills House Phase II Invite',
      org: 'Google & Ministry of I&B',
      date: '2026',
      description:
        'Successfully completed AI Skills House Phase I and received official invitation to Phase II on-site at Google HQ, Gurugram.',
      badge: 'Google Phase II',
    },
    {
      title: 'National Robotics League Bootcamp Completion',
      org: 'National Robotics League',
      date: 'Oct 2026',
      description:
        'Completed rigorous hands-on robotics bootcamp in autonomous control algorithms, kinematics, and sensor telemetry.',
      badge: 'Honors',
    },
    {
      title: 'Shenzhen Maker Faire (Hack Club Fallen) Invitation',
      org: 'Hack Club Fallen',
      date: 'Dec 2026',
      description:
        'Invited international participant for Hack Club Fallen maker contingent at the Shenzhen Maker Faire in China.',
      badge: 'Global Invite',
    },
    {
      title: 'Top 50 — Indian Oil Quiz at Scope Complex',
      org: 'Indian Oil Corporation',
      date: '2026',
      description:
        'Ranked in Top 50 scholars at the prestigious Scope Complex Delhi quiz championship testing scientific and industrial aptitude.',
      badge: 'Top 50',
    },
  ],
  projects: [
    {
      name: 'SafeWare AI',
      role: 'AI Road Safety System',
      period: '2026',
      summary:
        'School project exploring driver health and fatigue monitoring with computer vision, GPS location sharing and automated emergency response alerts. Reached Top 140 in Delhi AI Grand Hackathon among ~5 lakh participants.',
      stack: ['Computer Vision', 'Python', 'GPS Telemetry', 'Driver Safety', 'Edge AI'],
      link: 'https://safeware-woad.vercel.app',
    },
    {
      name: 'TruSight AI',
      role: 'Media Forensics Engine',
      period: '2026',
      summary:
        'Verifies whether digital media is AI-generated or synthetic by aggregating and averaging confidence scoring from Hugging Face models, BitMind, and Sightengine with offline Python fallback. Reached over 1,600 reel impressions.',
      stack: ['Deepfake Forensics', 'Hugging Face', 'BitMind', 'Sightengine', 'Python API'],
      link: 'https://github.com/rudarsharma382-cell',
    },
    {
      name: 'AfterClass',
      role: 'Flutter School App',
      period: '2026',
      summary:
        'Custom application designed for Class 10A as a calm, distraction-free alternative to WhatsApp for academic coordination: teacher-uploaded homework, submission tracking, and class notifications in one place.',
      stack: ['Flutter', 'Dart', 'Mobile UX', 'Local Storage', 'Education Tech'],
      link: 'https://github.com/rudarsharma382-cell',
    },
    {
      name: 'ServerCraft',
      role: 'Product Concept & Infrastructure',
      period: '2026',
      summary:
        'Accessible community Minecraft server hosting infrastructure: unified website, Android monitoring client, interactive server dashboard, real-time player and resource stats, and uptime status pinging.',
      stack: ['Web Dashboard', 'Android Client', 'Server Orchestration', 'Live Telemetry', 'Networking'],
      link: 'https://github.com/rudarsharma382-cell',
    },
    {
      name: 'WorldOS',
      role: '3D Web Geospatial System',
      period: '2026',
      summary:
        'Interactive 3D Earth digital twin that layers global aviation corridors, maritime tracking, orbital satellite passes, seismic telemetry, and weather radars with live camera streams and area briefings. Built with Serverpod.',
      stack: ['Three.js', '3D Geospatial', 'Serverpod', 'Dart', 'Live Satellite Feeds'],
      link: 'https://github.com/rudarsharma382-cell',
    },
  ],
});
