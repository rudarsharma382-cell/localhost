import { z } from 'zod';
import { GalleryItem, GalleryItemSchema } from './schema';

const RAW_GALLERY_ITEMS: GalleryItem[] = [
  // --- Album: Robotics & Hardware ---
  {
    id: 'gal-arduino-proto',
    title: 'Arduino Sensor Interface & Embedded Prototyping',
    date: 'Sep 2024',
    album: 'Robotics & Hardware',
    mediaType: 'image',
    src: '/assets/icons/terminal.jpg',
    thumbnail: '/assets/icons/terminal.jpg',
    aspectRatio: '1:1',
    caption:
      'Custom circuit assembly connecting ultrasonic distance transducers, accelerometer I2C buses, and high-torque servo controllers for autonomous obstacle evasion.',
    location: 'STEM Robotics Hardware Lab',
    equipment: ['Arduino Uno R3', 'HC-SR04 Sensors', 'ESP32 Wi-Fi Node', 'Breadboard Rig'],
    tags: ['Robotics', 'C++', 'Microcontrollers', 'Sensors'],
  },
  {
    id: 'gal-pcb-design',
    title: 'High-Density Printed Circuit Board Interconnects',
    date: 'Jul 2024',
    album: 'Robotics & Hardware',
    mediaType: 'image',
    src: '/assets/textures/mobo_pcb.jpg',
    thumbnail: '/assets/textures/mobo_pcb.jpg',
    aspectRatio: '4:3',
    caption:
      'Multi-layer PCB inspection verifying ground planes, signal trace impedances, and component solder fillets prior to high-power motor driver activation.',
    location: 'Electronics Prototyping Bay',
    equipment: ['Oscilloscope', 'Multimeter', 'Soldering Station'],
    tags: ['Hardware', 'Circuits', 'Power Distribution'],
  },
  {
    id: 'gal-thermal-assembly',
    title: 'Dual-Stage Thermal Cooling & Airflow Testing',
    date: 'May 2024',
    album: 'Robotics & Hardware',
    mediaType: 'image',
    src: '/assets/casefanrear.jpg',
    thumbnail: '/assets/casefanrear.jpg',
    aspectRatio: '1:1',
    caption:
      'Aerodynamic static pressure testing measuring cubic feet per minute (CFM) across high-heat dissipation zones during prolonged computational stress tests.',
    location: 'Hardware Prototyping Lab',
    equipment: ['Thermal Camera', 'Anemometer', 'PWM Fan Controller'],
    tags: ['Hardware', 'Thermals', 'Cooling'],
  },
  {
    id: 'gal-ram-bus',
    title: 'High-Throughput Bus Synchronization & Signal Integrity',
    date: 'Mar 2024',
    album: 'Robotics & Hardware',
    mediaType: 'image',
    src: '/assets/textures/gskill tridentz rgb.jpg',
    thumbnail: '/assets/textures/gskill tridentz rgb.jpg',
    aspectRatio: '4:3',
    caption:
      'Memory latency calibration on edge computing rig evaluating dual-channel data bandwidth required for sustained real-time video frame buffering.',
    location: 'Systems Architecture Workbench',
    equipment: ['Edge AI Rig', 'DDR4 Controller', 'Logic Analyzer'],
    tags: ['Hardware', 'Memory Architecture', 'Benchmarking'],
  },

  // --- Album: Hackathons & Summits ---
  {
    id: 'gal-delhi-hackathon',
    title: 'Delhi AI Grand Hackathon • National Finalist Showcase',
    date: 'Aug 2024',
    album: 'Hackathons & Summits',
    mediaType: 'image',
    src: '/assets/cyberpunk-city.jpg',
    thumbnail: '/assets/cyberpunk-city.jpg',
    aspectRatio: '16:9',
    caption:
      'Pitching SafeWare AI road perception architecture to panel judges after qualifying for the Top 140 nationwide out of thousands of participating engineering teams.',
    location: 'Delhi AI Grand Summit • New Delhi',
    equipment: ['Jetson Nano Developer Kit', 'Edge Camera', 'Mobile Display'],
    tags: ['Hackathon', 'Finalist', 'SafeWare AI', 'Presentation'],
  },
  {
    id: 'gal-dragon-video',
    title: 'Kinetic Autonomous Aerial Trajectory Visualizer',
    date: 'Nov 2024',
    album: 'Hackathons & Summits',
    mediaType: 'video',
    src: '/assets/boot/boot.mp4',
    thumbnail: '/assets/city-skyline.jpg',
    aspectRatio: '16:9',
    caption:
      'High-frame-rate cinematic rendering demonstrating dynamic flight path interpolation, volumetric lighting, and aerodynamic motion curves.',
    location: 'Visual Simulation Lab',
    equipment: ['GPU Workstation', 'Hardware H.264 Encoder', 'Ray-Tracing Pipeline'],
    tags: ['3D Simulation', 'Volumetrics', 'Motion Physics', 'Video'],
  },
  {
    id: 'gal-code-sprint',
    title: 'Rudar Sharma • Lead Engineering Workstation',
    date: 'Aug 2024',
    album: 'Hackathons & Summits',
    mediaType: 'image',
    src: '/src/assets/Rudar_sharma_img.jpg',
    thumbnail: '/src/assets/Rudar_sharma_img.jpg',
    aspectRatio: '1:1',
    caption:
      'Late-night sprint testing multi-model synthetic media forensics and fine-tuning phoneme desync thresholds during 36-hour hackathon crunch.',
    location: 'Hackathon War Room',
    equipment: ['Dual Monitors', 'High-Spec Workstation', 'Mechanical Keyboard'],
    tags: ['Sprint', 'Hackathon', 'Founder', 'Coding'],
  },

  // --- Album: Workshops & Labs ---
  {
    id: 'gal-stem-workshop',
    title: 'STEM Robotics & Microcontroller Instruction Workshop',
    date: 'Jun 2024',
    album: 'Workshops & Labs',
    mediaType: 'image',
    src: '/assets/textures/ROG_maximus_xiii.jpg',
    thumbnail: '/assets/textures/ROG_maximus_xiii.jpg',
    aspectRatio: '4:3',
    caption:
      'Conducting an introductory electronics workshop demonstrating PWM motor control, logic level conversion, and serial communication to prospective junior developers.',
    location: 'School STEM Auditorium',
    equipment: ['Demonstration Breadboards', 'Digital Projector', 'Student Kits'],
    tags: ['Mentorship', 'STEM', 'Teaching', 'Robotics'],
  },
  {
    id: 'gal-lab-bench',
    title: 'Precision Systems Diagnostic Station',
    date: 'Apr 2024',
    album: 'Workshops & Labs',
    mediaType: 'image',
    src: '/assets/stylish-room-hd.jpg',
    thumbnail: '/assets/stylish-room-hd.jpg',
    aspectRatio: '16:9',
    caption:
      'Ergonomic studio workstation configured for concurrent mobile device testing, 3D scene rendering, and embedded serial port debugging.',
    location: 'Studio Workshop',
    equipment: ['Primary Workstation', 'Reference Display', 'Acoustic Studio Monitors'],
    tags: ['Studio', 'Workstation', 'Environment'],
  },

  // --- Album: Behind The Scenes ---
  {
    id: 'gal-night-build',
    title: 'Late-Night OS Kernel & Architecture Prototyping',
    date: 'Oct 2024',
    album: 'Behind The Scenes',
    mediaType: 'image',
    src: '/assets/room-wall-bg.jpg',
    thumbnail: '/assets/room-wall-bg.jpg',
    aspectRatio: '16:9',
    caption:
      'Capturing the calm ambient atmosphere during the initial development phases of Rudar OS window management algorithms and memory lifecycle models.',
    location: 'Private Studio Space',
    equipment: ['Development Terminal', 'Dark Studio Lighting'],
    tags: ['Late Night', 'Systems', 'Focus'],
  },
  {
    id: 'gal-motorsport-sim',
    title: 'Kinetic Automotive Telemetry & Dynamic Rig Modeling',
    date: 'Sep 2024',
    album: 'Behind The Scenes',
    mediaType: 'image',
    src: '/assets/wallpaper/bmw-motorsport.jpg',
    thumbnail: '/assets/wallpaper/bmw-motorsport.jpg',
    aspectRatio: '16:9',
    caption:
      'Examining high-resolution aerodynamic surface geometry, suspension travel telemetry, and downforce dynamics modeling for the BMW M4 GT4 project.',
    location: 'Automotive Simulation Rig',
    equipment: ['Simulation Cockpit', 'Telemetry Logger'],
    tags: ['Automotive', 'Kinematics', '3D Modeling'],
  },
];

export const galleryItems: GalleryItem[] = z.array(GalleryItemSchema).parse(RAW_GALLERY_ITEMS);

