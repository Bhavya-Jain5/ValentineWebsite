/* ============================================
   FOR AASTU — Valentine's Week Website
   Shared JavaScript
   ============================================ */

const TEST_MODE = true; // Set to true to bypass date checks

// ---- Date Gating (IST Timezone) ----
// Days: 1=Feb7, 2=Feb8, ..., 8=Feb14
// Midnight IST = UTC 18:30 previous day
function isDayUnlocked(dayNumber) {
  if (TEST_MODE) return true;
  const unlockUTC = new Date(Date.UTC(2026, 1, 5 + dayNumber, 18, 30, 0));
  return new Date() >= unlockUTC;
}

function getDaysUntilUnlock(dayNumber) {
  if (TEST_MODE) return 0;
  const unlockUTC = new Date(Date.UTC(2026, 1, 5 + dayNumber, 18, 30, 0));
  const now = new Date();
  const diff = unlockUTC - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCountdownToDay1() {
  if (TEST_MODE) return null;
  const unlockUTC = new Date(Date.UTC(2026, 1, 6, 18, 30, 0)); // Feb 7 midnight IST
  const now = new Date();
  const diff = unlockUTC - now;
  if (diff <= 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
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
  const dayNames = ['', 'Rose Day', 'Propose Day', 'Chocolate Day', 'Teddy Day', 'Promise Day', 'Hug Day', 'Kiss Day', "Valentine's Day"];
  
  const overlay = document.createElement('div');
  overlay.className = 'locked-overlay';
  overlay.innerHTML = `
    <div class="locked-emoji">🔒</div>
    <div class="locked-text">${dayNames[dayNumber]} isn't here yet</div>
    <div class="locked-subtext">Unlocks in ${daysLeft} day${daysLeft > 1 ? 's' : ''} ♡</div>
    <a href="index.html" class="locked-btn">← Back to Hub</a>
  `;
  document.body.appendChild(overlay);
}


// ---- Scroll-triggered Animations ----
function initScrollAnimations(selector = '.milestone, .promise-item, .valentine-letter p') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
      const remaining = getCountdownToDay1();
      if (remaining) {
        countdownEl.textContent = `First day unlocks in ${remaining}`;
        countdownEl.style.display = 'inline-block';
      } else {
        countdownEl.style.display = 'none';
      }
    };
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  }
}
