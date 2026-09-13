gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   PROVIDER DATA
   ============================================================ */
const PROVIDERS = [
  {
    name: "Ian Martínez, M.D.",
    title: "Gastroenterologist",
    initials: "IM",
    tags: ["Colonoscopy", "GERD", "General GI"],
    bio: "Dr. Martínez is a board-certified gastroenterologist focused on general digestive health, colorectal cancer screening, and the management of reflux and functional bowel conditions. Patients often note the time he takes to fully explain a diagnosis and treatment plan before moving forward."
  },
  {
    name: "Gabriel S. Silva, M.D.",
    title: "Gastroenterologist &amp; Hepatologist",
    initials: "GS",
    tags: ["Liver Disease", "Hepatitis", "Endoscopy"],
    bio: "Dr. Silva is a board-certified gastroenterologist with a special interest in hepatology, treating chronic liver conditions including hepatitis, cirrhosis, and fatty liver disease alongside general endoscopic care."
  },
  {
    name: "Jessica Narváez-Lugo, M.D.",
    title: "Gastroenterologist",
    initials: "JN",
    tags: ["IBD", "Women's GI Health", "Colonoscopy"],
    bio: "Dr. Narváez-Lugo is a board-certified gastroenterologist who cares for patients across the full spectrum of digestive conditions, with particular attention to inflammatory bowel disease and GI concerns unique to women."
  },
  {
    name: "Lauren Knuelle, APRN",
    title: "Nurse Practitioner",
    initials: "LK",
    tags: ["Patient Care", "Follow-Up", "General GI"],
    bio: "Lauren is a board-certified nurse practitioner who works closely with our physicians to manage ongoing care, follow-up visits, and day-to-day questions — helping make sure every patient has a direct line to support between procedures."
  }
];

/* ============================================================
   NAV: scroll state, mobile menu, active link tracking
   ============================================================ */
const nav = document.getElementById("nav");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

ScrollTrigger.create({
  start: 40,
  end: 99999,
  onUpdate: (self) => {
    nav.classList.toggle("scrolled", self.scroll() > 40);
  }
});

function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 30%",
    end: "bottom 30%",
    onToggle: (self) => {
      if (!self.isActive) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
      });
    }
  });
});

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
gsap.timeline({ defaults: { ease: "power3.out" } })
  .to(".hero-badges", { opacity: 1, y: 0, duration: 0.6 })
  .to(".hero-title", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
  .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
  .to(".hero-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.45");

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
gsap.utils.toArray(".reveal-up").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    }
  );
});

function staggerReveal(selector, container) {
  const items = (container || document).querySelectorAll(selector);
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: { trigger: items[0], start: "top 90%" }
    }
  );
}

staggerReveal(".condition-card");
staggerReveal(".procedure-card");
staggerReveal(".office-card");
staggerReveal(".patients-card");
staggerReveal(".testimonial-card");

/* ============================================================
   STAT COUNT-UP
   ============================================================ */
document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
  const target = parseInt(el.getAttribute("data-count"), 10);
  const counter = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        val: target,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(counter.val); }
      });
    }
  });
});

/* ============================================================
   CARE TEAM: render cards + modal
   ============================================================ */
const teamGrid = document.getElementById("team-grid");
PROVIDERS.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "provider-card reveal-up";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("data-provider-index", i);
  card.setAttribute("aria-label", `View details for ${p.name}`);
  card.innerHTML = `
    <div class="provider-avatar">${p.initials}</div>
    <h3 class="provider-name">${p.name}</h3>
    <p class="provider-title">${p.title}</p>
    <span class="provider-more">View bio <svg width="12" height="12"><use href="#icon-arrow"/></svg></span>
  `;
  teamGrid.appendChild(card);
});
staggerReveal(".provider-card", teamGrid);

const providerModal = document.getElementById("provider-modal");
const providerModalBackdrop = document.getElementById("provider-modal-backdrop");
const providerModalClose = document.getElementById("provider-modal-close");
const providerModalAvatar = document.getElementById("provider-modal-avatar");
const providerModalTitle = document.getElementById("provider-modal-title");
const providerModalName = document.getElementById("provider-modal-name");
const providerModalBio = document.getElementById("provider-modal-bio");
const providerModalTags = document.getElementById("provider-modal-tags");

