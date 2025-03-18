export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    challenges: string;
    solution: string;
    outcome: string;
    technologies: string[];
    tags: string[];
    imageUrl: string;
    additionalImages?: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    date: string;
  }
  
export const projectsData: Project[] = [
  {
    id: "1",
    slug: "sram-uvc",
    title: "SRAM Universal Verification Component (UVC)",
    description: "Developed a reusable UVM-based Universal Verification Component (UVC) for verifying a custom SRAM design with timing models.",
    longDescription: `
      The SRAM UVC project provides a comprehensive verification environment to test and validate the functionality of a custom SRAM (Static Random Access Memory) with timing models.
      Leveraging the UVM (Universal Verification Methodology) framework, this project aims to deliver a standardized and reusable environment for SRAM verification.
      
      The system architecture includes:
      - A custom interface for SRAM interaction
      - UVM agents for driving and monitoring SRAM transactions
      - A UVM environment for simulating and verifying SRAM behavior
      - A testbench to integrate the UVC with the DUT (Device Under Test)
    `,
    challenges: `
      Several challenges were encountered during this project:
      
      1. Accurately modeling SRAM timing constraints within the UVM framework
      2. Ensuring robust stimulus generation for corner cases
      3. Creating a reusable and scalable UVC structure
      4. Debugging signal integrity issues during verification
    `,
    solution: `
      I approached these challenges by:
      
      - Implementing transaction-based modeling to streamline stimulus application
      - Using SystemVerilog assertions (SVA) for timing constraint validation
      - Developing parameterized UVM agents for flexibility
      - Integrating a scoreboard and coverage model for thorough verification
      
      The design was implemented in SystemVerilog using UVM and simulated with Verilator. 
      Extensive simulation was performed to validate the functionality before deployment.
    `,
    outcome: `
      The final UVC successfully verified multiple SRAM configurations and improved verification efficiency.
      It provides:
      - High reusability for different SRAM designs
      - 95% functional coverage achieved in verification
      - Automated self-checking test sequences
      - Improved debugging with transaction-level logging
    `,
    technologies: ["SystemVerilog", "UVM", "SRAM Verification", "Verilator", "Assertions (SVA)", "Coverage-Driven Verification"],
    tags: ["UVM", "Verification", "SystemVerilog", "SRAM", "Testbench"],
    imageUrl: "/project/sram/testbenchTopology.png",
    additionalImages: [
      "/project/sram/testbenchTopology.png", 
      "/project/sram/edgeCaseReport.png",
      "/project/sram/randSeqReport.png",
      "/project/sram/sameAddrReport.png",
      "/project/sram/stressTestReport.png"
    ],
    githubUrl: "https://github.com/codeadpool/SRAM_UVC",
    liveUrl: "https://yourdemo.com/sram-uvc",
    featured: true,
    date: "April 2024"
  },
  {
    id: "2",
    slug: "async-fifo-uvc",
    title: "Asynchronous FIFO Universal Verification Component (UVC)",
    description: "Developed a reusable UVM-based Universal Verification Component (UVC) for verifying an asynchronous FIFO design with clock domain crossing handling.",
    longDescription: `
      The Asynchronous FIFO UVC project provides a robust verification environment for testing and validating an asynchronous FIFO design.
      This verification environment ensures proper functionality across clock domain crossings and checks data integrity under various conditions.
      
      The system architecture includes:
      - A custom interface for FIFO interactions
      - UVM agents for driving, monitoring, and checking transactions
      - A UVM environment to simulate and verify the FIFO behavior
      - A scoreboard to compare expected vs actual results
      - A testbench for integrating the UVC with the DUT (Device Under Test)
    `,
    challenges: `
      Several challenges were encountered during this project:
      
      1. Handling metastability across different clock domains
      2. Ensuring proper synchronization of read and write pointers
      3. Generating constrained-random stimulus to cover edge cases
      4. Validating full and empty conditions accurately
    `,
    solution: `
      I approached these challenges by:
      
      - Implementing a dual-clock synchronizer for robust clock domain crossing
      - Using assertions (SVA) to verify metastability and pointer integrity
      - Creating parameterized UVM agents for flexible test scenarios
      - Integrating a coverage-driven methodology to maximize verification efficiency
      
      The design was implemented in SystemVerilog using UVM and simulated using Verilator.
      Extensive regression testing was conducted to ensure correctness under varying conditions.
    `,
    outcome: `
      The final UVC successfully verified multiple FIFO configurations and improved verification efficiency.
      It provides:
      - Reliable verification of clock domain crossings
      - 97% functional coverage achieved
      - Automated self-checking test sequences for different FIFO depths and data widths
      - Enhanced debugging through transaction-level logging and scoreboard validation
    `,
    technologies: ["SystemVerilog", "UVM", "FIFO Verification", "Verilator", "Assertions (SVA)", "Coverage-Driven Verification", "Clock Domain Crossing"],
    tags: ["UVM", "Verification", "SystemVerilog", "FIFO", "CDC Handling"],
    imageUrl: "/project/afifo/async-fifo-uvc.png",
    additionalImages: [
    ],
    githubUrl: "https://github.com/codeadpool/ASYNC_FIFO_UVC",
    liveUrl: "https://yourdemo.com/async-fifo-uvc",
    featured: true,
    date: "April 2024"
  }
];
  
export function getAllProjects(): Project[] {
  return projectsData;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find(project => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projectsData.filter(project => project.featured);
}

export function getAllProjectSlugs() {
  return projectsData.map(project => ({
    slug: project.slug
  }));
}
  