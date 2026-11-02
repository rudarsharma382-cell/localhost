import { KnowledgeEntry } from './types';

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'identity-role',
    category: 'identity',
    questionVariants: [
      'who is rudar',
      'who is rudar sharma',
      'tell me about rudar',
      'what does rudar do',
      'about rudar',
    ],
    keywords: ['rudar', 'sharma', 'developer', 'who', 'about', 'role'],
    answer:
      'Rudar Sharma is a Flutter and app developer specializing in mobile and web applications, real-time interactive interfaces, and computer vision integration.',
    relatedLinks: ['https://linkedin.com/in/rudarsharma-dev/', 'https://github.com/rudarsharma382-cell'],
    followUps: ['Show me his projects', 'What has he built with AI?', 'What are his technical skills?'],
  },
  {
    id: 'skills-tech',
    category: 'skills',
    questionVariants: [
      'what are his skills',
      'what is his tech stack',
      'what technologies does he use',
      'technical skills',
      'programming languages',
    ],
    keywords: ['skills', 'tech', 'stack', 'languages', 'frameworks', 'flutter', 'dart'],
    answer:
      'Rudar specializes in Flutter and Dart for cross-platform applications, along with TypeScript, React, Next.js, and WebGL / Three.js for interactive web interfaces, plus Python and computer vision workflows.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['Tell me about SafeWare', 'What is TruSight AI?'],
  },
  {
    id: 'hackathon-safeware',
    category: 'achievements',
    questionVariants: [
      'what awards has he won',
      'what are his achievements',
      'tell me about delhi ai hackathon',
      'hackathon achievements',
      'safeware achievement',
    ],
    keywords: ['achievement', 'award', 'hackathon', 'delhi', 'top 140', 'safeware'],
    answer:
      'Rudar achieved Top 140 at the Delhi AI Grand Hackathon with SafeWare, an AI-based road safety platform employing computer vision for hazard detection.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['How does SafeWare work?', 'What other AI projects has he built?'],
  },
  {
    id: 'project-safeware',
    category: 'projects',
    questionVariants: [
      'tell me about safeware',
      'what is safeware',
      'how does safeware work',
    ],
    keywords: ['safeware', 'road safety', 'computer vision', 'ai'],
    answer:
      'SafeWare is an AI-based road safety project that uses computer vision to analyze live video feeds for hazards and road risks. It reached Top 140 at the Delhi AI Grand Hackathon.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['What tech stack did it use?', 'What other projects exist?'],
  },
  {
    id: 'project-trusight',
    category: 'projects',
    questionVariants: [
      'what is trusight ai',
      'tell me about trusight',
      'media authenticity detection',
    ],
    keywords: ['trusight', 'authenticity', 'media', 'deepfake', 'multi-model'],
    answer:
      'TruSight AI is an AI media authenticity detection system combining multi-model analysis, aggregation logic, and offline fallback capabilities.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['What stack does TruSight AI use?', 'Tell me about WorldOS'],
  },
  {
    id: 'project-worldos',
    category: 'projects',
    questionVariants: [
      'what is worldos',
      'tell me about worldos',
      '3d globe visualization',
    ],
    keywords: ['worldos', 'globe', '3d', 'visualization', 'data'],
    answer:
      'WorldOS is a real-time global data visualization interface featuring an interactive 3D globe and multiple telemetry layers.',
    relatedLinks: ['https://rudar.vercel.app/'],
    followUps: ['Can I see it in the Browser app?', 'What other 3D work has he done?'],
  },
  {
    id: 'contact-socials',
    category: 'contact',
    questionVariants: [
      'how to contact rudar',
      'how can i reach him',
      'get in touch',
      'contact information',
      'social links',
    ],
    keywords: ['contact', 'reach', 'connect', 'email', 'socials', 'linkedin', 'github'],
    answer:
      'You can reach Rudar via LinkedIn (linkedin.com/in/rudarsharma-dev) or inspect his code on GitHub (github.com/rudarsharma382-cell). You can also leave a message in the Notes app on this desktop.',
    relatedLinks: [
      'https://linkedin.com/in/rudarsharma-dev/',
      'https://github.com/rudarsharma382-cell',
    ],
    followUps: ['Tell me about his Flutter background', 'Show me his achievements'],
  },
];
