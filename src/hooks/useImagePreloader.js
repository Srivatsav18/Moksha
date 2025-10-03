import { useState, useEffect } from 'react';

export const useImagePreloader = (imageUrls) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadedImages(prev => new Set([...prev, url]));
          
          // All images loaded
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve(url);
        };
        img.onerror = () => {
          loadedCount++;
          // Even if image fails, count it as "loaded" so we don't wait forever
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          reject(url);
        };
        img.src = url;
      });
    };

    // Preload all images
    Promise.allSettled(imageUrls.map(preloadImage));

  }, [imageUrls]);

  return { imagesLoaded, loadedImages };
};