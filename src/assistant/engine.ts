import Fuse from 'fuse.js';
import { knowledgeBase } from '@/content/knowledge';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { KnowledgeEntry, Project } from '@/content/types';

export interface AssistantResponse {
  answer: string;
  relatedLinks?: string[];
  followUps?: string[];
  resolvedEntity?: string;
  isFallback?: boolean;
}

export interface AssistantState {
  lastEntityId?: string;
}

// 1. Synonym map for normalization
const SYNONYM_MAP: Record<string, string> = {
  stuff: 'projects',
  work: 'projects',
  portfolio: 'projects',
  built: 'projects',
  apps: 'projects',
  tech: 'stack',
  technology: 'stack',
  tools: 'stack',
  frameworks: 'stack',
  languages: 'stack',
  reach: 'contact',
  email: 'contact',
  touch: 'contact',
  connect: 'contact',
  awards: 'achievements',
  hackathons: 'achievements',
  winner: 'achievements',
};

// 2. Entity matchers (mapping tokens to known projects)
const PROJECT_ENTITIES: Record<string, string> = {
  safeware: 'safeware',
  safe: 'safeware',
  road: 'safeware',
  'road safety': 'safeware',
  trusight: 'trusight-ai',
  'trusight ai': 'trusight-ai',
  media: 'trusight-ai',
  deepfake: 'trusight-ai',
  authenticity: 'trusight-ai',
  afterclass: 'afterclass',
  school: 'afterclass',
  homework: 'afterclass',
  worldos: 'worldos',
  globe: 'worldos',
  '3d globe': 'worldos',
  zetklo: 'zetklo',
  ecommerce: 'zetklo',
  automotive: 'automotive-3d',
  car: 'automotive-3d',
  '3d automotive': 'automotive-3d',
};

// 3. Setup Fuse.js for fuzzy fallback
const fuseKnowledge = new Fuse(knowledgeBase, {
  keys: ['questionVariants', 'keywords', 'answer'],
  includeScore: true,
  threshold: 0.45,
});

/**
 * Normalizes text: lowercases, strips punctuation, and maps synonyms
 */
export function normalizeQuery(query: string): string {
  let cleaned = query.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const words = cleaned.split(/\s+/);
  const mapped = words.map((w) => SYNONYM_MAP[w] || w);
  return mapped.join(' ');
}

/**
 * Detects project entity from query or falls back to last session entity
 */
export function detectEntity(normalized: string, state?: AssistantState): { entityId?: string; wasFollowUp: boolean } {
  for (const [key, id] of Object.entries(PROJECT_ENTITIES)) {
    if (normalized.includes(key)) {
      return { entityId: id, wasFollowUp: false };
    }
  }

  // Check for follow-up pronouns referring to previous entity
  const isPronounRef =
    normalized.includes('it') ||
    normalized.includes('that') ||
    normalized.includes('this') ||
    normalized.includes('the project');

  if (isPronounRef && state?.lastEntityId) {
    return { entityId: state.lastEntityId, wasFollowUp: true };
  }

  return { entityId: undefined, wasFollowUp: false };
}

/**
 * Composes answers directly from verified Project records
 */
function composeProjectAnswer(proj: Project, normalized: string): AssistantResponse {
  // Intent: tech stack
  if (normalized.includes('stack') || normalized.includes('technologies') || normalized.includes('languages') || normalized.includes('frameworks')) {
    return {
      answer: `**${proj.name}** was developed using: ${proj.stack.join(', ')}.`,
      relatedLinks: proj.liveUrl ? [proj.liveUrl] : undefined,
      followUps: [`What problem does ${proj.name} solve?`, `Tell me about SafeWare`],
      resolvedEntity: proj.id,
    };
  }

  // Intent: achievements
  if (normalized.includes('achievements') || normalized.includes('awards') || normalized.includes('hackathon')) {
    if (proj.achievements && proj.achievements.length > 0) {
      return {
        answer: `**${proj.name}** achieved: ${proj.achievements.join(', ')}.`,
        relatedLinks: proj.liveUrl ? [proj.liveUrl] : undefined,
        followUps: [`What tech stack does ${proj.name} use?`, `Show me more projects`],
        resolvedEntity: proj.id,
      };
    } else {
      return {
        answer: `**${proj.name}** does not have verified hackathon awards attached. Rudar's verified award is Top 140 at the Delhi AI Grand Hackathon for SafeWare.`,
        followUps: [`Tell me about SafeWare`, `What are his skills?`],
        resolvedEntity: proj.id,
      };
    }
  }

  // Default Intent: Summary & Overview
  const featuresList = proj.features ? ` Key capabilities include: ${proj.features.join('; ')}.` : '';
  return {
    answer: `**${proj.name}**: ${proj.summary}${featuresList}`,
    relatedLinks: proj.liveUrl ? [proj.liveUrl] : undefined,
    followUps: [`What tech stack does ${proj.name} use?`, `How can I see it live?`],
    resolvedEntity: proj.id,
  };
}

