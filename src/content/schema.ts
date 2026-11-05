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

/**
 * ------------------------------------------------------------------
 * 1. Resume Schema
 * ------------------------------------------------------------------
 */
export const ResumeSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.string(),
  summary: z.string(),
  pdfUrl: z.string(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
      icon: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      period: z.string(),
      score: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      period: z.string(),
      location: z.string(),
      description: z.string(),
      achievements: z.array(z.string()),
      stack: z.array(z.string()),
    })
  ),
  skills: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    tools: z.array(z.string()),
    specialties: z.array(z.string()),
  }),
  achievements: z.array(
    z.object({
      title: z.string(),
      org: z.string(),
      date: z.string(),
      description: z.string(),
      badge: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      period: z.string(),
      summary: z.string(),
      stack: z.array(z.string()),
      link: z.string().optional(),
    })
  ),
});

export type ResumeData = z.infer<typeof ResumeSchema>;

/**
 * ------------------------------------------------------------------
 * 2. Certificate Schema
 * ------------------------------------------------------------------
 */
export const CertificateCategorySchema = z.enum([
  'AI & Machine Learning',
  'Systems & Cloud',
  'Web & Mobile',
  'Cybersecurity',
  'Hackathons & Honors',
]);

export type CertificateCategory = z.infer<typeof CertificateCategorySchema>;

export const CertificateSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  category: CertificateCategorySchema,
  credentialId: z.string().optional(),
  verificationUrl: z.string().optional(),
  image: z.string(),
  skills: z.array(z.string()),
  description: z.string(),
});

export type Certificate = z.infer<typeof CertificateSchema>;

/**
 * ------------------------------------------------------------------
 * 3. Developer Console Schema
 * ------------------------------------------------------------------
 */
export const DeveloperItemSchema = z.object({
  name: z.string(),
  level: z.enum(['Expert', 'Advanced', 'Proficient', 'Exploring']),
  experienceYears: z.number(),
  description: z.string(),
  tag: z.string(),
  projects: z.array(z.string()),
  iconKey: z.string().optional(),
});

export const DeveloperCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(DeveloperItemSchema),
});

export const LiveTechNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  status: z.enum(['Active Production', 'Benchmarked', 'Exploratory Prototype']),
  category: z.string(),
  summary: z.string(),
  impact: z.string(),
  stack: z.array(z.string()),
});

export const DeveloperDataSchema = z.object({
  categories: z.array(DeveloperCategorySchema),
  notes: z.array(LiveTechNoteSchema),
  systemVitals: z.object({
    kernel: z.string(),
    runtime: z.string(),
    targetArch: z.string(),
    lastRefreshed: z.string(),
  }),
});

export type DeveloperItem = z.infer<typeof DeveloperItemSchema>;
export type DeveloperCategory = z.infer<typeof DeveloperCategorySchema>;
export type LiveTechNote = z.infer<typeof LiveTechNoteSchema>;
export type DeveloperData = z.infer<typeof DeveloperDataSchema>;

/**
 * ------------------------------------------------------------------
 * 4. Physics Playground Schema
 * ------------------------------------------------------------------
 */
export const PhysicsParamDefSchema = z.object({
  id: z.string(),
  label: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  unit: z.string(),
});

export const PhysicsPresetSchema = z.object({
  id: z.enum(['gravity', 'particles', 'collisions', 'pendulum']),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  formula: z.string(),
  theory: z.string(),
  defaultParams: z.record(z.string(), z.number()),
  paramDefs: z.array(PhysicsParamDefSchema),
});

export type PhysicsParamDef = z.infer<typeof PhysicsParamDefSchema>;
export type PhysicsPreset = z.infer<typeof PhysicsPresetSchema>;

/**
 * ------------------------------------------------------------------
 * 5. Gallery Schema
 * ------------------------------------------------------------------
 */
export const GalleryAlbumSchema = z.enum([
  'Robotics & Hardware',
  'Hackathons & Summits',
  'Workshops & Labs',
  'Behind The Scenes',
]);

export type GalleryAlbum = z.infer<typeof GalleryAlbumSchema>;

export const GalleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  album: GalleryAlbumSchema,
  mediaType: z.enum(['image', 'video']),
  src: z.string(),
  thumbnail: z.string(),
  aspectRatio: z.enum(['16:9', '4:3', '1:1', '9:16']),
  caption: z.string(),
  location: z.string(),
  equipment: z.array(z.string()),
  tags: z.array(z.string()),
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;


