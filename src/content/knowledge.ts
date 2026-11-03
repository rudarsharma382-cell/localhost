import { KnowledgeEntry } from './types';

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'identity',
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
      'Rudar Sharma is a Flutter and app developer.',
    relatedLinks: ['https://linkedin.com/in/rudarsharma-dev/', 'https://github.com/rudarsharma382-cell'],
    followUps: ['Show me his projects', 'What is SafeWare?', 'What awards has he won?'],
  },
  {
    id: 'skills',
    category: 'skills',
    questionVariants: [
      'what are his skills',
      'what is his tech stack',
      'what technologies does he use',
      'technical skills',
    ],
    keywords: ['skills', 'tech', 'stack', 'flutter', 'dart'],
    answer:
      'Rudar specializes in Flutter and app development.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['Tell me about SafeWare', 'What is TruSight AI?'],
  },
  {
    id: 'achievement',
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
      'SafeWare reached Top 140 at the Delhi AI Grand Hackathon.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['Tell me about SafeWare', 'Show me all projects'],
  },
  {
    id: 'safeware',
    category: 'projects',
    questionVariants: [
      'tell me about safeware',
      'what is safeware',
      'how does safeware work',
    ],
    keywords: ['safeware', 'road safety', 'computer vision', 'ai'],
    answer:
      'SafeWare is an AI-based road safety project that uses computer vision for hazard detection. It reached Top 140 at the Delhi AI Grand Hackathon.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['What awards has he won?', 'Show me other projects'],
  },
  {
    id: 'trusight',
    category: 'projects',
    questionVariants: [
      'what is trusight ai',
      'tell me about trusight',
      'media authenticity detection',
    ],
    keywords: ['trusight', 'authenticity', 'media', 'deepfake', 'multi-model'],
    answer:
      'TruSight AI is an AI media authenticity detection project with multi-model analysis, aggregation, and offline fallback.',
    relatedLinks: ['https://github.com/rudarsharma382-cell'],
    followUps: ['Tell me about SafeWare', 'Show me WorldOS'],
  },
  {
    id: 'worldos',
    category: 'projects',
    questionVariants: [
      'what is worldos',
      'tell me about worldos',
      '3d globe visualization',
    ],
    keywords: ['worldos', 'globe', '3d', 'visualization', 'data'],
    answer:
      'WorldOS is a real-time global data visualization with an interactive 3D globe and multiple data layers.',
    relatedLinks: ['https://rudar.vercel.app/'],
    followUps: ['Tell me about SafeWare', 'How can I connect with him?'],
  },
  {
    id: 'contact',
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
      'You can connect with Rudar on LinkedIn (linkedin.com/in/rudarsharma-dev) or GitHub (github.com/rudarsharma382-cell). You can also leave a message in the Notes app.',
    relatedLinks: [
      'https://linkedin.com/in/rudarsharma-dev/',
      'https://github.com/rudarsharma382-cell',
    ],
    followUps: ['Tell me about his Flutter work', 'Show me his achievements'],
  },
];
