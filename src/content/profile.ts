import { Profile } from './types';

export const profile: Profile = {
  name: 'Rudar Sharma',
  intro: 'TODO: Rudar to provide 1-2 sentence introduction',
  avatar: '/avatar.png',
  skills: [
    'Flutter',
    'App Development',
  ],
  interests: [
    'TODO: Rudar to provide technical interests',
  ],
  links: [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rudarsharma-dev/',
      icon: 'linkedin',
      description: 'Professional profile and background',
    },
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/rudarsharma382-cell',
      icon: 'github',
      description: 'Source code and open-source repositories',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      url: 'https://rudar.vercel.app/',
      icon: 'globe',
      description: 'Personal web deployment',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/codealchemist_07/',
      icon: 'instagram',
      description: 'Engineering notes and mobile experiments',
    },
  ],
};
