'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Project } from '../../lib/projects/data';

interface ProjectGalleryProps {
  project: Project;
}

const ProjectGallery = ({ project }: ProjectGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Touch handling for mobile swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Open the modal with the selected image
  const openModal = (image: string, index: number) => {
    setIsLoading(true);
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedImage(null);
    setSelectedIndex(-1);
  };

  // Navigate to the next image
  const navigateNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.additionalImages && selectedIndex < project.additionalImages.length - 1) {
      setIsLoading(true);
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(project.additionalImages[selectedIndex + 1]);
    }
  };

  // Navigate to the previous image
  const navigatePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.additionalImages && selectedIndex > 0) {
      setIsLoading(true);
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(project.additionalImages[selectedIndex - 1]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        if (project.additionalImages && selectedIndex < project.additionalImages.length - 1) {
          setIsLoading(true);
          setSelectedIndex(selectedIndex + 1);
          setSelectedImage(project.additionalImages[selectedIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (project.additionalImages && selectedIndex > 0) {
          setIsLoading(true);
          setSelectedIndex(selectedIndex - 1);
          setSelectedImage(project.additionalImages[selectedIndex - 1]);
        }
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, selectedIndex, project.additionalImages]);

  // Handle touch swipe for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX.current - touchEndX.current;
      
      if (Math.abs(diff) < swipeThreshold) return;
      
      if (diff > 0) {
        // Swiped left, go to next image
        if (project.additionalImages && selectedIndex < project.additionalImages.length - 1) {
          setIsLoading(true);
          setSelectedIndex(selectedIndex + 1);
          setSelectedImage(project.additionalImages[selectedIndex + 1]);
        }
      } else {
        // Swiped right, go to previous image
        if (project.additionalImages && selectedIndex > 0) {
          setIsLoading(true);
          setSelectedIndex(selectedIndex - 1);
          setSelectedImage(project.additionalImages[selectedIndex - 1]);
        }
      }
    };

    if (selectedImage) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedImage, selectedIndex, project.additionalImages]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  // Download image function
  const downloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `${project.title}-image-${selectedIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {project.additionalImages && project.additionalImages.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.additionalImages.map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105" 
                onClick={() => openModal(image, index)}
              >
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300" 
          onClick={closeModal}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-emerald-400 transition-colors"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            
            {/* Previous button */}
            {selectedIndex > 0 && (
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl z-10 hover:text-emerald-400 transition-colors"
                onClick={navigatePrev}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            
            {/* Next button */}
            {selectedIndex < (project.additionalImages?.length || 0) - 1 && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl z-10 hover:text-emerald-400 transition-colors"
                onClick={navigateNext}
                aria-label="Next image"
              >
                ›
              </button>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Image */}
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                width={1200}
                height={800}
                className="object-contain max-h-[90vh] transition-opacity duration-300"
                onLoad={() => setIsLoading(false)}
                priority
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {selectedIndex + 1} / {project.additionalImages?.length}
              </div>
              
              {/* Download button */}
              <button 
                className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full transition-colors text-sm"
                onClick={downloadImage}
                aria-label="Download image"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;
