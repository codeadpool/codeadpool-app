'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

interface HeroProps {
  name: string;
  title: string;
  description: string;
  ctaPrimary?: {
    text: string;
    href: string;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
}

const Hero_L: React.FC<HeroProps> = ({
  name,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Hardware terminology for static display
  const hardwareTerms = [
    "FPGA", "PCB", "GPIO", "ASIC", "VHDL", "Verilog", 
    "SoC", "RISC-V", "ARM", "I2C", "SPI", "UART", 
    "Clock", "DRAM", "SRAM", "Cache", "Register", "ALU",
    "EEPROM", "Flash", "Microcontroller", "Oscillator",
    "Transistor", "Capacitor", "Resistor", "Inductor",
    "Logic Gate", "Flip-Flop", "Multiplexer", "Buffer"
  ];

  const [binaryMatrix, setBinaryMatrix] = useState<string[]>([]);

  useEffect(() => {
    const matrix = Array(20).fill(0).map(() => 
      Array(30).fill(0).map(() => 
        Math.random() > 0.5 ? '1' : '0'
      ).join(' ')
    );
    setBinaryMatrix(matrix);
  }, []);

  // Static circuit animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const nodes: {
      x: number;
      y: number;
      connections: number[];
      size: number;
      term: string | null;
    }[] = [];
    
    // Function to draw all nodes and connections
    function drawNodes() {
      if (!ctx) return;
      if (!canvas) return;

      // const width = canvas.width;
      // const height = canvas.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.lineWidth = 1;
        
        for (const connIndex of node.connections) {
          const connectedNode = nodes[connIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = 'rgba(0, 255, 170, 0.1)';
          ctx.stroke();
        }
      }
      
      // Draw nodes and terms
      for (const node of nodes) {
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 170, 0.3)';
        ctx.fill();
        
        // Draw hardware term if present
        if (node.term) {
          const termSize = Math.random() * 10 + 10;
          ctx.font = `${termSize}px monospace`;
          ctx.fillStyle = 'rgba(0, 255, 170, 0.5)';
          ctx.fillText(node.term, node.x + 10, node.y);
        }
      }
    }
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawNodes();
    };

    window.addEventListener('resize', resizeCanvas);

    const setupNodes = () => {
      if (!canvas) return;
      nodes.length = 0; 
      const nodeCount = Math.floor(window.innerWidth * window.innerHeight / 15000);
      
      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 1;
        const showTerm = Math.random() > 0.7;
        nodes.push({
          x,
          y,
          connections: [],
          size,
          term: showTerm ? hardwareTerms[Math.floor(Math.random() * hardwareTerms.length)] : null
        });
      }
      
      // Connect nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Find nearby nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const otherNode = nodes[j];
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );
            
            if (distance < 150 && node.connections.length < 3) {
              node.connections.push(j);
              if (node.connections.length >= 3) break;
            }
          }
        }
      }
      drawNodes();
    };

    resizeCanvas();
    setupNodes();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <main className="relative flex flex-col min-h-screen bg-gray-900 overflow-hidden">
      <section className="relative flex-grow flex items-center overflow-hidden bg-gray-900">
        {/* Static circuit board background */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0"
          style={{ opacity: 0.5 }}
        />
        
        {/* Hardware component decorative elements */}
        <div className="absolute inset-0 z-0">
          {/* Transistor */}
          <div className="absolute top-[15%] left-[10%] opacity-10 w-20 h-20">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10V90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M50 40H90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M50 60H90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M30 30L50 40" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M30 70L50 60" stroke="#00FFAA" strokeWidth="2"/>
              <circle cx="30" cy="30" r="5" stroke="#00FFAA" strokeWidth="2"/>
              <circle cx="30" cy="70" r="5" stroke="#00FFAA" strokeWidth="2"/>
              <circle cx="90" cy="40" r="5" stroke="#00FFAA" strokeWidth="2"/>
              <circle cx="90" cy="60" r="5" stroke="#00FFAA" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Capacitor */}
          <div className="absolute top-[70%] right-[15%] opacity-10 w-16 h-16">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 30V70" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M90 30V70" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M40 20V80" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M60 20V80" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M10 50H40" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M60 50H90" stroke="#00FFAA" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Microchip */}
          <div className="absolute bottom-[20%] left-[20%] opacity-10 w-24 h-24">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="60" height="60" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M30 10V20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M50 10V20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M70 10V20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M30 80V90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M50 80V90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M70 80V90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M10 30H20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M10 50H20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M10 70H20" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M80 30H90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M80 50H90" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M80 70H90" stroke="#00FFAA" strokeWidth="2"/>
              <rect x="30" y="30" width="40" height="40" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M35 40H65" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M35 50H65" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M35 60H65" stroke="#00FFAA" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Logic Gate */}
          <div className="absolute top-[40%] right-[10%] opacity-10 w-20 h-20">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 30H40" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M20 70H40" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M80 50H95" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M40 20V80" stroke="#00FFAA" strokeWidth="2"/>
              <path d="M40 20C60 20 80 30 80 50C80 70 60 80 40 80" stroke="#00FFAA" strokeWidth="2"/>
              <circle cx="85" cy="50" r="5" stroke="#00FFAA" strokeWidth="2"/>
            </svg>
          </div>
          
          {/* Oscillator Waveform */}
          <div className="absolute top-[20%] right-[30%] opacity-10 w-32 h-16">
            <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 40H40L40 10H60L60 70H80L80 10H100L100 70H120L120 40H150" stroke="#00FFAA" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Static light glow behind the h1 tag */}
              <div className="absolute -z-10 top-10 left-10 w-[120%] h-[120%] bg-emerald-500/20 blur-[100px] rounded-full"></div>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 mb-4 border border-emerald-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                <span className="text-sm font-mono">SYSTEM ONLINE</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-mono relative">
                {name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="h-px bg-gradient-to-r from-emerald-500 to-transparent flex-grow mr-4"></div>
                <h2 className="text-xl md:text-2xl font-semibold text-emerald-400 font-mono">
                  {title}
                </h2>
              </div>
              
              <p className="text-lg text-gray-300 mb-8 max-w-lg font-light">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {ctaPrimary && (
                  <Link 
                    href={ctaPrimary.href}
                    className="group flex items-center px-6 py-3 bg-transparent border border-emerald-500 hover:bg-emerald-900/20 text-gray-300 hover:text-emerald-400 font-mono rounded-md transition-colors duration-300"
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <span>{ctaPrimary.text}</span>
                  </Link>
                )}
                
                {ctaSecondary && (
                  <Link 
                    href={ctaSecondary.href}
                    className="group flex items-center px-6 py-3 bg-transparent border border-emerald-500 hover:bg-emerald-900/20 text-gray-300 hover:text-emerald-400 font-mono rounded-md transition-colors duration-300"
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <span>{ctaSecondary.text}</span>
                  </Link>
                )}
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                  <span className="text-emerald-400 text-sm font-mono mb-1">Verificaiton</span>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">           
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                  <span className="text-emerald-400 text-sm font-mono mb-1">SVA</span>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '85%', animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                  <span className="text-emerald-400 text-sm font-mono mb-1">UVM</span>
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '85%', animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                {/* Static ambient glow effect */}
                <div className="absolute inset-0 -m-1 bg-emerald-500/10 blur-3xl rounded-full"></div>            
                {/* Profile frame with binary numbers inside */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-emerald-500/30 p-1 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20"></div>

                  {/* Binary numbers inside the frame */}
                  <div className="relative z-10 font-mono text-xs text-emerald-500 whitespace-nowrap leading-tight">
                    {binaryMatrix.map((row, i) => (
                      <div key={i} className="text-center">{row}</div>
                    ))}
                  </div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>
                </div>
                
                {/* Hardware spec labels */}
                <div className="absolute -right-24 top-1/5 bg-gray-800/50 border border-emerald-500/30 p-2 rounded text-xs font-mono text-emerald-400">
                  <div>CPU: 4.2GHz</div>
                  <div>RAM: 64GB DDR5</div>
                  <div>GPU: RTX 4090</div>
                </div>
                
                <div className="absolute -left-24 bottom-1/5 bg-gray-800/50 border border-emerald-500/30 p-2 rounded text-xs font-mono text-emerald-400">
                  <div>FPGA: Xilinx Artix-7</div>
                  <div>MCU: STM32F4</div>
                  <div>BUS: PCIe 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 

      {/* Footer Section */}
      <footer className="relative z-10 bg-gray-900 text-white py-3">
        <div className="container mx-auto flex flex-col-reverse md:flex-row justify-between items-center px-4">
          <p className="text-sm font-mono">&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
          
          <div className="flex space-x-4">
            <a href="https://github.com/codeadpool" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="mailto:your.email@example.com" className="hover:text-emerald-400 transition-colors">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Hero_L;

