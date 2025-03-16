export interface BlogPost {
  id: string;          // Unique identifier
  title: string;       // Post title
  slug: string;        // URL-friendly version of the title
  excerpt: string;     // Short summary
  content: string;     // Full post content
  date: string;        // Publication date
  readTime: string;    // Estimated reading time
  category: string;    // Primary category
  tags: string[];      // Related tags
  imageUrl: string;    // Featured image path
}