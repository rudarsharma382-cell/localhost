import { z } from 'zod';
import { PhysicsPreset, PhysicsPresetSchema } from './schema';

const RAW_PHYSICS_PRESETS: PhysicsPreset[] = [
  {
    id: 'gravity',
    name: 'Gravitational Attraction & Orbital Mechanics',
    subtitle: 'N-Body Gravitational Well Simulation',
    description:
      'Simulates celestial bodies orbiting a central gravitational attractor with real-time velocity vector integration and orbital decay.',
    formula: 'F = G · (m₁ · m₂) / r²',
    theory:
      'Newton’s law of universal gravitation states that every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers. The simulation numerically integrates position using Velocity Verlet to maintain energy conservation.',
    defaultParams: {
      gravity: 9.8,
      mass: 50,
      velocity: 45,
      elasticity: 0.8,
      particleCount: 16,
      trailLength: 60,
    },
    paramDefs: [
      { id: 'gravity', label: 'Attractor Strength (G)', min: 1, max: 25, step: 0.5, unit: 'm/s²' },
      { id: 'mass', label: 'Orbiter Mass (m)', min: 5, max: 100, step: 1, unit: 'kg' },
      { id: 'velocity', label: 'Orbital Velocity (v₀)', min: 10, max: 100, step: 2, unit: 'px/s' },
      { id: 'particleCount', label: 'Body Count (N)', min: 4, max: 40, step: 2, unit: 'bodies' },
    ],
  },
  {
    id: 'collisions',
    name: 'Elastic Momentum & Restitution',
    subtitle: 'Conservation of Linear Momentum in 2D Space',
    description:
      'Simulates elastic and inelastic collisions between moving spheres enclosed in a constrained physical boundary box.',
    formula: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
    theory:
      'When two bodies collide in a closed system, total momentum is conserved. The coefficient of restitution (e) defines the ratio of relative velocity after collision to that before collision. An e of 1.0 represents perfectly elastic collision with zero kinetic energy loss, while e < 1.0 represents inelastic deformation with thermal dissipation.',
    defaultParams: {
      gravity: 0,
      mass: 25,
      velocity: 50,
      elasticity: 0.95,
      friction: 0.005,
      particleCount: 20,
    },
    paramDefs: [
      { id: 'elasticity', label: 'Coefficient of Restitution (e)', min: 0.1, max: 1.0, step: 0.05, unit: '' },
      { id: 'mass', label: 'Sphere Mass Variance', min: 10, max: 60, step: 5, unit: 'kg' },
      { id: 'velocity', label: 'Initial Kinetic Energy', min: 20, max: 120, step: 5, unit: 'px/s' },
      { id: 'particleCount', label: 'Active Spheres', min: 5, max: 35, step: 1, unit: 'spheres' },
    ],
  },
  {
    id: 'pendulum',
    name: 'Kinetic Double Pendulum & Chaos',
    subtitle: 'Coupled Nonlinear Oscillations & Phase Space Trajectories',
    description:
      'A classical double pendulum system displaying highly chaotic, non-repeating trajectories sensitive to infinitesimal initial conditions.',
    formula: 'θ̈₁ = f(θ₁, θ₂, θ̇₁, θ̇₂, g, L₁, L₂)',
    theory:
      'The double pendulum is a paradigm of deterministic chaos in Lagrangian mechanics. Despite having simple governing differential equations derived from the Euler-Lagrange equations, its motion is non-integrable. A trace buffer visualizes the sensitive dependence on initial conditions (the butterfly effect).',
    defaultParams: {
      gravity: 9.8,
      mass: 40,
      velocity: 0,
      elasticity: 0.85,
      damping: 0.002,
      armLength: 120,
    },
    paramDefs: [
      { id: 'gravity', label: 'Gravitational Acceleration (g)', min: 2, max: 20, step: 0.5, unit: 'm/s²' },
      { id: 'armLength', label: 'Rod Length (L)', min: 60, max: 180, step: 5, unit: 'px' },
      { id: 'mass', label: 'Bob Mass (m)', min: 10, max: 80, step: 5, unit: 'kg' },
      { id: 'damping', label: 'Air Resistance (b)', min: 0, max: 0.02, step: 0.001, unit: '' },
    ],
  },
  {
    id: 'particles',
    name: 'Particle Swarm & Fluidic Dispersion',
    subtitle: 'Kinematic Particle System with Surface Friction & Bouncing',
    description:
      'High-throughput dynamic particle fountain simulating real-time fluid turbulence, ground rebound restitution, and thermal drift.',
    formula: 'v(t + Δt) = v(t) + (F_net / m) · Δt',
    theory:
      'Eulerian particle physics where each individual emitter entity possesses position, velocity, lifespan, and mass attributes. Particles rebound off physical canvas boundaries with dampening restitution, mimicking fluid droplet kinetics and atmospheric wind drag.',
    defaultParams: {
      gravity: 12.0,
      mass: 10,
      velocity: 60,
      elasticity: 0.7,
      particleCount: 150,
      emissionRate: 5,
    },
    paramDefs: [
      { id: 'gravity', label: 'Downward Gravity (g)', min: 0, max: 25, step: 1, unit: 'm/s²' },
      { id: 'velocity', label: 'Ejection Velocity (v₀)', min: 20, max: 120, step: 5, unit: 'px/s' },
      { id: 'elasticity', label: 'Surface Rebound Elasticity', min: 0.1, max: 0.95, step: 0.05, unit: '' },
      { id: 'particleCount', label: 'Total Swarm Capacity', min: 50, max: 300, step: 25, unit: 'particles' },
    ],
  },
];

export const physicsPresets: PhysicsPreset[] = z.array(PhysicsPresetSchema).parse(RAW_PHYSICS_PRESETS);

