'use server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
// import remarkSlug from 'remark-slug';
import remarkToc from 'remark-toc';
import remarkEmoji from 'remark-emoji';
import { BlogPost } from './types';

const postsDirectory = path.join(process.cwd(), '/content/blog');

// Ensure the posts directory exists
try {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    console.log(`Created directory: ${postsDirectory}`);
  }
} catch (error) {
  console.error(`Error creating directory ${postsDirectory}:`, error);
}

async function processMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    // .use(remarkSlug)
    .use(remarkToc, { heading: 'Table of Contents', tight: true })
    // Remove the remarkPrism line
    .use(remarkEmoji)
    .use(html, { sanitize: false })
    .process(content);
  
  return result.toString();
}


// Format date for display
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date ${dateString}:`, error);
    return dateString; // Return original string if parsing fails
  }
}

// Calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
}

// Get data for all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Get file names under /content/blog
    const fileNames = fs.readdirSync(postsDirectory);
    
    if (fileNames.length === 0) {
      console.warn('No blog posts found in directory:', postsDirectory);
      return [];
    }
    
    const allPostsData = await Promise.all(fileNames
      .filter(fileName => fileName.endsWith('.md')) // Only process markdown files
      .map(async (fileName) => {
        try {
          // Remove ".md" from file name to get slug
          const slug = fileName.replace(/\.md$/, '');
          
          // Read markdown file as string
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents);
          
          // Process markdown content
          const content = await processMarkdown(matterResult.content);
          
          // Extract front matter data
          const frontMatter = matterResult.data as Partial<Omit<BlogPost, 'slug' | 'content'>>;
          
          // Set default values for missing fields
          const date = frontMatter.date ? formatDate(frontMatter.date as string) : formatDate(new Date().toISOString());
          const readTime = frontMatter.readTime || calculateReadingTime(matterResult.content);
          
          // Combine the data with the slug and content
          return {
            id: frontMatter.id || slug,
            title: frontMatter.title || 'Untitled Post',
            slug,
            excerpt: frontMatter.excerpt || matterResult.content.slice(0, 150) + '...',
            content,
            date,
            readTime,
            category: frontMatter.category || 'Uncategorized',
            tags: frontMatter.tags || [],
            imageUrl: frontMatter.imageUrl || '/images/blog/default.jpg',
          } as BlogPost;
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      }));
    
    // Filter out any null values from errors and sort posts by date
    return allPostsData
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        // Parse dates for comparison
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        return {
          slug: fileName.replace(/\.md$/, '')
        };
      });
  } catch (error) {
    console.error('Error getting all post slugs:', error);
    return [];
  }
}

// Get data for a single post
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Post file not found: ${fullPath}`);
      return undefined;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    
    // Process markdown content
    const content = await processMarkdown(matterResult.content);
    
    // Extract front matter data
    const frontMatter = matterResult.data as Partial<Omit<BlogPost, 'slug' | 'content'>>;
    
    // Set default values for missing fields
    const date = frontMatter.date ? formatDate(frontMatter.date as string) : formatDate(new Date().toISOString());
    const readTime = frontMatter.readTime || calculateReadingTime(matterResult.content);
    
    // Combine the data with the slug and content
    return {
      id: frontMatter.id || slug,
      title: frontMatter.title || 'Untitled Post',
      slug,
      excerpt: frontMatter.excerpt || matterResult.content.slice(0, 150) + '...',
      content,
      date,
      readTime,
      category: frontMatter.category || 'Uncategorized',
      tags: frontMatter.tags || [],
      imageUrl: frontMatter.imageUrl || '/images/blog/default.jpg',
    } as BlogPost;
  } catch (error) {
    console.error(`Error getting post by slug "${slug}":`, error);
    return undefined;
  }
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts();
    
    if (category === 'All') {
      return allPosts;
    }
    
    return allPosts.filter(post => post.category === category);
  } catch (error) {
    console.error(`Error getting posts by category "${category}":`, error);
    return [];
  }
}

// Search posts
export async function searchPosts(term: string): Promise<BlogPost[]> {
  try {
    if (!term) return await getAllPosts();
    
    const allPosts = await getAllPosts();
    const searchTerm = term.toLowerCase();
    
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error(`Error searching posts for "${term}":`, error);
    return [];
  }
}

// Get featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts();
    
    // First look for posts explicitly marked as featured
    const explicitlyFeatured = allPosts.filter(post => 
      post.tags.includes('featured') || 
      // (post as any).featured === true
      (post as { featured?: boolean }).featured === true
    );
    
    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured.slice(0, 3);
    }
    
    // Otherwise return the most recent posts
    return allPosts.slice(0, 3);
  } catch (error) {
    console.error('Error getting featured posts:', error);
    return [];
  }
}

// Get related posts based on category and tags
export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts();
    
    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // Score each post based on relevance
    const scoredPosts = otherPosts.map(post => {
      let score = 0;
      
      // Same category is a strong signal
      if (post.category === currentPost.category) {
        score += 5;
      }
      
      // Shared tags indicate relevance
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += sharedTags.length * 2;
      
      return { post, score };
    });
    
    // Sort by score (highest first) and take the top 'limit' posts
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  } catch (error) {
    console.error(`Error getting related posts for "${currentPost.slug}":`, error);
    return [];
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const allPosts = await getAllPosts();
    const categories = new Set<string>();
    
    allPosts.forEach(post => {
      categories.add(post.category);
    });
    
    return ['All', ...Array.from(categories)];
  } catch (error) {
    console.error('Error getting all categories:', error);
    return ['All'];
  }
}

// Get all tags
export async function getAllTags(): Promise<string[]> {
  try {
    const allPosts = await getAllPosts();
    const tags = new Set<string>();
    
    allPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error('Error getting all tags:', error);
    return [];
  }
}
