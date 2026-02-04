/* ============================================
   FOR AASTU — Valentine's Week Website
   Shared JavaScript
   ============================================ */

const TEST_MODE = false; // Set to true to bypass date checks

// ---- Date Gating (IST Timezone) ----
// Days: 1=Feb7, 2=Feb8, ..., 8=Feb14
// 6 AM IST = UTC 00:30 same day
function getUnlockDate(dayNumber) {
  return new Date(Date.UTC(2026, 1, 6 + dayNumber, 0, 30, 0));
}

function isDayUnlocked(dayNumber) {
  if (TEST_MODE) return true;
  return new Date() >= getUnlockDate(dayNumber);
}

function getDaysUntilUnlock(dayNumber) {
  if (TEST_MODE) return 0;
  const unlockUTC = getUnlockDate(dayNumber);
  const now = new Date();
  const diff = unlockUTC - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const DAY_NAMES = ['', 'Rose Day', 'Propose Day', 'Chocolate Day', 'Teddy Day', 'Promise Day', 'Hug Day', 'Kiss Day', "Valentine's Day"];

function getNextLockedDayIndex() {
  for (let i = 1; i <= 8; i++) {
    if (!isDayUnlocked(i)) {
      return i;
    }
  }
  return null; // All days unlocked
}

function getCountdownToNextUnlock() {
  if (TEST_MODE) return null;

  const nextDayIndex = getNextLockedDayIndex();
  if (!nextDayIndex) return null; // All days unlocked

  const unlockUTC = getUnlockDate(nextDayIndex);
  const now = new Date();
  const diff = unlockUTC - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

  let timeString = parts[0];
  if (parts.length > 1) {
    const lastPart = parts.pop();
    timeString = parts.join(', ') + ' and ' + lastPart;
  }

  return {
    timeString: timeString,
    dayName: DAY_NAMES[nextDayIndex]
  };
}

// Check if current page's day is unlocked, show lock screen if not
function checkDayAccess(dayNumber) {
  if (!isDayUnlocked(dayNumber)) {
    showLockScreen(dayNumber);
    return false;
  }
  return true;
}

function showLockScreen(dayNumber) {
  const daysLeft = getDaysUntilUnlock(dayNumber);

  const overlay = document.createElement('div');
  overlay.className = 'locked-overlay';
  overlay.innerHTML = `
    <div class="locked-emoji">🔒</div>
    <div class="locked-text">${DAY_NAMES[dayNumber]} isn't here yet</div>
    <div class="locked-subtext">Unlocks in ${daysLeft} day${daysLeft > 1 ? 's' : ''} ♡</div>
    <a href="index.html" class="locked-btn">← Back to Hub</a>
  `;
  document.body.appendChild(overlay);
}

// ---- Scroll-triggered Animations ----
function initScrollAnimations(selector = '.milestone, .promise-item, .valentine-letter p', soundCallback = null) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (soundCallback && typeof soundCallback === 'function') {
          soundCallback();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


// ---- Floating Petals ----
function initFloatingPetals(emoji = '🌸', count = 12) {
  const container = document.createElement('div');
  container.className = 'floating-petals';

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = emoji;
    petal.style.left = Math.random() * 100 + '%';
    petal.style.setProperty('--fall-duration', (6 + Math.random() * 6) + 's');
    petal.style.setProperty('--fall-delay', (Math.random() * 8) + 's');
    petal.style.setProperty('--petal-opacity', (0.15 + Math.random() * 0.25).toFixed(2));
    petal.style.fontSize = (0.8 + Math.random() * 0.6) + 'rem';
    container.appendChild(petal);
  }

  document.body.appendChild(container);
}


// ---- Stars (for Kiss Day) ----
function initStars(count = 80) {
  const container = document.createElement('div');
  container.className = 'stars-container';

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--delay', (Math.random() * 3) + 's');

    const size = Math.random() > 0.8 ? 3 : (Math.random() > 0.5 ? 2 : 1);
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    container.appendChild(star);
  }

  document.body.appendChild(container);
}

