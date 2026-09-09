/* SupplStore — centralized product & category data.
   Loaded as a plain <script> (not fetch()), so both index.html and
   category.html can read the same PRODUCTS / CATEGORIES arrays, and
   pages work even when opened directly from disk (no local server
   needed just to see real data — fetch() of a local JSON file can't
   do that, a <script src> can).

   To add a real product photo, add an "image" field with a path —
   cards fall back to generated placeholder art (shape + accentColor)
   when "image" is absent. */

const CATEGORIES = [
  {
    id: "weight-management",
    slug: "weight-management",
    name: "Weight Management",
    subTag: "METABOLISM · LIPID BALANCE · BODY COMPOSITION",
    introText: "Independent audits of metabolism and fat-loss support formulas — verified sourcing, transparent pricing, realistic timelines.",
  },
  {
    id: "sensory-sleep-wellness",
    slug: "sensory-sleep-wellness",
    name: "Sensory & Sleep Wellness",
    subTag: "REST · RECOVERY · SENSORY BALANCE",
    introText: "Buyer guides for sleep and sensory-support formulas, checked against official ingredient and dosage claims.",
  },
  {
    id: "mens-wellness",
    slug: "mens-wellness",
    name: "Men's Wellness",
    subTag: "VITALITY · PERFORMANCE · HORMONE SUPPORT",
    introText: "Independent reviews of men's vitality and performance formulas, verified against official manufacturer sources.",
  },
  {
    id: "blood-sugar-support",
    slug: "blood-sugar-support",
    name: "Blood Sugar Support",
    subTag: "GLUCOSE BALANCE · METABOLIC HEALTH",
    introText: "Audits of blood-sugar and metabolic-support supplements, with side-by-side official pricing.",
  },
  {
    id: "joint-nerve-support",
    slug: "joint-nerve-support",
    name: "Joint & Nerve Support",
    subTag: "MOBILITY · FLEXIBILITY · NERVE COMFORT",
    introText: "Buyer guides for joint mobility and nerve-comfort formulas, checked against label and sourcing claims.",
  },
  {
    id: "digestive-wellness",
    slug: "digestive-wellness",
    name: "Digestive Wellness",
    subTag: "GUT HEALTH · MICROBIOME · REGULARITY",
    introText: "Independent audits of gut-health and digestive formulas, verified against official ingredient disclosures.",
  },
  {
    id: "cognitive-support",
    slug: "cognitive-support",
    name: "Cognitive Support",
    subTag: "FOCUS · MEMORY · MENTAL CLARITY",
    introText: "Reviews of focus and memory-support formulas, checked against official manufacturer claims and pricing.",
  },
  {
    id: "dental-health",
    slug: "dental-health",
    name: "Dental Health",
    subTag: "ORAL HYGIENE · GUM HEALTH",
    introText: "Buyer guides for oral-care supplements, verified against official ingredient and sourcing claims.",
  },
  {
    id: "general-wellness",
    slug: "general-wellness",
    name: "General Wellness",
    subTag: "DAILY FOUNDATION · IMMUNE SUPPORT",
    introText: "Audits of everyday foundational-health formulas, checked against official label and pricing claims.",
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "Beauty",
    subTag: "SKIN · HAIR · NAILS FROM WITHIN",
    introText: "Independent reviews of beauty-from-within formulas, verified against official ingredient disclosures.",
  },
  {
    id: "eye-health",
    slug: "eye-health",
    name: "Eye Health",
    subTag: "VISION SUPPORT · EYE COMFORT",
    introText: "Buyer guides for vision-support supplements, checked against official manufacturer claims.",
  },
  {
    id: "womens-wellness",
    slug: "womens-wellness",
    name: "Women's Wellness",
    subTag: "HORMONE BALANCE · CYCLE SUPPORT",
    introText: "Audits of women's hormone and cycle-support formulas, verified against official sourcing claims.",
  },
  {
    id: "nail-skin-health",
    slug: "nail-skin-health",
    name: "Nail & Skin Health",
    subTag: "STRENGTH · HYDRATION · REPAIR",
    introText: "Independent reviews of nail and skin-strength formulas, checked against official ingredient claims.",
  },
  {
    id: "skin-health",
    slug: "skin-health",
    name: "Skin Health",
    subTag: "HYDRATION · BARRIER SUPPORT",
    introText: "Buyer guides for skin-barrier and hydration formulas, verified against official sourcing claims.",
  },
  {
    id: "topical-pain-relief",
    slug: "topical-pain-relief",
    name: "Topical Pain Relief",
    subTag: "JOINT COMFORT · MUSCLE RECOVERY",
    introText: "Audits of topical joint and muscle-relief products, checked against official label claims.",
  },
  {
    id: "pet-wellness",
    slug: "pet-wellness",
    name: "Pet Wellness",
    subTag: "MOBILITY · COAT HEALTH · DAILY VITALITY",
    introText: "Independent reviews of pet mobility and wellness formulas, verified against official manufacturer sourcing.",
  },
];