/**
 * Main Assistant Query Pipeline
 */
export function queryAssistant(rawQuery: string, state?: AssistantState): AssistantResponse {
  if (!rawQuery || !rawQuery.trim()) {
    return {
      answer: "I am Rudar's portfolio assistant. Ask me about his projects, Flutter engineering, or verified hackathon achievements.",
      followUps: ['Who is Rudar?', 'Show me his best projects', 'What is SafeWare?'],
    };
  }

  const normalized = normalizeQuery(rawQuery);

  // Check entity detection
  const { entityId } = detectEntity(normalized, state);

  if (entityId) {
    const proj = projects.find((p) => p.id === entityId);
    if (proj) {
      return composeProjectAnswer(proj, normalized);
    }
  }

  // Intent: Achievements & Awards
  if (normalized.includes('achievements') || normalized.includes('awards') || normalized.includes('hackathon')) {
    const safeware = projects.find((p) => p.id === 'safeware');
    const achievementText = safeware?.achievements?.[0] || 'Top 140, Delhi AI Grand Hackathon';
    return {
      answer: `Rudar achieved **${achievementText}** with SafeWare, an AI-based road safety platform employing computer vision for hazard detection.`,
      relatedLinks: ['https://github.com/rudarsharma382-cell'],
      followUps: ['Tell me about SafeWare', 'What tech stack did it use?', 'What other projects exist?'],
      resolvedEntity: 'safeware',
    };
  }

  // Intent: Skills & Tech stack general
  if (normalized.includes('skills') || normalized.includes('languages') || (normalized.includes('stack') && !entityId)) {
    return {
      answer: `Rudar specializes in Flutter and Dart for cross-platform applications, along with TypeScript, React, Next.js, and WebGL / Three.js for interactive web interfaces, plus Python and computer vision workflows.`,
      relatedLinks: ['https://github.com/rudarsharma382-cell'],
      followUps: ['Tell me about SafeWare', 'What is TruSight AI?'],
    };
  }

  // Intent: General projects list
  if (normalized.includes('projects') || normalized.includes('list projects') || normalized.includes('best projects')) {
    const projectNames = projects.map((p) => `**${p.name}** (${p.stack.slice(0, 2).join(', ')})`).join(', ');
    return {
      answer: `Rudar's portfolio includes 6 verified projects: ${projectNames}. His featured work is **SafeWare** (Top 140, Delhi AI Grand Hackathon).`,
      relatedLinks: ['https://rudar.vercel.app/'],
      followUps: ['Tell me about SafeWare', 'What is TruSight AI?', 'What are his technical skills?'],
      resolvedEntity: 'safeware',
    };
  }

  // Intent: Contact / Socials
  if (normalized.includes('contact') || normalized.includes('hire') || normalized.includes('reach') || normalized.includes('socials')) {
    return {
      answer: `You can connect with Rudar on LinkedIn (linkedin.com/in/rudarsharma-dev) or inspect his code on GitHub (github.com/rudarsharma382-cell). You can also leave a message in the Notes app on this desktop.`,
      relatedLinks: ['https://linkedin.com/in/rudarsharma-dev/', 'https://github.com/rudarsharma382-cell'],
      followUps: ['Show me his Flutter projects', 'What is SafeWare?'],
    };
  }

  // Fuzzy Search over Knowledge Base
  const fuseResults = fuseKnowledge.search(normalized);

  if (fuseResults.length > 0 && fuseResults[0].score !== undefined && fuseResults[0].score < 0.42) {
    const match = fuseResults[0].item;
    return {
      answer: match.answer,
      relatedLinks: match.relatedLinks,
      followUps: match.followUps,
      resolvedEntity: match.id,
    };
  }

  // Middle band: Did you mean?
  if (fuseResults.length >= 2 && fuseResults[0].score !== undefined && fuseResults[0].score < 0.6) {
    const top2 = fuseResults.slice(0, 2).map((r) => r.item.questionVariants[0]);
    return {
      answer: `I am not completely certain about that specific phrasing. Did you mean to ask:`,
      followUps: top2,
      isFallback: true,
    };
  }

  // Honest Fallback per PRD Sec 10.1 (Never guess or make things up)
  return {
    answer: "I don't have that verified in my knowledge base. As Rudar's assistant, I only discuss confirmed facts about his projects, Flutter background, and hackathon results.",
    followUps: [
      'Who is Rudar Sharma?',
      'Tell me about SafeWare (Delhi AI Hackathon)',
      'What are his technical skills?',
    ],
    relatedLinks: ['https://linkedin.com/in/rudarsharma-dev/'],
    isFallback: true,
  };
}
