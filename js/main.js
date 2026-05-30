const PAGE_SIZE = 20;
let visibleCount = PAGE_SIZE;
const loadMoreBtn = document.getElementById("loadMoreBtn");

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
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  const sugarLevel = getSugarLevel(totalSugar);
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
            <span class="number sugar-number ${sugarLevel}">${sugarCubes}</span>
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
    const response = await fetch("./data/drinks.json?v=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("drinks.json 加载失败，状态码：" + response.status);
    }

    const text = await response.text();

    if (!text.trim()) {
      return [];
    }

    const drinks = JSON.parse(text);

    if (!Array.isArray(drinks)) {
      throw new Error("drinks.json 必须是数组格式");
    }

    return drinks;
  } catch (error) {
    console.error(error);

    if (cardGrid) {
      cardGrid.innerHTML = `
        <div class="data-error">
          数据加载失败：${escapeHtml(error.message)}<br>
          请确认手机访问的是 http/https 网站地址，不是 file:// 本地文件；并确认 data/drinks.json 路径和大小写正确。
        </div>
      `;
    }

    return null;
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
  const filteredDrinks = getFilteredDrinks();
  const visibleDrinks = filteredDrinks.slice(0, visibleCount);

  if (visibleDrinks.length === 0) {
    cardGrid.innerHTML = "";
    if (loadMoreBtn) loadMoreBtn.classList.add("is-hidden");
    return;
  }

  cardGrid.innerHTML = visibleDrinks
    .map((drink, index) => renderCard(drink, index))
    .join("");

  if (loadMoreBtn) {
    if (filteredDrinks.length > visibleCount) {
      loadMoreBtn.classList.remove("is-hidden");
      loadMoreBtn.textContent = `加载更多｜已显示 ${visibleDrinks.length} / ${filteredDrinks.length}`;
    } else {
      loadMoreBtn.classList.add("is-hidden");
    }
  }
}
function resetAndRender() {
  visibleCount = PAGE_SIZE;
  renderDrinks();
}



async function init() {
  const loaded = await loadDrinks();

  if (loaded === null) {
    return;
  }

  allDrinks = loaded;

  initFilters();
  renderDrinks();

  searchInput.addEventListener("input", resetAndRender);
brandFilter.addEventListener("change", resetAndRender);
categoryFilter.addEventListener("change", resetAndRender);
sugarFilter.addEventListener("change", resetAndRender);

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    visibleCount += PAGE_SIZE;
    renderDrinks();
  });
}
}

init();

const shareBtn = document.getElementById("shareBtn");
const shareTip = document.getElementById("shareTip");

const shareTitle = "饮料含糖量可视化系统";
const shareUrl = "https://thinking555.github.io/drink.html";
const shareMessage = `可以查看常见饮料的含糖量、方糖数量和每日摄入参考。`;
const shareText = `${shareTitle}
可以查看常见饮料的含糖量、方糖数量和每日摄入参考。

快来看看：
${shareUrl}`;

let shareTipTimer;

function showShareTip(message) {
  if (!shareTip) return;

  shareTip.textContent = message;
  shareTip.classList.add("show");

  clearTimeout(shareTipTimer);
  shareTipTimer = setTimeout(() => {
    shareTip.textContent = "";
    shareTip.classList.remove("show");
  }, 2600);
}

function setManualShareBox(visible) {
  const shareSection = shareBtn ? shareBtn.closest(".share-section") : null;
  if (!shareSection) return;

  let manualShareBox = document.getElementById("manualShareBox");

  if (!manualShareBox) {
    manualShareBox = document.createElement("textarea");
    manualShareBox.id = "manualShareBox";
    manualShareBox.className = "manual-share-box";
    manualShareBox.setAttribute("readonly", "");
    manualShareBox.setAttribute("aria-label", "分享内容");
    manualShareBox.hidden = true;
    shareSection.appendChild(manualShareBox);
  }

  manualShareBox.value = shareText;
  manualShareBox.hidden = !visible;

  if (visible) {
    requestAnimationFrame(() => {
      manualShareBox.focus();
      manualShareBox.select();
      manualShareBox.setSelectionRange(0, manualShareBox.value.length);
    });
  }
}

async function copyShareText() {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(shareText);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = shareText;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("复制失败");
  }
}

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    shareBtn.disabled = true;

    const shareData = {
      title: shareTitle,
      text: shareMessage,
      url: shareUrl
    };

    try {
      setManualShareBox(false);

      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        showShareTip("已打开系统分享");
        return;
      }

      await copyShareText();
      showShareTip("分享内容已复制，可以粘贴发送给朋友了");
    } catch (error) {
      if (error && error.name === "AbortError") {
        showShareTip("已取消分享");
        return;
      }

      try {
        await copyShareText();
        showShareTip("系统分享不可用，已复制分享内容");
      } catch (copyError) {
        setManualShareBox(true);
        showShareTip("请长按下方内容复制分享");
      }
    } finally {
      shareBtn.disabled = false;
    }
  });
}