const PRODUCTS = [
  {
    id: "cardio-slim-tea",
    title: "Cardio Slim Tea",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "cardioslimtea.supplstore.com",
    shape: "pouch",
    accentColor: "#1F7A6C",
    badge: "New",
    ratingMeta: "Official-source verified",
    description: "An independent look at Cardio Slim Tea's label claims, brewing directions, and ingredient sourcing, plus how official pricing compares across bundle sizes.",
    guideUrl: "review.html?product=cardio-slim-tea",
    affiliateUrl: "https://www.cardioslimtea.example",
  },
  {
    id: "citrus-burn",
    title: "Citrus Burn",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "citrusburn.supplstore.com",
    shape: "bottle",
    accentColor: "#D9502B",
    badge: "60 Days",
    ratingMeta: "Official-source verified",
    description: "A plain-language breakdown of Citrus Burn's formula, serving size, and refund policy, checked against the brand's own official product page.",
    guideUrl: "review.html?product=citrus-burn",
    affiliateUrl: "https://www.citrusburn.example",
  },
  {
    id: "feilaira",
    title: "Feilaira",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "feilaira.supplstore.com",
    shape: "bottle",
    accentColor: "#B98A3D",
    badge: "New",
    ratingMeta: "Official-source verified",
    description: "Our audit of Feilaira covers its stated ingredient list, manufacturing claims, and how its official pricing stacks up against similar capsules.",
    guideUrl: "review.html?product=feilaira",
    affiliateUrl: "https://www.feilaira.example",
  },
  {
    id: "finessa",
    title: "Finessa",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "finessa.supplstore.com",
    shape: "jar",
    accentColor: "#2B4560",
    badge: null,
    ratingMeta: "Official-source verified",
    description: "An independent buyer's guide to Finessa, reviewing its digestive-support formula, dosage directions, and official-page pricing before you commit.",
    guideUrl: "review.html?product=finessa",
    affiliateUrl: "https://www.finessa.example",
  },
  {
    id: "flash-burn",
    title: "Flash Burn",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "flashburn.supplstore.com",
    shape: "dropper",
    accentColor: "#1F4D3B",
    badge: "New",
    ratingMeta: "Official-source verified",
    description: "A source-verified look at Flash Burn's drop-based formula, suggested use, and how its official discount tiers actually compare.",
    guideUrl: "review.html?product=flash-burn",
    affiliateUrl: "https://www.flashburn.example",
  },
  {
    id: "keyslim-drops",
    title: "KeySlim Drops",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "keyslimdrops.supplstore.com",
    shape: "dropper",
    accentColor: "#223330",
    badge: "60 Days",
    ratingMeta: "Official-source verified",
    description: "Our overview of KeySlim Drops walks through the labeled ingredients and usage directions, so you know exactly what you're ordering.",
    guideUrl: "review.html?product=keyslim-drops",
    affiliateUrl: "https://www.keyslimdrops.example",
  },
  {
    id: "lavaslim",
    title: "LavaSlim",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "lavaslim.supplstore.com",
    shape: "bottle",
    accentColor: "#5B4A85",
    badge: "New",
    ratingMeta: "Official-source verified",
    description: "An independent audit of LavaSlim's capsule formula and sourcing claims, with a side-by-side look at official page pricing.",
    guideUrl: "review.html?product=lavaslim",
    affiliateUrl: "https://www.lavaslim.example",
  },
  {
    id: "leptozan",
    title: "Leptozan",
    categorySlug: "weight-management",
    categoryName: "Weight Management",
    subdomain: "leptozan.supplstore.com",
    shape: "bottle",
    accentColor: "#D98A2E",
    badge: null,
    ratingMeta: "Official-source verified",
    description: "A plain-language guide to Leptozan covering its stated formula, recommended use, and how official bundle pricing compares.",
    guideUrl: "review.html?product=leptozan",
    affiliateUrl: "https://www.leptozan.example",
  },
];

