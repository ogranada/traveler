

/**
 * Start main Animation
 */
export function startAnimation() {
  const body = document.querySelector('body');
  const TRIGGER = 'animation-trigger';
  const icon = document.querySelector('.Loader-icon');
  if (icon) {
    if (document.fonts && document.fonts) {
      document.fonts.ready.then(() => {
        icon.classList.add('shown');
        setTimeout(() => {
          icon.classList.toggle('isAnimated');
          icon.classList.toggle('shadow');
        }, 500);
      });
    }
  }
  body.classList.toggle(TRIGGER);
}

/**
 * Stops loading animation
 */
export function stopAnimation() {
  const body = document.querySelector('body');
  const HIDING = 'hiding';
  const TRIGGER = 'animation-trigger';
  body.classList.toggle(HIDING);
  const loader = document.querySelector('.Loader');
  if (loader) {
    setTimeout(() => {
      loader.style.display = 'none';
      body.classList.remove(HIDING);
      body.classList.remove(TRIGGER);
    }, 500);
  }
}


