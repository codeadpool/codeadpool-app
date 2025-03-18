import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { getProjectBySlug, getAllProjectSlugs } from '../../lib/projects/data';
import Loading from '../loading';
import ProjectGalleryWrapper from '../../components/project/ProjectGalleryWrapper';
import Footer from '@/app/components/Footer';

// Generate static params for all projects
export async function generateStaticParams() {
  const paths = await getAllProjectSlugs();
  return paths;
}

// This is a Server Component that fetches data
async function ProjectContent({ slug }: { slug: string }) {
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project youre looking for doesnt exist or has been moved.</p>
          <Link href="/projects" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors duration-300">
            Back to Projects
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
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-6 pb-12">
            <Link href="/projects" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Projects
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-300 gap-4">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-emerald-400" />
                {project.date}
              </div>
              <div className="bg-emerald-900/80 text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-700/50">
                {project.tags}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project content */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12"> 
            {/* Main content */}
            <div className="bg-black">
              <article className="prose prose-lg prose-invert prose-emerald mx-auto
                prose-headings:font-display prose-headings:text-emerald-400 prose-headings:font-bold
                prose-h1:text-3xl md:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h1:text-center
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-700/50
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-emerald-300
                prose-p:text-white prose-p:leading-relaxed
                prose-a:text-emerald-400 prose-a:no-underline prose-a:transition-colors prose-a:duration-200 hover:prose-a:text-emerald-300 hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto">
                
                {/* Overview */}
                <h2>Project Overview</h2>
                <p className="whitespace-pre-line">{project.longDescription}</p>
                
                {/* Challenges */}
                <h2>Challenges</h2>
                <p className="whitespace-pre-line">{project.challenges}</p>
                
                {/* Solution */}
                <h2>Solution</h2>
                <p className="whitespace-pre-line">{project.solution}</p>
                
                {/* Outcome */}
                <h2>Outcome</h2>
                <p className="whitespace-pre-line">{project.outcome}</p>
                
                {/* Project Gallery */}
                <h2>Project Gallery</h2>
                <div className="not-prose">
                  <ProjectGalleryWrapper project={project} />
                </div>
                
                {/* Technologies */}
                <h2>Technologies Used</h2>
                <div className="not-prose flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-700/50 text-sm text-emerald-400 rounded-full border border-emerald-700/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Project Links */}
                <div className="not-prose flex flex-wrap gap-4 mt-12">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                    >
                      <FaGithub className="mr-2" />
                      View Source Code
                    </a>
                  )}
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition-colors"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// This is the main page component
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-gray-900 text-white font-mono">
      <Suspense fallback={<Loading />}>
        <ProjectContent slug={slug} />
      </Suspense>
      <Footer />
    </main>
  );
}