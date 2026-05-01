// ─────────────────────────────────────────
//  CLEAN INDIA — script.js
// ─────────────────────────────────────────

// ── 1. HAMBURGER MENU (Mobile) ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


// ── 2. ACTIVE NAV LINK on scroll ──
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


// ── 3. NAVBAR SHADOW on scroll ──
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
  }
});


// ── 4. SCROLL REVEAL ANIMATION ──
// Elements fade in when they enter the screen
const revealElements = document.querySelectorAll(
  '.step, .rewards-card, .lb-row, .stat-box, .about-text'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

// Set initial hidden state and observe
revealElements.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});





// ── 6. SMOOTH COUNTER ANIMATION (About section) ──
function animateCounter(element, target, suffix = '') {
  let start = 0;
  const duration = 1500; // ms
  const step = Math.ceil(target / (duration / 16));

  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    element.textContent = start.toLocaleString('en-IN') + suffix;
  }, 16);
}

// Only run counters when the about section enters the screen
const aboutSection = document.querySelector('.about-section');
let countersStarted = false;

if (aboutSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        const statBoxes = document.querySelectorAll('.stat-box');
        const targets   = [50000, 120, 30000, 1000000];
        const suffixes  = ['+', '+', '+', ''];

        statBoxes.forEach((box, i) => {
          const h3 = box.querySelector('h3');
          animateCounter(h3, targets[i], suffixes[i] === '' ? '+' : suffixes[i]);
        });
      }
    });
  }, { threshold: 0.3 });

  counterObserver.observe(aboutSection);
}


// ── 7. CURRENT YEAR IN FOOTER ──
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  const year = new Date().getFullYear();
  yearEl.innerHTML = yearEl.innerHTML.replace('2024', year);
}
// FAQ MODAL
const faqModal = document.getElementById("faqModal");
const openFaq = document.getElementById("openFaq");
const closeFaq = document.querySelector(".close-faq");

if(openFaq){
  openFaq.onclick = () => faqModal.style.display = "block";
  closeFaq.onclick = () => faqModal.style.display = "none";
  window.onclick = (e) => {
    if(e.target == faqModal) faqModal.style.display = "none";
  }
}
<script type="module"></script>
// FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// YOUR CONFIG (paste yours)
const firebaseConfig = {
  apiKey: "AIzaSyDa0hD-hg4_myX5Ny-1mWuHpGzf6lLZM-I",
  authDomain: "clean-india-7f943.firebaseapp.com",
  projectId: "clean-india-7f943",
  storageBucket: "clean-india-7f943.firebasestorage.app",
  messagingSenderId: "209967732261",
  appId: "1:209967732261:web:c4e6fb3b40bbdd4f8991cc",
  measurementId: "G-4JTVVXMDPN"
};

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// BUTTON FUNCTION
window.uploadProof = function () {
  document.getElementById("fileInput").click();
};

// FILE UPLOAD
document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const storageRef = ref(storage, "proofs/" + Date.now() + file.name);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "reports"), {
      image: url,
      time: new Date()
    });

    alert("✅ Uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Upload failed");
  }
});
document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});
