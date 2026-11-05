import { profile } from './profile';
import { projects } from './projects';
import { socials } from './socials';
import { knowledgeBase } from './knowledge';
import {
  ProfileSchema,
  ProjectSchema,
  SocialLinkSchema,
  KnowledgeEntrySchema,
  Profile,
  Project,
  SocialLink,
  KnowledgeEntry,
} from './types';

export * from './types';
export { profile } from './profile';
export { projects } from './projects';
export { socials } from './socials';
export { knowledgeBase } from './knowledge';
export { resumeData } from './resume';
export { certificates } from './certificates';
export { developerData } from './developer';
export { physicsPresets } from './physics';
export { galleryItems } from './gallery';

/**
 * Validates all content in the project against Zod schemas.
 * Throws an error if any schema fails.
 */
export function validateAllContent(): {
  profile: Profile;
  projects: Project[];
  socials: SocialLink[];
  knowledge: KnowledgeEntry[];
} {
  const validatedProfile = ProfileSchema.parse(profile);
  const validatedProjects = projects.map((p, idx) => {
    try {
      return ProjectSchema.parse(p);
    } catch (err) {
      throw new Error(`Project at index ${idx} (${p.id || 'unknown'}) failed validation: ${err}`);
    }
  });
  const validatedSocials = socials.map((s, idx) => {
    try {
      return SocialLinkSchema.parse(s);
    } catch (err) {
      throw new Error(`SocialLink at index ${idx} (${s.id || 'unknown'}) failed validation: ${err}`);
    }
  });
  const validatedKnowledge = knowledgeBase.map((k, idx) => {
    try {
      return KnowledgeEntrySchema.parse(k);
    } catch (err) {
      throw new Error(`KnowledgeEntry at index ${idx} (${k.id || 'unknown'}) failed validation: ${err}`);
    }
  });

  return {
    profile: validatedProfile,
    projects: validatedProjects,
    socials: validatedSocials,
    knowledge: validatedKnowledge,
  };
}

