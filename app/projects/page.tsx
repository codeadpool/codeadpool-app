'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaMicrochip } from 'react-icons/fa';
import { getAllProjects } from '../lib/projects/data';
import Footer from '../components/Footer';

export default function ProjectsPage() {
  const [binaryMatrix, setBinaryMatrix] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [filteredProjects, setFilteredProjects] = useState(getAllProjects());

  // Generate binary background pattern
  useEffect(() => {
    const matrix = Array(100).fill(0).map(() => 
      Array(200).fill(0).map(() => 
        Math.random() > 0.5 ? '1' : '0'
      ).join(' ')
    );
    setBinaryMatrix(matrix);
  }, []);

  // Filter projects based on tag
  useEffect(() => {
    const allProjects = getAllProjects();
    if (activeFilter === "All") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter(project => project.tags.includes(activeFilter))
      );
    }
  }, [activeFilter]);

  // Get all unique tags from projects
  const allTags = ["All", ...Array.from(new Set(
    getAllProjects().flatMap(project => project.tags)
  ))];

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 font-mono">
      {/* Header with circuit pattern background */}
      <header className="relative py-16 overflow-hidden">
        {/* Binary code background */}
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="font-mono text-xs text-emerald-500 whitespace-nowrap">
            {binaryMatrix.map((row, i) => (
              <div key={i} className="leading-tight">
                {row}
              </div>
            ))}
          </div>
        </div>
        
        {/* Header content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 mb-4 border border-emerald-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              <span className="text-sm font-mono">HARDWARE PROJECTS</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              My Engineering Portfolio
            </h1>
            
            <div className="h-px w-24 bg-emerald-500 mb-6"></div>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">
              A showcase of my hardware engineering projects, from FPGA designs to custom PCBs and embedded systems.
            </p>
            
            {/* Filter tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeFilter === tag
                      ? 'bg-emerald-900/80 text-emerald-400 border border-emerald-700/50'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Projects Section */}
      {filteredProjects.some(project => project.featured) && activeFilter === "All" && (
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-6">
            <div className="flex items-center mb-8">
              <div className="h-px bg-gradient-to-r from-emerald-500 to-transparent flex-grow mr-4"></div>
              <h2 className="text-xl md:text-2xl font-semibold text-emerald-400 font-mono">
                Featured Projects
              </h2>
              <div className="h-px bg-gradient-to-l from-emerald-500 to-transparent flex-grow ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects
                .filter(project => project.featured)
                .map((project) => (
                  <div key={project.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-900/20">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      <Link href={`/projects/${project.slug}`} className="block">
                        <h3 className="text-2xl font-bold text-white mb-3 hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-300 mb-4">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-700/50 text-xs text-emerald-400 rounded-full border border-emerald-700/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-4">
                        <Link 
                          href={`/projects/${project.slug}`}
                          className="flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition-colors"
                        >
                          View Details
                        </Link>
                        
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                          >
                            <FaGithub className="mr-2" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {activeFilter !== "All" && (
            <div className="flex items-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white font-mono">
                {activeFilter} Projects
              </h2>
              <div className="h-px bg-gradient-to-l from-emerald-500 to-transparent flex-grow ml-4"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects
              .filter(project => activeFilter === "All" ? !project.featured : true)
              .map((project) => (
                <div key={project.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-900/20">
                  <Link href={`/projects/${project.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    </div>
                  </Link>
                  
                  <div className="p-5">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700/50 text-xs text-emerald-400 rounded-full border border-emerald-700/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 text-xs text-gray-400 rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link 
                        href={`/projects/${project.slug}`}
                        className="flex items-center px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                          aria-label="View code on GitHub"
                        >
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <FaMicrochip className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">
                No projects matching the selected filter. Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
