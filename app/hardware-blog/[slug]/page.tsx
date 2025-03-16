import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaTag, FaArrowLeft } from 'react-icons/fa';
import { getPostBySlug, getAllPostSlugs } from '../../lib/blog/markdown';
// import { BlogPost } from '../../lib/blog/types';
import Loading from '../loading';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const paths = await getAllPostSlugs();
  return paths;
}

// This is a Server Component that fetches data
async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post youre looking for doesnt exist or has been moved.</p>
          <Link href="/blog" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors duration-300">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-6 pb-12">
            <Link href="/hardware-blog" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-300 gap-4">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-emerald-400" />
                {post.date}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-emerald-400" />
                {post.readTime} read
              </div>
              <div className="bg-emerald-900/80 text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-700/50">
                {post.category}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post content */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12"> 
            {/* Main content */}
            <div className="bg-black">
              <article 
                className="prose prose-lg prose-invert prose-emerald mx-auto
                  prose-headings:font-display prose-headings:text-emerald-400 prose-headings:font-bold
                  prose-h1:text-3xl md:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h1:text-center
                  prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-700/50
                  prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-emerald-300
                  prose-p:text-white prose-p:leading-relaxed
                  prose-a:text-emerald-400 prose-a:no-underline prose-a:transition-colors prose-a:duration-200 hover:prose-a:text-emerald-300 hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto
                            
                  prose-code:text-white prose-code:px-2 prose-code:py-1 
                  prose-code:rounded-lg prose-code:text-[0.9em] prose-code:font-mono prose-code:border prose-code:border-gray-700/30
                  prose-code:shadow-sm prose-code:break-words

                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-emerald-900/50 
                  prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:my-10 
                  prose-pre:max-h-[600px] prose-pre:overflow-auto prose-pre:scrollbar-thin
                  prose-pre:scrollbar-track-gray-800 prose-pre:scrollbar-thumb-gray-600 prose-pre:hover:scrollbar-thumb-gray-500
                  prose-pre:relative prose-pre:pt-10 prose-pre:backdrop-blur-sm

                  prose-pre:before:absolute prose-pre:before:top-0 prose-pre:before:left-0 
                  prose-pre:before:w-full prose-pre:before:h-8 prose-pre:before:bg-gray-800/70
                  prose-pre:before:rounded-t-2xl prose-pre:before:border-b prose-pre:before:border-gray-700/50
                  prose-pre:before:content-[''] prose-pre:before:flex prose-pre:before:items-center
                  prose-pre:before:px-4 prose-pre:before:text-sm prose-pre:before:font-mono
                  prose-pre:before:text-gray-400

                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-md prose-blockquote:italic
                  prose-strong:text-emerald-200
                  prose-table:rounded-lg prose-table:overflow-hidden prose-thead:bg-gray-800 prose-th:p-3 prose-td:p-3 prose-tr:border-b prose-tr:border-gray-700/50"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags section */}
              <div className="mt-16 pt-8 border-t border-gray-700">
                <div className="flex flex-wrap gap-3 justify-center"> {/* Centered tags */}
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/blog?tag=${tag}`}
                      className="px-4 py-1.5 bg-gray-700/50 text-sm text-gray-300 rounded-full hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FaTag className="shrink-0" size={14} />
                        <span>{tag}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <main className="min-h-screen bg-gray-900 text-white font-mono">
      <Suspense fallback={<Loading />}>
        <BlogPostContent slug={slug} />
      </Suspense>
    </main>
  );
}


