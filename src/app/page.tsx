'use client';

import React from 'react';
import { Desktop } from '@/os/desktop/Desktop';

export default function Home() {
  return (
    <>
      {/* Search Engine & Accessibility Crawlable Semantic Layer */}
      <div className="sr-only" aria-hidden="false">
        <header>
          <h1>Rudar Sharma — Full-Stack Developer &amp; Robotics Engineer</h1>
          <p>
            Welcome to the interactive personal portfolio and operating system of Rudar Sharma.
            Specializing in web engineering, AI applications, robotics hardware, and interactive 3D experiences.
          </p>
        </header>

        <section aria-label="About Rudar Sharma">
          <h2>About Me</h2>
          <p>
            Class 10 STEM student based in Rohini, Delhi. Head of Tech &amp; Robotics Club.
            Building real-world products across web, Flutter apps, and artificial intelligence.
          </p>
        </section>

        <nav aria-label="Social and Project Links">
          <h2>Connect &amp; Explore</h2>
          <ul>
            <li><a href="https://github.com/rudarsharma382-cell">GitHub: github.com/rudarsharma382-cell</a></li>
            <li><a href="https://linkedin.com/in/rudarsharma-dev">LinkedIn: linkedin.com/in/rudarsharma-dev</a></li>
            <li><a href="/resume.pdf">Download Official Resume (PDF)</a></li>
            <li><a href="https://safeware-woad.vercel.app">SafeWare AI Project</a></li>
          </ul>
        </nav>

        <section aria-label="Technical Skills">
          <h2>Technical Skills</h2>
          <p>Languages: TypeScript, JavaScript, Python, C++, HTML5, CSS3, SQL</p>
          <p>Frameworks &amp; Libraries: React, Next.js, Node.js, Three.js, Tailwind CSS, Zustand, ROS2</p>
          <p>Hardware &amp; Robotics: Arduino, Raspberry Pi, Microcontrollers, Sensors &amp; Actuators</p>
        </section>
      </div>

      <Desktop />
    </>
  );
}