function openProviderModal(index) {
  const p = PROVIDERS[index];
  if (!p) return;
  providerModalAvatar.textContent = p.initials;
  providerModalTitle.innerHTML = p.title;
  providerModalName.textContent = p.name;
  providerModalBio.innerHTML = `<p>${p.bio}</p>`;
  providerModalTags.innerHTML = p.tags.map((t) => `<span class="provider-modal-tag">${t}</span>`).join("");

  providerModal.hidden = false;
  gsap.fromTo(providerModal.querySelector(".provider-modal-backdrop"), { opacity: 0 }, { opacity: 1, duration: 0.25 });
  gsap.fromTo(
    providerModal.querySelector(".provider-modal-panel"),
    { opacity: 0, y: 20, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
  );
  document.body.style.overflow = "hidden";
}

function closeProviderModal() {
  gsap.to(providerModal.querySelector(".provider-modal-backdrop"), { opacity: 0, duration: 0.2 });
  gsap.to(providerModal.querySelector(".provider-modal-panel"), {
    opacity: 0,
    y: 12,
    scale: 0.97,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      providerModal.hidden = true;
      document.body.style.overflow = "";
    }
  });
}

teamGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".provider-card");
  if (!card) return;
  openProviderModal(Number(card.getAttribute("data-provider-index")));
});
teamGrid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".provider-card");
  if (!card) return;
  e.preventDefault();
  openProviderModal(Number(card.getAttribute("data-provider-index")));
});
providerModalClose.addEventListener("click", closeProviderModal);
providerModalBackdrop.addEventListener("click", closeProviderModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !providerModal.hidden) closeProviderModal();
});

/* ============================================================
   CONDITION FILTERS
   ============================================================ */
const filterButtons = document.querySelectorAll(".condition-filter");
const conditionCards = document.querySelectorAll(".condition-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");

    conditionCards.forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-category") === filter;
      if (match) {
        card.hidden = false;
        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => { card.hidden = true; }
        });
      }
    });
  });
});

/* ============================================================
   OFFICE HOURS + "OPEN NOW" STATUS
   ============================================================ */
const HOURS = {
  0: null,
  6: null,
  1: [8 * 60, 16 * 60 + 30],
  2: [8 * 60, 16 * 60 + 30],
  3: [8 * 60, 16 * 60 + 30],
  4: [8 * 60, 16 * 60 + 30],
  5: [8 * 60, 16 * 60 + 30]
};
const LUNCH = [12 * 60 + 30, 13 * 60];

function updateOfficeStatus() {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const range = HOURS[day];

  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  if (!dot || !text) return;

  let open = false;
  let label = "Closed today";

  if (range && minutes >= range[0] && minutes < range[1]) {
    if (minutes >= LUNCH[0] && minutes < LUNCH[1]) {
      label = "Closed for lunch — back at 1:00 PM";
    } else {
      open = true;
      label = "Open now";
    }
  } else if (range && minutes < range[0]) {
    label = "Opens at 8:00 AM";
  }

  dot.classList.toggle("is-open", open);
  text.textContent = label;

  document.querySelectorAll("[data-day]").forEach((el) => {
    el.classList.toggle("is-today", Number(el.getAttribute("data-day")) === day);
  });
}
updateOfficeStatus();

/* ============================================================
   APPOINTMENT FORM
   ============================================================ */
function wireForm() {
  const form = document.getElementById("appt-form");
  const success = document.getElementById("appt-success");
  if (!form) return;

  const nameField = document.getElementById("af-name");
  const phoneField = document.getElementById("af-phone");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameField.value.trim()) {
      document.getElementById("af-name-error").textContent = "Please enter your name.";
      valid = false;
    } else {
      document.getElementById("af-name-error").textContent = "";
    }

    const phoneDigits = phoneField.value.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      document.getElementById("af-phone-error").textContent = "Please enter a valid phone number.";
      valid = false;
    } else {
      document.getElementById("af-phone-error").textContent = "";
    }

    if (!valid) return;

    form.hidden = true;
    success.classList.remove("hidden");
    gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    form.reset();
  });
}
wireForm();
