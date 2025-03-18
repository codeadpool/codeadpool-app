import { BlogPost } from './types';
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding FPGA Architecture for Beginners",
    slug: "understanding-fpga-architecture",
    excerpt: "A comprehensive guide to getting started with FPGA development and understanding the basics of hardware description languages.",
    content: `
      <h2>Introduction to FPGAs</h2>
      <p>Field-Programmable Gate Arrays (FPGAs) are semiconductor devices that are based around a matrix of configurable logic blocks (CLBs) connected via programmable interconnects. Unlike processors, FPGAs are truly parallel in nature, meaning different processing operations do not have to compete for the same resources.</p>
      
      <h2>Basic FPGA Architecture</h2>
      <p>The basic architecture of an FPGA consists of:</p>
      <ul>
        <li>Configurable Logic Blocks (CLBs): These contain lookup tables (LUTs), flip-flops, and multiplexers.</li>
        <li>Input/Output Blocks (IOBs): These handle the communication between the pins and the internal logic.</li>
        <li>Programmable Interconnects: These are wires and switches that connect CLBs and IOBs.</li>
        <li>Block RAM: Dedicated memory blocks distributed throughout the FPGA.</li>
        <li>DSP Slices: Dedicated hardware for digital signal processing operations.</li>
      </ul>
      
      <h2>Getting Started with FPGA Development</h2>
      <p>To start developing with FPGAs, you'll need:</p>
      <ol>
        <li>An FPGA development board (like Xilinx Artix-7 or Intel Cyclone)</li>
        <li>Development software (like Vivado, Quartus, or ISE)</li>
        <li>Knowledge of a Hardware Description Language (HDL) like VHDL or Verilog</li>
      </ol>
      
      <p>In the next sections, we'll explore how to set up your development environment and write your first HDL code.</p>
    `,
    date: "March 10, 2023",
    readTime: "8 min",
    category: "FPGA",
    tags: ["FPGA", "Verilog", "Hardware Design", "Digital Logic"],
    imageUrl: "/images/blog/fpga-intro.jpg"
  },
  {
    id: "2",
    title: "PCB Design Best Practices for Signal Integrity",
    slug: "pcb-design-signal-integrity",
    excerpt: "Learn how to maintain signal integrity in your PCB designs with these proven techniques and methodologies.",
    content: `
      <h2>What is Signal Integrity?</h2>
      <p>Signal integrity refers to the quality of an electrical signal as it travels through a PCB. Good signal integrity means the signal arrives at its destination with minimal distortion, maintaining its intended characteristics.</p>
      
      <h2>Common Signal Integrity Issues</h2>
      <p>Several issues can affect signal integrity:</p>
      <ul>
        <li>Reflections: Caused by impedance mismatches</li>
        <li>Crosstalk: Unwanted coupling between adjacent traces</li>
        <li>Ground bounce: Voltage fluctuations in the ground plane</li>
        <li>EMI/EMC: Electromagnetic interference and compatibility issues</li>
      </ul>
      
      <h2>Best Practices for Signal Integrity</h2>
      <h3>Impedance Control</h3>
      <p>Maintain consistent impedance throughout signal paths. This typically involves:</p>
      <ul>
        <li>Using controlled impedance traces (typically 50Ω for single-ended signals)</li>
        <li>Proper stackup design with appropriate dielectric materials</li>
        <li>Minimizing vias and layer transitions</li>
      </ul>
      
      <h3>Routing Guidelines</h3>
      <p>Follow these routing guidelines:</p>
      <ul>
        <li>Keep high-speed traces short and direct</li>
        <li>Use appropriate trace widths based on current requirements</li>
        <li>Maintain adequate spacing between traces to reduce crosstalk</li>
        <li>Route differential pairs with equal length and tight coupling</li>
      </ul>
      
      <p>In the next section, we'll cover advanced techniques for managing signal integrity in high-speed designs.</p>
    `,
    date: "March 15, 2023",
    readTime: "6 min",
    category: "PCB Design",
    tags: ["PCB", "Signal Integrity", "Hardware Design", "Electronics"],
    imageUrl: "/images/blog/pcb-signal-integrity.jpg"
  },
  {
    id: "3",
    title: "Getting Started with STM32 Microcontrollers",
    slug: "getting-started-stm32-microcontrollers",
    excerpt: "A beginner's guide to STM32 microcontrollers, covering setup, programming, and your first project.",
    content: `
      <h2>Introduction to STM32</h2>
      <p>STM32 is a family of 32-bit microcontrollers based on the ARM Cortex-M processor. They offer a great balance of performance, power efficiency, and features, making them popular for a wide range of embedded applications.</p>
      
      <h2>Setting Up Your Development Environment</h2>
      <p>To get started with STM32 development, you'll need:</p>
      <ol>
        <li>An STM32 development board (like the Nucleo or Discovery series)</li>
        <li>ST-Link programmer/debugger (often included on development boards)</li>
        <li>Development software:
          <ul>
            <li>STM32CubeIDE: Integrated development environment</li>
            <li>STM32CubeMX: Graphical tool for configuring STM32 microcontrollers</li>
          </ul>
        </li>
      </ol>
      
      <h2>Your First STM32 Project: Blinking an LED</h2>
      <p>Let's create a simple project to blink an LED:</p>
      <ol>
        <li>Open STM32CubeMX and create a new project</li>
        <li>Select your microcontroller model</li>
        <li>Configure a GPIO pin as output for the LED</li>
        <li>Generate the project code</li>
        <li>Open the project in STM32CubeIDE</li>
        <li>Add code to toggle the LED pin in a loop</li>
        <li>Compile and flash the program to your board</li>
      </ol>
      
      <h3>Example Code</h3>
      <pre><code>
      /* Toggle LED connected to PA5 (on many Nucleo boards) */
      while (1) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        HAL_Delay(500); // 500ms delay
      }
      </code></pre>
      
      <p>In the next tutorial, we'll explore more advanced features like timers, interrupts, and communication protocols.</p>
    `,
    date: "March 20, 2023",
    readTime: "7 min",
    category: "Microcontrollers",
    tags: ["STM32", "ARM", "Embedded Systems", "C Programming"],
    imageUrl: "/images/blog/stm32-intro.jpg"
  }
];

// Helper functions to work with blog posts
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getFeaturedPosts(): BlogPost[] {
  // Return the first 3 posts as featured posts (you could use a different criteria)
  return blogPosts.slice(0, 2);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return blogPosts;
  return blogPosts.filter(post => post.category === category);
}

export function searchPosts(term: string): BlogPost[] {
  const searchTerm = term.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}
