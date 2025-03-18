'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaTag } from 'react-icons/fa';
import BlogCard from '../components/blog/BlogCard';
import { getAllPosts, getFeaturedPosts } from '../lib/blog/markdown';
import Loading from './loading';
import { BlogPost } from '../lib/blog/types';
import Footer from '@/app/components/Footer';

export default function BlogPage() {
  // const [allPosts, setAllPosts] = useState([]);
  // const [featuredPosts, setFeaturedPosts] = useState([]);
  // const [filteredPosts, setFilteredPosts] = useState([]);

const [allPosts, setAllPosts] = useState([] as BlogPost[]);
const [featuredPosts, setFeaturedPosts] = useState([] as BlogPost[]);
const [filteredPosts, setFilteredPosts] = useState([] as BlogPost[]);


  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [binaryMatrix, setBinaryMatrix] = useState(['']);

  const categories = ['All', 'UVM', 'System Verilog', 'Digital Logic', 'Microcontrollers'];
  // Generate binary background pattern
  useEffect(() => {
    const matrix = Array(100).fill(0).map(() => 
      Array(200).fill(0).map(() => 
        Math.random() > 0.5 ? '1' : '0'
      ).join(' ')
    );
    setBinaryMatrix(matrix);
  }, []);


  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllPosts();
        const featured = await getFeaturedPosts();
        setAllPosts(posts);
        setFeaturedPosts(featured);
        setFilteredPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Filter posts based on search term and category
  useEffect(() => {
    if (allPosts.length === 0) return;
    
    let posts = [...allPosts];
    
    if (searchTerm) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (activeCategory !== 'All') {
      posts = posts.filter(post => post.category === activeCategory);
    }
    
    setFilteredPosts(posts);
  }, [searchTerm, activeCategory, allPosts]);

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
              <span className="text-sm font-mono">HARDWARE INSIGHTS</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Hardware Blog
            </h1>
            
            <div className="h-px w-24 bg-emerald-500 mb-6"></div>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">
              Stuff ilearnt from day-to-day. Just dont know where to put it.
            </p>
            
            {/* Search bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Featured post section - only show if not filtering */}
          {(!searchTerm && activeCategory === 'All') && (
            <section className="py-12 bg-gray-800/30">
              <div className="container mx-auto px-6">
                <div className="flex items-center mb-8">
                  <div className="h-px bg-gradient-to-r from-emerald-500 to-transparent flex-grow mr-4"></div>
                  <h2 className="text-xl md:text-2xl font-semibold text-emerald-400 font-mono">
                    Featured Articles
                  </h2>
                  <div className="h-px bg-gradient-to-l from-emerald-500 to-transparent flex-grow ml-4"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main blog content */}
          <section className="py-12">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                      Categories
                    </h3>

                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => setActiveCategory(category)}
                            className={`flex items-center w-full text-left px-3 py-2 rounded-md transition-colors ${
                              activeCategory === category 
                                ? 'bg-emerald-900/50 text-emerald-400' 
                                : 'text-gray-300 hover:bg-gray-700/30'
                            }`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                                
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                        Popular Tags
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {['UVM', 'Verilog', 'VHDL', 'System Verilog', 'Digital Logic'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchTerm(tag)}
                            className="px-3 py-1 bg-gray-700/50 text-xs text-gray-300 rounded-full hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors"
                          >
                            <div className="flex items-center">
                              <FaTag className="mr-1" size={10} />
                              {tag}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Blog posts */}
                <div className="lg:col-span-3">
                  <div className="flex items-center mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold text-white font-mono">
                      {activeCategory === 'All' ? 'All Articles' : activeCategory}
                    </h2>
                    <div className="h-px bg-gradient-to-l from-emerald-500 to-transparent flex-grow ml-4"></div>
                  </div>
                  
                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                        <FaSearch className="text-emerald-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                      <p className="text-gray-400">
                        Try adjusting your search or category filters to find what youre looking for.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      <Footer />
    </main>
  );
}