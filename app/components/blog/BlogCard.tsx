import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { BlogPost } from '../../lib/blog/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/hardware-blog/${post.slug}`} className="group block">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-900/20">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4 bg-emerald-900/80 text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-700/50">
            {post.category}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-xs text-gray-400">
            <div className="flex items-center mr-4">
              <FaCalendarAlt className="mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
