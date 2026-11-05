import { DeveloperData, DeveloperDataSchema } from './schema';

export const developerData: DeveloperData = DeveloperDataSchema.parse({
  systemVitals: {
    kernel: 'RudarOS Microkernel v0.4.2 (React 19 / Next.js 15.5)',
    runtime: 'V8 JIT / Edge WebAssembly Runtime',
    targetArch: 'Cross-Platform Mobile & Web Native (POSIX / ARM64 / x86_64)',
    lastRefreshed: 'November 2026',
  },
  categories: [
    {
      id: 'languages',
      title: 'Programming Languages',
      description: 'Core syntax and runtime environments used across production systems.',
      items: [
        {
          name: 'Dart',
          level: 'Expert',
          experienceYears: 2.5,
          tag: 'Primary Mobile',
          description:
            'Deep expertise in asynchronous isolates, sound null safety, and clean widget rendering pipelines.',
          projects: ['AfterClass', 'Axlero Mobile Client', 'Mobile Prototypes'],
          iconKey: 'dart',
        },
        {
          name: 'Python',
          level: 'Expert',
          experienceYears: 3,
          tag: 'AI & Systems',
          description:
            'Extensive implementation of computer vision pipelines, neural inference scripts, and automated deployment agents.',
          projects: ['SafeWare AI', 'TruSight AI', 'Hackathon Telemetry'],
          iconKey: 'python',
        },
        {
          name: 'TypeScript',
          level: 'Advanced',
          experienceYears: 2,
          tag: 'Type-Safe Web',
          description:
            'Strict type system patterns, generic data transformers, and scalable frontend state architectures.',
          projects: ['Rudar OS', 'ServerCraft Console', 'Zetklo Store'],
          iconKey: 'typescript',
        },
        {
          name: 'C++',
          level: 'Proficient',
          experienceYears: 2,
          tag: 'Hardware & Systems',
          description:
            'Low-level memory management, embedded microcontroller programming (Arduino / ESP32), and robotics drivers.',
          projects: ['Robotics Sensor Interfacing', 'Embedded Rig Controls'],
          iconKey: 'cpp',
        },
        {
          name: 'SQL & Database Querying',
          level: 'Proficient',
          experienceYears: 1.5,
          tag: 'Data Persistence',
          description:
            'Relational schema design, index optimization, and transactional safety for user data and assignments.',
          projects: ['AfterClass DB', 'ServerCraft Telemetry Storage'],
          iconKey: 'sql',
        },
      ],
    },
    {
      id: 'frameworks',
      title: 'Frameworks & Engines',
      description: 'Application frameworks and rendering engines powering responsive user experiences.',
      items: [
        {
          name: 'Flutter SDK',
          level: 'Expert',
          experienceYears: 2.5,
          tag: 'Cross-Platform UI',
          description:
            'Custom RenderObjects, BLoC/Riverpod state architectures, and smooth 60fps animations across iOS and Android.',
          projects: ['AfterClass', 'Innovexis Client Engine'],
          iconKey: 'flutter',
        },
        {
          name: 'React & Next.js',
          level: 'Advanced',
          experienceYears: 2,
          tag: 'Web Platform',
          description:
            'Server Components, dynamic route handlers, client-side window management, and zero-compromise performance.',
          projects: ['Rudar OS', 'Portfolio 3D', 'SafeWare Dashboard'],
          iconKey: 'nextjs',
        },
        {
          name: 'Three.js / React Three Fiber',
          level: 'Advanced',
          experienceYears: 1.5,
          tag: '3D & WebGL',
          description:
            'Spatial scene graphs, GLTF/GLB asset optimization, PBR shaders, and memory-safe WebGL context disposal.',
          projects: ['Rudar OS 3D Room', 'BMW M4 CSL 3D', 'Sandbox 3D Configurator'],
          iconKey: 'threejs',
        },
        {
          name: 'Tailwind CSS',
          level: 'Expert',
          experienceYears: 2.5,
          tag: 'Design System',
          description:
            'Token-driven design architectures, tactile micro-interactions, responsive fluid grids, and dark-mode glassmorphism.',
          projects: ['Rudar OS Design System', 'Zetklo Store', 'Monolith House'],
          iconKey: 'tailwind',
        },
      ],
    },
    {
      id: 'systems',
      title: 'DevOps & Systems Architecture',
      description: 'Infrastructure, containerization, and build pipelines.',
      items: [
        {
          name: 'Docker & Containers',
          level: 'Proficient',
          experienceYears: 1.5,
          tag: 'Orchestration',
          description:
            'Multi-stage Dockerfiles, dynamic container provisioning, volume snapshotting, and resource limit sandboxing.',
          projects: ['ServerCraft', 'Local Testing Harnesses'],
          iconKey: 'docker',
        },
        {
          name: 'Linux & POSIX Shell',
          level: 'Advanced',
          experienceYears: 2.5,
          tag: 'Environments',
          description:
            'Automated shell scripting, systemd service management, SSH tunneling, and air-gapped forensic sandboxing.',
          projects: ['ServerCraft', 'SafeWare Edge Box'],
          iconKey: 'linux',
        },
        {
          name: 'Git & Version Control',
          level: 'Expert',
          experienceYears: 3,
          tag: 'Collaboration',
          description:
            'Branching strategies, history refactoring, large binary management with Git LFS, and collaborative reviews.',
          projects: ['All GitHub Repositories'],
          iconKey: 'git',
        },
      ],
    },
    {
      id: 'ai-edge',
      title: 'Edge AI & Computer Vision',
      description: 'On-device machine learning models and spatial video processing.',
      items: [
        {
          name: 'OpenCV & Video Streams',
          level: 'Advanced',
          experienceYears: 2,
          tag: 'Vision Processing',
          description:
            'Real-time frame extraction, color space normalization, optical flow calculations, and bounding box telemetry.',
          projects: ['SafeWare AI', 'TruSight AI'],
          iconKey: 'opencv',
        },
        {
          name: 'TensorFlow Lite & Edge ML',
          level: 'Proficient',
          experienceYears: 1.5,
          tag: 'Mobile Inference',
          description:
            'Model quantization (INT8/FP16), hardware acceleration delegate setup, and sub-15ms edge inference execution.',
          projects: ['SafeWare Edge Node'],
          iconKey: 'tflite',
        },
      ],
    },
  ],
  notes: [
    {
      id: 'note-afterclass-arch',
      title: 'Why Flutter & Sound Null-Safety for AfterClass instead of React Native',
      date: 'Oct 2024',
      status: 'Active Production',
      category: 'Mobile Architecture',
      summary:
        'Selected Flutter for AfterClass to eliminate the JavaScript-Native thread bridge bottleneck. Dart isolates handle background attachment downloads and file decryptions without dropping single UI animation frames.',
      impact:
        'Zero dropped frames during 200+ homework item listings; instantaneous offline-first caching for classroom materials.',
      stack: ['Flutter', 'Dart', 'BLoC', 'SQLite'],
    },
    {
      id: 'note-safeware-latency',
      title: 'Sub-15ms Edge Inference Pipeline for SafeWare Road Hazard Detection',
      date: 'Aug 2024',
      status: 'Benchmarked',
      category: 'Edge AI & CV',
      summary:
        'Benchmarked mobile edge vision against cloud inference. Cloud round-trip latency (120ms-300ms) is too slow for road safety warnings. Built an air-gapped pipeline with INT8 quantization running locally on device.',
      impact:
        'Latency slashed to 13.8ms per frame at 30 FPS, securing Top 140 finalist standing at the Delhi AI Grand Hackathon.',
      stack: ['Python', 'OpenCV', 'TensorFlow Lite', 'Edge TPU'],
    },
    {
      id: 'note-webgl-disposal',
      title: 'Deterministic WebGL Buffer Disposal in Three.js Desktop Shells',
      date: 'Nov 2024',
      status: 'Active Production',
      category: '3D Systems',
      summary:
        'Browser WebGL contexts do not automatically garbage-collect GPU geometry and texture buffers when React unmounts. Implemented recursive scene-tree disposal walking all materials and geometries upon window close.',
      impact:
        'Prevented GPU VRAM accumulation across continuous open/close cycles in Rudar OS 3D Room and Canvas apps.',
      stack: ['Three.js', 'React Three Fiber', 'Memory Profiler'],
    },
    {
      id: 'note-servercraft-docker',
      title: 'Zero-Downtime Memory Scaling & Container Slicing in ServerCraft',
      date: 'Jul 2024',
      status: 'Benchmarked',
      category: 'Cloud Systems',
      summary:
        'Engineered dynamic JVM heap resizing scripts triggered by real-time server player spikes, eliminating out-of-memory crashes on resource-constrained host machines.',
      impact:
        'World save corruption eliminated; 99.8% uptime during high-concurrency multiplayer test cohorts.',
      stack: ['Docker', 'Node.js', 'Shell', 'JVM Tuning'],
    },
  ],
});

