import { Profile } from './types';

export const profile: Profile = {
  name: 'Rudar Sharma',
  intro: 'TODO: Rudar to provide short 1-2 sentence introduction',
  avatar: '/avatar.png', // TODO: Rudar to provide avatar image file in public/avatar.png
  skills: [
    'Flutter',
    'Dart',
    'Mobile Application Development',
    'Full-Stack Web Development',
    'TypeScript',
    'React',
    'Next.js',
  ],
  interests: [
    'TODO: Rudar to specify technical interests and engineering areas of focus',
  ],
  links: [
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/rudarsharma382-cell',
      icon: 'github',
      description: 'Open-source repositories and code contributions',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rudarsharma-dev/',
      icon: 'linkedin',
      description: 'Professional background, network, and updates',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      url: 'https://rudar.vercel.app/',
      icon: 'globe',
      description: 'Current web deployment',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/codealchemist_07/',
      icon: 'instagram',
      description: 'Developer journey and community notes',
    },
  ],
};

