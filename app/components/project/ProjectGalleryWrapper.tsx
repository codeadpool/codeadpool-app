'use client';

import dynamic from 'next/dynamic';
import { Project } from '../../lib/projects/data';

// Dynamically import the ProjectGallery component with no SSR
const ProjectGallery = dynamic(() => import('./ProjectGallery'), { ssr: false });

interface ProjectGalleryWrapperProps {
  project: Project;
}

const ProjectGalleryWrapper = ({ project }: ProjectGalleryWrapperProps) => {
  return <ProjectGallery project={project} />;
};

export default ProjectGalleryWrapper;
