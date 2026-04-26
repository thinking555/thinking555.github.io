const CARD_COUNT = 10;
const SUGAR_CUBE_GRAMS = 5;

const cardGrid = document.getElementById("cardGrid");

const searchInput = document.getElementById("searchInput");

const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sugarFilter = document.getElementById("sugarFilter");

let allDrinks = [];
let keyword = "";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toNumber(value, defaultValue = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : defaultValue;
}

function round1(number) {
  return Math.round(number * 10) / 10;
}

function getTotalSugar(drink) {
  const sugarPer100ml = toNumber(drink.sugarPer100ml);
  const volume = toNumber(drink.volume);
  return round1((sugarPer100ml * volume) / 100);
}

function getTotalCalorie(drink) {
  const caloriePer100ml = toNumber(drink.caloriePer100ml);
  const volume = toNumber(drink.volume);
  return Math.round((caloriePer100ml * volume) / 100);
}

function getSugarCubes(totalSugar) {
  return round1(totalSugar / SUGAR_CUBE_GRAMS);
}

function getSugarLevel(totalSugar) {
  if (totalSugar === 0) return "zero";
  if (totalSugar <= 5) return "low";
  if (totalSugar <= 25) return "middle";
  return "high";
}

function splitTitle(brand, name) {
  const safeBrand = brand || "品牌名称";
  const safeName = name || "饮料名称";
  return `${escapeHtml(safeBrand)}<br>${escapeHtml(safeName)}`;
}

function placeholderBottle(drink) {
  const brand = escapeHtml(drink.brand || "品牌");
  const name = escapeHtml(drink.name || "饮料名称");
  const mainColor = drink.mainColor || "#e5392f";

  return `
    <svg class="bottle-svg" viewBox="0 0 150 400" role="img" aria-label="${brand}${name}">
      <rect x="55" y="5" width="40" height="28" rx="7" fill="#f4f6f8" stroke="#d5dce2" />
      <rect x="52" y="30" width="46" height="22" rx="5" fill="#eef3f7" stroke="#d5dce2" />
      <path d="M48 53 C48 72 36 83 32 103 L24 348 C22 374 42 392 75 392 C108 392 128 374 126 348 L118 103 C114 83 102 72 102 53 Z" fill="#f7fbff" stroke="#cfd8df" stroke-width="2" />
      <path d="M31 115 C48 122 101 122 119 115 L116 182 C96 190 52 190 34 182 Z" fill="#ffffff" stroke="#e1e1e1" />
      <path d="M33 131 C48 125 51 154 67 154 C82 154 86 126 119 130 L116 174 C87 168 83 186 65 183 C48 180 45 155 34 162 Z" fill="${escapeHtml(mainColor)}" opacity="0.92" />
      <text x="75" y="145" text-anchor="middle" font-size="16" font-weight="800" fill="${escapeHtml(mainColor)}" font-family="Arial, sans-serif">${brand}</text>
      <text x="75" y="166" text-anchor="middle" font-size="9" fill="#444" font-family="Arial, sans-serif">${name}</text>
      <path d="M30 213 C48 225 101 225 120 213" fill="none" stroke="#d8e0e6" stroke-width="2" />
      <path d="M29 244 C48 256 102 256 121 244" fill="none" stroke="#d8e0e6" stroke-width="2" />
      <path d="M28 276 C48 288 102 288 122 276" fill="none" stroke="#d8e0e6" stroke-width="2" />
      <path d="M27 310 C48 322 102 322 123 310" fill="none" stroke="#d8e0e6" stroke-width="2" />
      <ellipse cx="75" cy="365" rx="40" ry="13" fill="none" stroke="#cfd8df" stroke-width="2" />
    </svg>
  `;
}

function renderImage(drink, imageKey) {
  const image = drink[imageKey];

  if (image) {
    return `
      <img
        class="product-image"
        src="${escapeHtml(image)}"
        alt="${escapeHtml((drink.brand || "") + (drink.name || ""))}"
      />
    `;
  }

  return placeholderBottle(drink);
}

