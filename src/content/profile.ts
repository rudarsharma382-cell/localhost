import { Profile } from './types';

export const profile: Profile = {
  name: 'Rudar Sharma',
  intro: 'A dedicated STEM student passionate about software engineering, artificial intelligence, robotics, and entrepreneurship. Experienced in Python programming, frontend web development, and AI-assisted development workflows. Currently mastering backend systems and mobile application development using Flutter.',
  avatar: '/assets/rudar-avatar.jpg',
  skills: [
    'Flutter',
    'Dart',
    'Python & AI Workflows',
    'Computer Vision',
    'Robotics Programming',
    'Three.js & WebGL',
    'Full-Stack Web Development',
    'Edge AI Optimization',
  ],
  interests: [
    'Robotics & Autonomous Systems',
    'AI-Powered Road Safety (SafeWare)',
    'Synthetic Media Forensics (TruSight)',
    '3D Interactive Experiences',
    'Scalable Classroom Platforms (AfterClass)',
  ],
  links: [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rudarsharma-dev/',
      icon: 'linkedin',
      description: 'Professional profile and engineering network',
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
      description: 'Live deployment and personal portfolio',
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
