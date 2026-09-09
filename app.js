/* SupplStore — catalog rendering + real-time category filtering
   Everything here is data-driven from data/products.json. No product
   cards are hardcoded in index.html. */

// Canonical category list for the pill bar. This is site navigation
// structure (not product data), so it lives here rather than in
// products.json — every pill renders even for categories that don't
// have a product yet.
const CATEGORIES = [
  "Weight Management",
  "Sensory & Sleep Wellness",
  "Men's Wellness",
  "Blood Sugar Support",
  "Joint & Nerve Support",
  "Digestive Wellness",
  "Cognitive Support",
  "Dental Health",
  "General Wellness",
  "Beauty",
  "Eye Health",
  "Women's Wellness",
  "Nail & Skin Health",
  "Skin Health",
  "Topical Pain Relief",
  "Pet Wellness",
];

let allProducts = [];
let activeCategory = "All";
let loadFailed = false;

async function init() {
  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allProducts = await res.json();
  } catch (err) {
    console.error("Could not load data/products.json", err);
    allProducts = [];
    loadFailed = true;
  }
  renderPills();
  renderGrid();
  initHeroPicks(allProducts);
}

function renderPills() {
  const container = document.getElementById("category-pills");
  if (!container) return;

  const counts = { All: allProducts.length };
  CATEGORIES.forEach((cat) => {
    counts[cat] = allProducts.filter((p) => p.category === cat).length;
  });

  const pillList = ["All", ...CATEGORIES];

  container.innerHTML = "";
  pillList.forEach((cat) => {
    const isActive = cat === activeCategory;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(isActive));
    btn.className = [
      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]",
      isActive
        ? "bg-[#1F3D2E] border-[#1F3D2E] text-white"
        : "bg-white border-[#E3DFD3] text-[#3A3A38] hover:border-[#1F3D2E]",
    ].join(" ");

    const countClasses = isActive
      ? "bg-white/20 text-white"
      : "bg-[#F1EEE4] text-[#7A7A73]";

    btn.innerHTML = `<span>${cat}</span><span class="rounded-full px-1.5 py-0.5 text-xs ${countClasses}">${counts[cat]}</span>`;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderPills();
      renderGrid();
    });
    container.appendChild(btn);
  });
}

function renderGrid() {
  const grid = document.getElementById("product-grid");
  const empty = document.getElementById("empty-state");
  if (!grid || !empty) return;

  grid.innerHTML = "";

  // Data failed to load at all (e.g. the page was opened directly as a
  // file:// address, which browsers block from fetching local JSON) —
  // this is different from "this category has zero products", so it
  // gets its own message instead of the generic empty state.
  if (loadFailed) {
    empty.innerHTML = `
      <p class="text-sm font-semibold text-[#1A1A1A]">Couldn't load the product catalog.</p>
      <p class="mx-auto mt-2 max-w-md text-sm text-[#555555]">
        If you opened this file directly from your file system (the address bar shows
        <span class="font-mono text-xs">file://...</span>), your browser blocks it from
        reading <span class="font-mono text-xs">data/products.json</span>. Serve this folder
        through a local server, or deploy it (e.g. to Netlify), then reload.
      </p>`;
    empty.classList.remove("hidden");
    return;
  }

  const filtered =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  if (filtered.length === 0) {
    empty.innerHTML = `<p class="text-sm text-[#555555]">No buyer guides in this category yet — check back soon.</p>`;
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  filtered.forEach((product) => grid.appendChild(buildCard(product)));
}

function buildCard(product) {
  const card = document.createElement("div");
  card.className =
    "flex flex-col rounded-3xl border border-[#ECE7DA] bg-white p-5 shadow-[0_2px_14px_rgba(26,26,26,0.04)] transition-shadow hover:shadow-[0_6px_24px_rgba(26,26,26,0.08)]";

  const art = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="max-h-full">`
    : productArt(product);

  card.innerHTML = `
    <div class="mb-4 flex h-40 items-center justify-center">${art}</div>
    <span class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#A9793C]">${product.category}</span>
    <h3 class="mb-1 font-serif text-xl font-bold text-[#1A1A1A]">${product.name}</h3>
    <p class="mb-3 font-mono text-[11px] text-[#9A9A94]">${product.subdomain}</p>
    <p class="mb-5 flex-1 text-sm leading-relaxed text-[#555555]">${product.summary}</p>
    <div class="flex items-center gap-2">
      <a href="review.html?product=${encodeURIComponent(product.id)}"
         class="flex-1 rounded-full bg-[#1F3D2E] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#16301F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
        Buyer guide →
      </a>
      <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow"
         class="flex-1 rounded-full border border-[#1A1A1A] px-4 py-2.5 text-center text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
        Visit page ↗
      </a>
    </div>
  `;
  return card;
}

// Simple, brand-styled placeholder art (no real product photography is
// available to this build). Give a product a real photo later by adding
// an "image" field to its entry in data/products.json — buildCard() will
// use that automatically instead of this generated shape.
function productArt(product) {
  const c = product.accentColor || "#1F3D2E";
  const shapes = {
    pouch: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.name} package">
        <rect x="35" y="30" width="90" height="24" rx="10" fill="${c}" opacity="0.55"/>
        <rect x="25" y="50" width="110" height="140" rx="20" fill="${c}"/>
        <rect x="50" y="98" width="60" height="48" rx="8" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    bottle: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.name} bottle">
        <rect x="63" y="14" width="34" height="24" rx="5" fill="#33332F"/>
        <rect x="70" y="36" width="20" height="16" fill="${c}"/>
        <rect x="40" y="48" width="80" height="136" rx="16" fill="${c}"/>
        <rect x="50" y="96" width="60" height="48" rx="6" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    jar: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.name} jar">
        <rect x="33" y="24" width="94" height="24" rx="6" fill="#33332F"/>
        <rect x="28" y="46" width="104" height="134" rx="22" fill="${c}"/>
        <rect x="42" y="94" width="76" height="52" rx="8" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    dropper: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.name} dropper bottle">
        <rect x="62" y="8" width="36" height="32" fill="#2A2A28"/>
        <polygon points="58,40 102,40 92,62 68,62" fill="${c}"/>
        <rect x="45" y="62" width="70" height="122" rx="14" fill="${c}"/>
        <rect x="55" y="102" width="50" height="44" rx="6" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
  };
  return shapes[product.shape] || shapes.bottle;
}

// ============ HERO: "Editor's picks" — auto-rotating, data-driven ============
// Groups the real product list into chunks of 3 and cycles through the
// groups every 5s with a soft fade. Nothing here is hardcoded — it reads
// straight from the same allProducts array the grid uses, so it grows
// automatically as more products/categories are added to products.json.
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

  // Respect reduced-motion preferences: show the first set, don't auto-advance.
  // (Feature-detected — matchMedia isn't guaranteed in every environment.)
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

  // Pause the rotation while the visitor's mouse is over the card so it
  // doesn't change out from under someone about to click a pick.
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
    <a href="review.html?product=${encodeURIComponent(product.id)}"
       class="group flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-[#F9F8F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
      <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE4] p-2">
        ${productArt(product)}
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[10px] font-semibold uppercase tracking-wide text-[#A9793C]">${product.category}</div>
        <div class="flex items-center gap-2">
          <span class="truncate font-serif text-base font-bold text-[#1A1A1A]">${product.name}</span>
          ${badge}
        </div>
      </div>
      <svg class="h-4 w-4 shrink-0 text-[#B8B4A8] transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>
    </a>`;
}

document.addEventListener("DOMContentLoaded", init);
