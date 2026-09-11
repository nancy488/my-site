/* SupplStore — homepage behavior (index.html only).
   Data and the shared card renderer live in products.js, loaded
   before this file. This script only orchestrates: the rotating
   "Editor's picks" panel in the hero, the per-category showcase
   sections with inline "see all" expansion, and the FAQ accordion. */

document.addEventListener("DOMContentLoaded", () => {
  initHeroPicks(PRODUCTS);
  renderCategoryShowcase();
  renderFAQ();
});

/* ============ HERO: "Editor's picks" — auto-rotating ============ */
// Groups the product list into chunks of 3 and cycles through them
// every 5s with a soft fade. Nothing here is hardcoded — it reads
// straight from PRODUCTS, so it grows automatically as more products
// are added to products.js.
function initHeroPicks(products) {
  const wrapper = document.getElementById("hero-picks-card");
  const container = document.getElementById("hero-picks");
  if (!container) return;

  const GROUP_SIZE = 3;
  const groups = [];
  for (let i = 0; i < products.length; i += GROUP_SIZE) {
    let group = products.slice(i, i + GROUP_SIZE);
    if (group.length < GROUP_SIZE && products.length >= GROUP_SIZE) {
      group = group.concat(products.slice(0, GROUP_SIZE - group.length));
    }
    groups.push(group);
  }

  function renderGroup(group) {
    if (!group || group.length === 0) {
      container.innerHTML = `<p class="px-2 py-6 text-center text-sm text-[#8A8A84]">Picks will appear here once product data loads.</p>`;
      return;
    }
    container.innerHTML = group.map(pickRow).join("");
  }

  renderGroup(groups[0]);
  if (groups.length <= 1) return; // nothing else to rotate through

  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let index = 0;
  let timer = window.setInterval(advance, 5000);

  function advance() {
    index = (index + 1) % groups.length;
    container.classList.add("opacity-0");
    window.setTimeout(() => {
      renderGroup(groups[index]);
      container.classList.remove("opacity-0");
    }, 300);
  }

  if (wrapper) {
    wrapper.addEventListener("mouseenter", () => window.clearInterval(timer));
    wrapper.addEventListener("mouseleave", () => {
      timer = window.setInterval(advance, 5000);
    });
  }
}

function pickRow(product) {
  const badge = product.badge
    ? `<span class="shrink-0 rounded-full bg-[#1F3D2E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">${product.badge}</span>`
    : "";
  return `
    <a href="${product.guideUrl}"
       class="group flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-[#F9F8F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
      <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE4] p-2">
        ${productArt(product)}
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[10px] font-semibold uppercase tracking-wide text-[#A9793C]">${product.categoryName}</div>
        <div class="flex items-center gap-2">
          <span class="truncate font-serif text-base font-bold text-[#1A1A1A]">${product.title}</span>
          ${badge}
        </div>
      </div>
      <svg class="h-4 w-4 shrink-0 text-[#B8B4A8] transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>
    </a>`;
}

/* ============ Per-category showcase, 6-up with inline "see all" ============ */
// Renders one section per category that actually has products (skips
// the categories with zero products so far — add products in
// products.js and a section appears automatically).
function renderCategoryShowcase() {
  const container = document.getElementById("category-showcase");
  if (!container) return;

  const sections = CATEGORIES.map((cat) => {
    const products = PRODUCTS.filter((p) => p.categorySlug === cat.slug);
    return products.length > 0 ? buildCategorySection(cat, products) : "";
  }).join("");

  container.innerHTML =
    sections.trim() ||
    `<div class="rounded-3xl border border-dashed border-[#DDD8CB] bg-white py-16 text-center">
       <p class="text-sm text-[#555555]">No buyer guides published yet — check back soon.</p>
     </div>`;

  container.querySelectorAll("[data-see-all]").forEach((btn) => {
    btn.addEventListener("click", () => toggleSeeAll(btn));
  });
}

function buildCategorySection(cat, products) {
  const INITIAL_COUNT = 6;
  const initial = products.slice(0, INITIAL_COUNT);
  const rest = products.slice(INITIAL_COUNT);

  const initialGrid = `
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${initial.map(buildProductCardHTML).join("")}
    </div>`;

  const expandBlock =
    rest.length > 0
      ? `
    <div data-expand class="grid grid-rows-[0fr] transition-all duration-500 ease-in-out">
      <div class="overflow-hidden">
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${rest.map(buildProductCardHTML).join("")}
        </div>
      </div>
    </div>`
      : "";

  const seeAllTrigger =
    rest.length > 0
      ? `
    <button type="button" data-see-all data-count="${products.length}" data-category="${cat.name}"
      class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F3D2E] transition-colors hover:text-[#16301F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
      <span data-label>See all ${products.length} ${cat.name} →</span>
    </button>`
      : "";

  return `
    <div class="border-b border-[#ECE7DA] py-10" data-category-section>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-1 text-xs font-semibold uppercase tracking-widest text-[#A9793C]">• ${cat.subTag}</div>
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <a href="/category/${cat.slug}" class="font-serif text-2xl font-bold text-[#1A1A1A] hover:text-[#1F3D2E] sm:text-3xl">${cat.name}</a>
          <span class="shrink-0 text-sm font-medium text-[#8A8A84]">${products.length} products</span>
        </div>
        <div class="mt-4 border-b border-[#ECE7DA]"></div>
        ${initialGrid}
        ${expandBlock}
        ${seeAllTrigger}
      </div>
    </div>`;
}

