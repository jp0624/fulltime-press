const featureBackdrops = new Map([
  ['edges-of-the-game', 'hero-hockey'],
  ['around-the-wall', 'hero-soccer'],
  ['the-wet-line', 'hero-motorsport'],
  ['four-shots', 'hero-tennis'],
  ['window-downfield', 'hero-football']
]);

export function initHero(featured) {
  const hero = document.querySelector('.hero');
  const stage = hero.querySelector('.hero-stage');
  const controls = hero.querySelector('.hero-controls');
  const dots = hero.querySelector('.hero-dots');
  const play = controls.querySelector('[data-carousel="play"]');
  const status = hero.querySelector('.hero-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [stage.firstElementChild];
  const indicators = [];
  let current = 0;
  let paused = motion.matches;
  let timer;
  let touchStart;
  let depthFrame = 0;

  featured.forEach((story, index) => {
    if (index) {
      const slide = document.createElement('div');
      const backdrop = featureBackdrops.get(story.id);
      slide.className = 'hero-slide hero-slide--feature';
      if (backdrop) slide.classList.add('hero-slide--right-framed');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', story.title);
      slide.inert = true;
      slide.innerHTML = `
        <img src="/images/${backdrop ?? story.image}.webp" alt="" decoding="async">
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <p class="kicker"><span></span> FEATURED / ${story.sport.toUpperCase()}</p>
            <h2 class="hero-feature-title">${story.title}</h2>
            <p class="hero-dek">${story.dek}</p>
            <a class="primary" href="#story/${story.id}" data-story="${story.id}">Read the story</a>
          </div>
        </div>
      `;
      stage.append(slide);
      slides.push(slide);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show ${story.title}`);
    button.setAttribute('aria-current', String(index === 0));
    button.addEventListener('click', () => moveTo(index, true));
    dots.append(button);
    indicators.push(button);
  });

  function updateDepth() {
    depthFrame = 0;
    const {top, height, bottom} = hero.getBoundingClientRect();
    if (bottom <= 0) return;
    const displacement = motion.matches ? 0 : Math.min(Math.max(-top, 0), height);
    hero.style.setProperty('--hero-depth', `${displacement * .085}px`);
    hero.style.setProperty('--hero-foreground', `${displacement * -.04}px`);
  }

  function queueDepthUpdate() {
    if (!depthFrame) depthFrame = requestAnimationFrame(updateDepth);
  }

  function resetTimer() {
    clearInterval(timer);
    if (paused) return;
    timer = setInterval(() => {
      if (!document.hidden && !document.querySelector('#reader').open &&
          !hero.matches(':hover') && !hero.contains(document.activeElement) &&
          hero.getBoundingClientRect().bottom > 0) moveTo(current + 1);
    }, 6500);
  }

  function moveTo(position, manual = false) {
    const index = (position + slides.length) % slides.length;
    if (index !== current) {
      if (slides[current].contains(document.activeElement)) indicators[index].focus();
      slides[current].classList.remove('is-active');
      slides[current].inert = true;
      indicators[current].setAttribute('aria-current', 'false');
      current = index;
      slides[current].classList.add('is-active');
      slides[current].inert = false;
      indicators[current].setAttribute('aria-current', 'true');
      if (manual) status.textContent = `${featured[current].title}, slide ${current + 1} of ${slides.length}`;
    }
    if (manual) resetTimer();
  }

  function setPaused(value) {
    paused = value;
    play.textContent = paused ? 'Play' : 'Pause';
    play.setAttribute('aria-label', paused ? 'Play featured stories' : 'Pause featured stories');
    resetTimer();
  }

  controls.querySelector('[data-carousel="prev"]').addEventListener('click', () => moveTo(current - 1, true));
  controls.querySelector('[data-carousel="next"]').addEventListener('click', () => moveTo(current + 1, true));
  play.addEventListener('click', () => setPaused(!paused));
  motion.addEventListener('change', event => {
    setPaused(event.matches);
    queueDepthUpdate();
  });
  window.addEventListener('scroll', queueDepthUpdate, {passive: true});
  window.addEventListener('resize', queueDepthUpdate);
  queueDepthUpdate();
  hero.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveTo(current + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });
  stage.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = event.touches[0];
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.clientX;
    const dy = touch.clientY - touchStart.clientY;
    touchStart = undefined;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) moveTo(current + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = undefined; });
  controls.hidden = false;
  setPaused(paused);
}