function renderCard(drink) {
  const totalSugar = getTotalSugar(drink);
  const sugarCubes = getSugarCubes(totalSugar);
  const totalCalorie = getTotalCalorie(drink);
  const volumeText = drink.volume ? `${drink.volume}ml` : "待填写";

  return `
    <article class="drink-card">
      <div class="image-area" aria-label="自动滚动图片区域">
        <div class="slider-track">
  <div class="slide">
    ${renderImage(drink, "image1")}
  </div>

  <div class="slide ${drink.image2 ? "" : "slide-green"}" aria-label="第二张图片">
    ${drink.image2 ? renderImage(drink, "image2") : ""}
  </div>
</div>
      </div>

      <main class="info">
        <h2 class="title">${splitTitle(drink.brand, drink.name)}</h2>

        <div class="spec">常见规格：${escapeHtml(volumeText)}</div>

        <section class="sugar-panel" aria-label="含糖信息">
          <p class="sugar-meta">含糖约 ${totalSugar}g</p>

          <div class="sugar-row">
            <span class="approx">约</span>
            <span class="number">${sugarCubes}</span>
            <span class="unit">块方糖</span>
          </div>

          <div class="calorie">热量约 ${totalCalorie}kcal</div>
        </section>
      </main>
    </article>
  `;
}





const MAX_CARD_COUNT = 10;

async function loadDrinks() {
  try {
    const response = await fetch("./data/drinks.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("drinks.json 加载失败");
    }

    const text = await response.text();

    // 如果 drinks.json 是空白文件，不显示卡片
    if (!text.trim()) {
      return [];
    }

    const drinks = JSON.parse(text);

    // 如果不是数组，不显示卡片
    if (!Array.isArray(drinks)) {
      return [];
    }

    // 有几条数据就显示几张，最多显示 10 张
    return drinks.slice(0, MAX_CARD_COUNT);
  } catch (error) {
    console.error(error);

    // JSON 写错、路径错误、加载失败时，不显示卡片
    return [];
  }
}


function initFilters() {
  const brands = [...new Set(allDrinks.map(drink => drink.brand).filter(Boolean))];
  const categories = [...new Set(allDrinks.map(drink => drink.category).filter(Boolean))];

  brandFilter.innerHTML =
    `<option value="all">全部品牌</option>` +
    brands
      .map(brand => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`)
      .join("");

  categoryFilter.innerHTML =
    `<option value="all">全部分类</option>` +
    categories
      .map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join("");
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

function getFilteredDrinks() {
  const keyword = normalizeText(searchInput ? searchInput.value : "");
  const selectedBrand = brandFilter ? brandFilter.value : "all";
  const selectedCategory = categoryFilter ? categoryFilter.value : "all";
  const selectedSugar = sugarFilter ? sugarFilter.value : "all";

  return allDrinks.filter(drink => {
    const totalSugar = getTotalSugar(drink);
    const sugarLevel = getSugarLevel(totalSugar);

    const searchText = normalizeText([
      drink.id,
      drink.brand,
      drink.name,
      drink.category,
      drink.volume,
      drink.sugarPer100ml,
      drink.caloriePer100ml
    ].join(" "));

    const matchKeyword = !keyword || searchText.includes(keyword);
    const matchBrand = selectedBrand === "all" || drink.brand === selectedBrand;
    const matchCategory = selectedCategory === "all" || drink.category === selectedCategory;
    const matchSugar = selectedSugar === "all" || sugarLevel === selectedSugar;

    return matchKeyword && matchBrand && matchCategory && matchSugar;
  });
}

function renderDrinks() {
  const drinks = getFilteredDrinks();

  if (drinks.length === 0) {
    cardGrid.innerHTML = "";
    return;
  }

  cardGrid.innerHTML = drinks
    .map((drink, index) => renderCard(drink, index))
    .join("");
}

async function init() {
  allDrinks = await loadDrinks();

  initFilters();
  renderDrinks();

  searchInput.addEventListener("input", renderDrinks);
  brandFilter.addEventListener("change", renderDrinks);
  categoryFilter.addEventListener("change", renderDrinks);
  sugarFilter.addEventListener("change", renderDrinks);
}

init();