function toggleSeeAll(btn) {
  const section = btn.closest("[data-category-section]");
  const expand = section.querySelector("[data-expand]");
  const label = btn.querySelector("[data-label]");
  const count = btn.dataset.count;
  const categoryName = btn.dataset.category;
  const isOpen = expand.classList.contains("grid-rows-[1fr]");

  if (isOpen) {
    expand.classList.remove("grid-rows-[1fr]");
    expand.classList.add("grid-rows-[0fr]");
    label.textContent = `See all ${count} ${categoryName} →`;
  } else {
    expand.classList.remove("grid-rows-[0fr]");
    expand.classList.add("grid-rows-[1fr]");
    label.textContent = `Show fewer ${categoryName} ↑`;
  }
}

/* ============ FAQ accordion ============ */
const FAQS = [
  {
    q: "How do you audit and select the supplements featured on this site?",
    a: "Every product on SupplStore passes a four-screen audit before it's published: we verify a single official manufacturer source, check ingredient and dose transparency, confirm U.S. GMP-facility manufacturing, and require a clearly stated refund window. Products that fail any of these screens don't get a published guide.",
  },
  {
    q: "Are the links on this website direct affiliate links?",
    a: "Yes — most outbound links on SupplStore are affiliate links, and we may earn a commission if you purchase through one, at no extra cost to you. Every review discloses this, and commissions never influence which products we audit or how we describe them.",
  },
  {
    q: "What is your 4-screen verification process?",
    a: "Every featured product is checked against four criteria: a single canonical official manufacturer page, transparent per-ingredient dose disclosure rather than a hidden proprietary blend, manufacturing in a registered, GMP-compliant U.S. facility, and a clearly stated, enforceable refund window.",
  },
  {
    q: "Do these products come with money-back guarantees?",
    a: "Refund-window honesty is one of our four audit screens, so every product we feature has a clearly stated money-back guarantee from the manufacturer. Terms vary by brand — check the official page linked from each buyer guide for the exact window and conditions.",
  },
  {
    q: "How frequently is product pricing and availability updated?",
    a: "We recheck official pricing and availability on a rolling basis as part of our standard methodology, since brands change bundle pricing and offers without notice. If you spot a mismatch, our Contact page has a dedicated channel for reporting it.",
  },
];

function renderFAQ() {
  const list = document.getElementById("faq-list");
  if (!list) return;

  list.innerHTML = FAQS.map(
    (item, i) => `
    <div data-faq-item>
      <h3 class="m-0">
        <button type="button" data-faq-trigger id="faq-trigger-${i}" aria-expanded="false" aria-controls="faq-panel-${i}"
          class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
          <span class="font-serif text-base font-bold text-[#1A1A1A] sm:text-lg">${item.q}</span>
          <svg data-faq-chevron class="h-5 w-5 shrink-0 text-[#8A8A84] transition-transform duration-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 8l4 4 4-4" />
          </svg>
        </button>
      </h3>
      <div id="faq-panel-${i}" role="region" aria-labelledby="faq-trigger-${i}" data-faq-panel
        class="grid grid-rows-[0fr] transition-all duration-300 ease-in-out">
        <div class="overflow-hidden">
          <p class="px-6 pb-5 text-sm leading-relaxed text-[#555555]">${item.a}</p>
        </div>
      </div>
    </div>`
  ).join("");

  const items = list.querySelectorAll("[data-faq-item]");
  items.forEach((item) => {
    const trigger = item.querySelector("[data-faq-trigger]");
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      items.forEach(closeFAQItem);
      if (!isOpen) openFAQItem(item);
    });
  });
}

function openFAQItem(item) {
  item.querySelector("[data-faq-trigger]").setAttribute("aria-expanded", "true");
  item.querySelector("[data-faq-panel]").classList.remove("grid-rows-[0fr]");
  item.querySelector("[data-faq-panel]").classList.add("grid-rows-[1fr]");
  item.querySelector("[data-faq-chevron]").classList.add("rotate-180");
}

function closeFAQItem(item) {
  item.querySelector("[data-faq-trigger]").setAttribute("aria-expanded", "false");
  item.querySelector("[data-faq-panel]").classList.remove("grid-rows-[1fr]");
  item.querySelector("[data-faq-panel]").classList.add("grid-rows-[0fr]");
  item.querySelector("[data-faq-chevron]").classList.remove("rotate-180");
}
