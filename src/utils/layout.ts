let resizeTimeout: number | null = null;

const updateViewportDimensions = () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }

  resizeTimeout = window.setTimeout(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const isLandscape = window.innerWidth > window.innerHeight;
    const shouldForceHorizontal = isLandscape && window.innerHeight < 500;
    
    document.documentElement.classList.toggle('force-horizontal', shouldForceHorizontal);
    document.body.classList.toggle('force-horizontal-active', shouldForceHorizontal);
    
    const containers = document.querySelectorAll('.game-container, .game-layout, .game-section');
    containers.forEach(container => {
      container.classList.toggle('force-horizontal', shouldForceHorizontal);
    });

    // Ensure the body is scrollable in horizontal mode
    if (shouldForceHorizontal) {
      document.body.style.overflowY = 'auto';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflowY = '';
      document.body.style.height = '';
    }
  }, 150);
};

export const initializeLayoutHandler = () => {
  updateViewportDimensions();
  window.addEventListener('resize', updateViewportDimensions);
  window.addEventListener('orientationchange', updateViewportDimensions);
  
  return () => {
    window.removeEventListener('resize', updateViewportDimensions);
    window.removeEventListener('orientationchange', updateViewportDimensions);
    if (resizeTimeout) {
      window.clearTimeout(resizeTimeout);
    }
  };
};

export const toggleHorizontalLayout = () => {
  const isForced = document.documentElement.classList.contains('force-horizontal');
  const shouldForce = !isForced && window.innerHeight < 500;
  
  document.documentElement.classList.toggle('force-horizontal', shouldForce);
  document.body.classList.toggle('force-horizontal-active', shouldForce);
  
  const containers = document.querySelectorAll('.game-container, .game-layout, .game-section');
  containers.forEach(container => {
    container.classList.toggle('force-horizontal', shouldForce);
  });

  // Update body scroll behavior
  if (shouldForce) {
    document.body.style.overflowY = 'auto';
    document.body.style.height = '100%';
  } else {
    document.body.style.overflowY = '';
    document.body.style.height = '';
  }
  
  return shouldForce;
};