import { z } from 'zod';

/**
 * Helper to check if a value is a TODO marker
 */
export function isTodo(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.startsWith('TODO:') || value === 'TODO';
  }
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'string') {
    return value[0].startsWith('TODO:');
  }
  return false;
}

export function extractTodoMessage(value: string): string {
  return value.replace(/^TODO:\s*/, '').trim();
}

/**
 * SocialLink Schema
 */
export const SocialLinkSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  icon: z.string(), // identifier for custom icon rendering
  description: z.string(),
});

/**
 * Profile Schema
 */
export const ProfileSchema = z.object({
  name: z.string(),
  intro: z.string(),
  avatar: z.string(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  links: z.array(SocialLinkSchema),
});

/**
 * Project Media Schema
 */
export const ProjectMediaSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string(),
  alt: z.string(),
});

/**
 * Project Schema
 */
export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  problem: z.string().optional(),
  why: z.string().optional(),
  features: z.array(z.string()).optional(),
  stack: z.array(z.string()),
  contribution: z.string().optional(),
  media: z.array(ProjectMediaSchema).optional(),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  embed: z.enum(['auto', 'never']),
  achievements: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  preview: z.string().optional(),
});

/**
 * Knowledge Entry Schema
 */
export const KnowledgeEntrySchema = z.object({
  id: z.string(),
  category: z.string(),
  questionVariants: z.array(z.string()),
  keywords: z.array(z.string()),
  answer: z.string(),
  relatedLinks: z.array(z.string()).optional(),
  followUps: z.array(z.string()).optional(),
});

/**
 * Visitor Note Schema
 */
export const VisitorNoteSchema = z.object({
  id: z.string(),
  visitorName: z.string().max(60).optional(),
  message: z.string().min(1).max(1000),
  category: z.enum(['feedback', 'collaboration', 'general']),
  createdAt: z.string(),
  status: z.enum(['pending', 'reviewed', 'hidden']),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type ProjectMedia = z.infer<typeof ProjectMediaSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type KnowledgeEntry = z.infer<typeof KnowledgeEntrySchema>;
export type VisitorNote = z.infer<typeof VisitorNoteSchema>;