/* ---------------------------------------------------------------------
   Shared rendering helpers. Both index.html (category showcase, hero
   picks) and category.html (full inventory grid) call these so every
   product card looks identical everywhere on the site.
   ------------------------------------------------------------------ */

// Brand-styled placeholder art for products without a real photo yet.
// Add an "image" field to a product above to use a real photo instead —
// buildProductCardHTML() prefers it automatically.
function productArt(product) {
  const c = product.accentColor || "#1F3D2E";
  const shapes = {
    pouch: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.title} package">
        <rect x="35" y="30" width="90" height="24" rx="10" fill="${c}" opacity="0.55"/>
        <rect x="25" y="50" width="110" height="140" rx="20" fill="${c}"/>
        <rect x="50" y="98" width="60" height="48" rx="8" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    bottle: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.title} bottle">
        <rect x="63" y="14" width="34" height="24" rx="5" fill="#33332F"/>
        <rect x="70" y="36" width="20" height="16" fill="${c}"/>
        <rect x="40" y="48" width="80" height="136" rx="16" fill="${c}"/>
        <rect x="50" y="96" width="60" height="48" rx="6" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    jar: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.title} jar">
        <rect x="33" y="24" width="94" height="24" rx="6" fill="#33332F"/>
        <rect x="28" y="46" width="104" height="134" rx="22" fill="${c}"/>
        <rect x="42" y="94" width="76" height="52" rx="8" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
    dropper: `
      <svg viewBox="0 0 160 200" class="h-full w-auto" role="img" aria-label="${product.title} dropper bottle">
        <rect x="62" y="8" width="36" height="32" fill="#2A2A28"/>
        <polygon points="58,40 102,40 92,62 68,62" fill="${c}"/>
        <rect x="45" y="62" width="70" height="122" rx="14" fill="${c}"/>
        <rect x="55" y="102" width="50" height="44" rx="6" fill="#FFFFFF" opacity="0.92"/>
      </svg>`,
  };
  return shapes[product.shape] || shapes.bottle;
}

// The unified product card: used by the homepage category showcase AND
// the dedicated category page, so both stay visually identical.
function buildProductCardHTML(product) {
  const badgeHTML = product.badge
    ? `<span class="absolute right-3 top-3 rounded-full bg-[#1F3D2E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">${product.badge}</span>`
    : "";
  const art = product.image
    ? `<img src="${product.image}" alt="${product.title}" class="max-h-full">`
    : productArt(product);

  return `
    <div class="flex flex-col rounded-2xl border border-[#ECE7DA] bg-white p-5 shadow-[0_2px_14px_rgba(26,26,26,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(26,26,26,0.09)]">
      <div class="relative mb-4 flex h-40 items-center justify-center">
        ${badgeHTML}
        ${art}
      </div>
      <span class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#A9793C]">${product.categoryName}</span>
      <h3 class="mb-1 font-serif text-xl font-bold text-[#1A1A1A]">${product.title}</h3>
      <p class="mb-2 text-xs font-medium text-[#6E8A73]">${product.ratingMeta}</p>
      <p class="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#555555]">${product.description}</p>
      <div class="flex items-center gap-2">
        <a href="${product.guideUrl}"
           class="flex-1 rounded-full bg-[#1F3D2E] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#16301F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
          Buyer guide →
        </a>
        <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer nofollow"
           class="flex-1 rounded-full border border-[#1A1A1A] px-4 py-2.5 text-center text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3D2E]">
          Visit page ↗
        </a>
      </div>
    </div>`;
}