function triggerShootingStar() {
  if (window.SoundManager) window.SoundManager.sfxShootingStar();
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.top = (10 + Math.random() * 40) + '%';
  star.style.left = (Math.random() * 60) + '%';
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1500);
}

// ---- Hub Page Initialization ----
function initHub() {
  const cards = document.querySelectorAll('.timeline-card');

  cards.forEach(card => {
    const dayNum = parseInt(card.dataset.day);

    if (isDayUnlocked(dayNum)) {
      card.classList.add('unlocked');
      card.classList.remove('locked');

      // Remove lock text if present
      const lockText = card.querySelector('.timeline-card-lock');
      if (lockText) lockText.remove();

      // Make clickable
      card.querySelector('.timeline-card-inner').addEventListener('click', () => {
        window.location.href = `day${dayNum}.html`;
      });
    } else {
      card.classList.add('locked');
      card.classList.remove('unlocked');

      const daysLeft = getDaysUntilUnlock(dayNum);
      const lockText = card.querySelector('.timeline-card-lock');
      if (lockText) {
        lockText.textContent = `Unlocks in ${daysLeft} day${daysLeft > 1 ? 's' : ''} 🔒`;
      }
    }
  });

  // Countdown timer
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const updateCountdown = () => {
      const result = getCountdownToNextUnlock();

      if (result) {
        countdownEl.textContent = `${result.dayName} in ${result.timeString}`;
        countdownEl.style.display = 'inline-block';
      } else {
        // If no result, it might mean the timer just finished OR everything is unlocked
        // Check if we need to reload due to a recent unlock event
        const nextLocked = getNextLockedDayIndex();

        // If we were tracking a locked day and now we aren't getting a countdown, it might be time to reload
        // Or if all days are unlocked, hide the counter
        if (!nextLocked) {
          countdownEl.style.display = 'none';
          return;
        }

        if (countdownEl.style.display !== 'none') {
          // Timer just finished! Refresh to unlock.
          sessionStorage.setItem('autoReload', 'true');
          countdownEl.style.display = 'none';
          window.location.reload();
        }
        countdownEl.style.display = 'none';
      }
    };
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update every second
  }
}

// ---- Password Protection ----
function initPassword() {
  const modal = document.getElementById('password-modal');
  const input = document.getElementById('password-input');
  const btn = document.getElementById('password-submit');
  const errorMsg = document.getElementById('password-error');

  // Check if it's a reload - if so, re-lock UNLESS it was an auto-reload
  try {
    const navEntry = performance.getEntriesByType("navigation")[0];
    if (navEntry && navEntry.type === 'reload') {
      if (sessionStorage.getItem('autoReload') === 'true') {
        // It was an auto-reload (timer finished), so keep unlocked
        sessionStorage.removeItem('autoReload');
      } else {
        // Manual reload, re-lock
        sessionStorage.removeItem('unlocked');
      }
    }
  } catch (e) {
    // Fallback
  }

  // Check if already unlocked in this session
  if (sessionStorage.getItem('unlocked') === 'true') {
    modal.classList.add('hidden');
    return;
  }


  function checkCode() {
    const code = input.value;
    if (code === '0512') {
      sessionStorage.setItem('unlocked', 'true');

      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.5s';
      setTimeout(() => modal.classList.add('hidden'), 500);
    } else {
      errorMsg.classList.add('visible');
      input.value = '';
      input.focus();
      // Shake animation
      input.style.transform = 'translateX(10px)';
      setTimeout(() => input.style.transform = 'translateX(-10px)', 100);
      setTimeout(() => input.style.transform = 'translateX(10px)', 200);
      setTimeout(() => input.style.transform = 'translateX(0)', 300);
    }
  }

  btn.addEventListener('click', checkCode);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkCode();
  });

  // Clear error on input
  input.addEventListener('input', () => {
    errorMsg.classList.remove('visible');
  });
}

// Call initPassword if we are on the index page
if (document.getElementById('password-modal')) {
  initPassword();
}
