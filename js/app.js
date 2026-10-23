

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI components
  MellouraUI.init();
  MellouraUI.renderMobileMenu();
  MellouraUI.renderSearchModal();
  MellouraUI.renderFooter();

  // Route according to page content
  const pageType = document.body.dataset.page;

  switch (pageType) {
    case 'home':
      initHomePage();
      break;
    case 'shop':
      initShopPage();
      break;
    case 'product':
      initProductPage();
      break;
    case 'cart':
      initCartPage();
      break;
    case 'checkout-step-1':
      initCheckoutStep1();
      break;
    case 'checkout-step-2':
      initCheckoutStep2();
      break;
    case 'confirmation':
      initConfirmationPage();
      break;
    default:
      break;
  }
});


function initHomePage() {
  renderHomeProducts();

  // Category filter clicks
  const chips = document.querySelectorAll('.category-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.className = "category-chip px-5 py-2 rounded-full bg-[#fdf9f6] border border-[#d3c3bd] text-[#1c1b1a] hover:border-[#25160e] hover:text-[#25160e] transition-colors font-sans text-xs font-semibold tracking-wider cursor-pointer";
      });
      chip.className = "category-chip px-5 py-2 rounded-full bg-[#25160e] text-white border border-[#25160e] transition-colors font-sans text-xs font-semibold tracking-wider cursor-pointer";

      const cat = chip.dataset.category || "ALL";
      renderHomeProducts(cat, document.getElementById('home-search-input')?.value);
    });
  });

  // Search input
  const searchInput = document.getElementById('home-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeChip = document.querySelector('.category-chip.bg-\[\#25160e\]');
      const cat = activeChip ? activeChip.dataset.category : "ALL";
      renderHomeProducts(cat, e.target.value);
    });
  }

  // Set default gift box option
  MellouraUI.selectGiftBox('signature');
}

function renderHomeProducts(category = "ALL", query = "") {
  const container = document.getElementById('home-products-grid');
  if (!container) return;

  const q = (query || "").trim().toLowerCase();
  let filtered = MELLOURA_PRODUCTS;

  if (category && category !== "ALL") {
    filtered = filtered.filter(p => p.categories.includes(category));
  }

  if (q) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <p class="font-serif text-xl text-[#25160e] mb-2">No artisanal chocolates found</p>
        <p class="text-sm text-[#4f4540]">Try selecting another category or searching with a different term.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => MellouraUI.generateProductCard(product)).join('');
}

// ======================================================
// 2. SHOP PAGE LOGIC
// ======================================================
function initShopPage() {
  // Parse URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || "ALL";
  const initialSearch = urlParams.get('search') || "";

  const searchInput = document.getElementById('shop-search-input');
  if (searchInput && initialSearch) {
    searchInput.value = initialSearch;
  }

  renderShopProducts(initialCategory, initialSearch);

  // Bind category chips
  const chips = document.querySelectorAll('.shop-category-chip');
  chips.forEach(chip => {
    if (chip.dataset.category === initialCategory) {
      chip.className = "shop-category-chip px-5 py-2 rounded-full bg-[#25160e] text-white border border-[#25160e] transition-colors font-sans text-xs font-semibold tracking-wider cursor-pointer";
    }
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.className = "shop-category-chip px-5 py-2 rounded-full bg-[#fdf9f6] border border-[#d3c3bd] text-[#1c1b1a] hover:border-[#25160e] transition-colors font-sans text-xs font-semibold tracking-wider cursor-pointer";
      });
      chip.className = "shop-category-chip px-5 py-2 rounded-full bg-[#25160e] text-white border border-[#25160e] transition-colors font-sans text-xs font-semibold tracking-wider cursor-pointer";

      const cat = chip.dataset.category || "ALL";
      const q = document.getElementById('shop-search-input')?.value || "";
      renderShopProducts(cat, q);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeChip = document.querySelector('.shop-category-chip.bg-\[\#25160e\]');
      const cat = activeChip ? activeChip.dataset.category : "ALL";
      renderShopProducts(cat, e.target.value);
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const activeChip = document.querySelector('.shop-category-chip.bg-\[\#25160e\]');
      const cat = activeChip ? activeChip.dataset.category : "ALL";
      const q = document.getElementById('shop-search-input')?.value || "";
      renderShopProducts(cat, q);
    });
  }
}

function renderShopProducts(category = "ALL", query = "") {
  const container = document.getElementById('shop-products-grid');
  const countDisplay = document.getElementById('shop-results-count');
  if (!container) return;

  const q = (query || "").trim().toLowerCase();
  let filtered = [...MELLOURA_PRODUCTS];

  if (category && category !== "ALL") {
    filtered = filtered.filter(p => p.categories.includes(category));
  }

  if (q) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  }

  // Apply sorting
  const sortSelect = document.getElementById('shop-sort-select');
  const sortBy = sortSelect ? sortSelect.value : "featured";
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} creation${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <span class="material-symbols-outlined text-4xl text-[#d3c3bd] mb-2">search_off</span>
        <p class="font-serif text-xl text-[#25160e] mb-1">No chocolates match your criteria</p>
        <p class="text-xs text-[#4f4540]">Clear your filters or search keywords to view our collection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => MellouraUI.generateProductCard(product)).join('');
}

// ======================================================
// 3. PRODUCT DETAIL PAGE LOGIC (Screenshot 1)
// ======================================================
let currentDetailProduct = null;
let currentDetailQty = 1;

function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || "biscoff-bliss";

  currentDetailProduct = MELLOURA_PRODUCTS.find(p => p.slug === slug) || MELLOURA_PRODUCTS[0];
  currentDetailQty = 1;

  document.title = `${currentDetailProduct.name} - Melloura Chocolates`;

  // Render main image & thumbnails
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) {
    mainImage.src = currentDetailProduct.images[0] || "";
    mainImage.alt = currentDetailProduct.name;
  }

  const thumbContainer = document.getElementById('product-thumbnails-container');
  if (thumbContainer && currentDetailProduct.images.length > 0) {
    thumbContainer.innerHTML = currentDetailProduct.images.map((img, idx) => `
      <button onclick="MellouraUI.swapProductImage(this, '${img}')" class="thumbnail-btn w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 ${idx === 0 ? 'thumbnail-active' : 'border-transparent opacity-60 hover:opacity-100'} rounded overflow-hidden transition-all bg-[#f7f3f0]">
        <img src="${img}" alt="${currentDetailProduct.name} View ${idx + 1}" class="w-full h-full object-cover" />
      </button>
    `).join('');
  }

  // Populate Right Column Details
  setText('product-title', currentDetailProduct.name);
  setText('product-badge', currentDetailProduct.badge || 'ARTISANAL');
  setText('product-rating-text', `${currentDetailProduct.rating} (${currentDetailProduct.reviewCount} reviews)`);
  setText('product-price', `${MELLOURA_CONFIG.currency}${currentDetailProduct.price}`);
  setText('product-compare-price', currentDetailProduct.compareAtPrice ? `${MELLOURA_CONFIG.currency}${currentDetailProduct.compareAtPrice}` : '');
  setText('product-discount-badge', currentDetailProduct.discount || '');
  setText('product-description', currentDetailProduct.description || currentDetailProduct.shortDescription);
  setText('btn-add-to-cart-text', `Add to Cart - ${MELLOURA_CONFIG.currency}${currentDetailProduct.price}`);

  // Populate Accordions
  setText('acc-ingredients-text', currentDetailProduct.ingredients || "Premium single origin cocoa, raw organic inclusions, natural Madagascar vanilla.");
  setText('acc-delivery-text', currentDetailProduct.delivery || "Delivered in temperature-controlled insulated packaging with non-toxic gel ice packs.");
  setText('acc-storage-text', currentDetailProduct.storage || "Keep at 15°C - 20°C in a dry environment away from light and strong scents.");

  // Populate "You may also indulge in" 4-column recommendation grid
  const recContainer = document.getElementById('recommended-products-grid');
  if (recContainer) {
    const others = MELLOURA_PRODUCTS.filter(p => p.id !== currentDetailProduct.id).slice(0, 4);
    recContainer.innerHTML = others.map(p => `
      <a href="product.html?slug=${p.slug}" class="group flex flex-col gap-3">
        <div class="aspect-[4/5] bg-[#f7f3f0] rounded overflow-hidden border border-[#d3c3bd]/50">
          <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </div>
        <div class="flex flex-col items-start">
          <h3 class="font-serif text-sm md:text-base font-semibold text-[#25160e] group-hover:text-[#885210] transition-colors">${p.name}</h3>
          <p class="text-xs md:text-sm font-semibold text-[#885210]">${MELLOURA_CONFIG.currency}${p.price}</p>
        </div>
      </a>
    `).join('');
  }
}

function updateDetailQuantity(delta) {
  currentDetailQty = Math.max(1, currentDetailQty + delta);
  setText('product-qty-display', currentDetailQty);
  if (currentDetailProduct) {
    setText('btn-add-to-cart-text', `Add to Cart - ${MELLOURA_CONFIG.currency}${currentDetailProduct.price * currentDetailQty}`);
  }
}

function handleDetailAddToCart() {
  if (currentDetailProduct) {
    MellouraCart.addItem(currentDetailProduct, currentDetailQty);
    MellouraUI.toggleCartDrawer(true);
  }
}

function handleDetailBuyNow() {
  if (currentDetailProduct) {
    MellouraCart.addItem(currentDetailProduct, currentDetailQty);
    window.location.href = 'cart.html';
  }
}

// ======================================================
// 4. FULL CART PAGE LOGIC
// ======================================================
function initCartPage() {
  renderCartPageView();
  window.addEventListener('melloura:cartUpdated', renderCartPageView);
}

function renderCartPageView() {
  const container = document.getElementById('cart-page-items');
  const summaryContainer = document.getElementById('cart-page-summary');
  if (!container || !summaryContainer) return;

  const items = MellouraCart.getItems();
  const totals = MellouraCart.getTotals();




  if (items.length === 0) {
    container.innerHTML = `
      <div class="py-20 text-center bg-white rounded border border-[#d3c3bd] p-8">
        <span class="material-symbols-outlined text-6xl text-[#d3c3bd] mb-4">shopping_bag</span>
        <h3 class="font-serif text-2xl font-bold text-[#25160e] mb-2 uppercase tracking-wide">YOUR CART IS EMPTY</h3>
        <p class="font-sans text-xs md:text-sm text-[#4f4540] mb-8">Indulge yourself with our handcrafted chocolate creations.</p>
        <a href="shop.html" class="inline-block px-8 py-3.5 bg-[#25160e] text-white font-sans text-xs font-bold tracking-widest uppercase rounded hover:bg-[#3c2a21] transition-colors shadow-sm">
          CONTINUE SHOPPING
        </a>
      </div>
    `;
    summaryContainer.classList.add('hidden');
    return;
  }

  summaryContainer.classList.remove('hidden');

  container.innerHTML = items.map((item, index) => `
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded border border-[#d3c3bd] mb-4">
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded bg-[#f7f3f0] border border-[#d3c3bd]/40" />
        <div>
          <h4 class="font-serif text-base font-semibold text-[#25160e]">${item.name}</h4>
          <p class="font-sans text-xs text-[#4f4540] mb-1">${item.weight || 'Artisanal Selection'}</p>
          <p class="font-sans text-xs text-[#885210] font-semibold">${MELLOURA_CONFIG.currency}${item.price} each</p>
        </div>
      </div>
      <div class="flex items-center justify-between sm:justify-end gap-4 md:gap-6 w-full sm:w-auto">
        <div class="flex items-center border border-[#d3c3bd] rounded bg-[#fdf9f6]">
          <button onclick="MellouraCart.updateQuantity(${index}, ${item.quantity - 1})" class="px-3 py-1 text-sm text-[#25160e] hover:bg-[#f1edea] transition-colors">-</button>
          <span class="px-3 text-sm font-medium text-[#25160e]">${item.quantity}</span>
          <button onclick="MellouraCart.updateQuantity(${index}, ${item.quantity + 1})" class="px-3 py-1 text-sm text-[#25160e] hover:bg-[#f1edea] transition-colors">+</button>
        </div>
        <div class="text-right min-w-[80px]">
          <span class="font-serif text-base font-bold text-[#25160e]">${MELLOURA_CONFIG.currency}${(item.price * item.quantity).toLocaleString()}</span>
        </div>
        <button onclick="MellouraCart.removeItem(${index})" class="font-sans text-[11px] font-semibold tracking-wider text-[#81756f] hover:text-[#25160e] border border-[#d3c3bd] hover:border-[#25160e] px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 bg-[#fdf9f6] shrink-0" title="Remove product from cart">
          <span class="material-symbols-outlined text-sm">close</span>
          <span>CANCEL ITEM</span>
        </button>
      </div>
    </div>
  `).join('');

  // Update Summary Card
  setText('summary-subtotal', `${MELLOURA_CONFIG.currency}${totals.subtotal.toLocaleString()}`);
  setText('summary-shipping', totals.shipping === 0 ? 'FREE' : `${MELLOURA_CONFIG.currency}${totals.shipping}`);
  setText('summary-tax', `${MELLOURA_CONFIG.currency}${totals.tax.toLocaleString()}`);
  setText('summary-total', `${MELLOURA_CONFIG.currency}${totals.total.toLocaleString()}`);

  const discountRow = document.getElementById('summary-discount-row');
  if (discountRow) {
    if (totals.discount > 0) {
      discountRow.classList.remove('hidden');
      setText('summary-discount-text', `-${MELLOURA_CONFIG.currency}${totals.discount.toLocaleString()}`);
      setText('summary-coupon-name', totals.coupon.code);
    } else {
      discountRow.classList.add('hidden');
    }
  }
}

// ======================================================
// 5. CHECKOUT STEP 1 LOGIC (Screenshot 2)
// ======================================================
function initCheckoutStep1() {
  const customer = MellouraCheckout.getCustomerDetails();

  // Fill existing inputs
  setVal('email', customer.email || '');
  setVal('mobile', customer.mobile || '');
  setVal('fullName', customer.fullName || '');
  setVal('address', customer.address || '');
  setVal('city', customer.city || '');
  setVal('state', customer.state || '');
  setVal('pincode', customer.pincode || '');

  renderStep1OrderSummary();

  // Form submit handler
  const form = document.getElementById('checkout-step-1-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        email: getVal('email'),
        mobile: getVal('mobile'),
        fullName: getVal('fullName'),
        address: getVal('address'),
        city: getVal('city'),
        state: getVal('state'),
        pincode: getVal('pincode')
      };

      const val = MellouraCheckout.validateCustomerDetails(formData);
      if (!val.isValid) {
        showValidationErrors(val.errors);
        return;
      }

      MellouraCheckout.saveCustomerDetails(formData);
      window.location.href = 'checkout-step-2.html';
    });
  }
}

function renderStep1OrderSummary() {
  const container = document.getElementById('step1-items-summary');
  if (!container) return;

  const items = MellouraCart.getItems();
  const totals = MellouraCart.getTotals();

  if (items.length === 0) {
    container.innerHTML = `<p class="text-xs text-[#4f4540] py-4">No items in your bag. <a href="shop.html" class="underline text-[#885210]">Shop now</a></p>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="flex items-start gap-3 py-3 border-b border-[#d3c3bd]/50">
      <div class="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#f7f3f0] border border-[#d3c3bd]/40">
        <img src="${item.image}" alt="${item.name}" class="object-cover w-full h-full" />
        <span class="absolute -top-1 -right-1 bg-[#885210] text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-xs">
          ${item.quantity}
        </span>
      </div>
      <div class="flex-grow min-w-0">
        <h4 class="font-serif text-xs md:text-sm font-semibold text-[#1c1b1a] truncate">${item.name}</h4>
        <p class="text-[11px] text-[#4f4540] truncate">${item.weight || ''}</p>
      </div>
      <div class="text-right flex-shrink-0">
        <span class="font-sans text-xs md:text-sm font-semibold text-[#1c1b1a]">${MELLOURA_CONFIG.currency}${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    </div>
  `).join('');

  setText('step1-subtotal', `${MELLOURA_CONFIG.currency}${totals.subtotal.toLocaleString()}`);
  setText('step1-total', `${MELLOURA_CONFIG.currency}${totals.total.toLocaleString()}`);
}

function showValidationErrors(errors) {
  const errContainer = document.getElementById('checkout-form-errors');
  if (errContainer) {
    errContainer.innerHTML = Object.values(errors).map(msg => `
      <div class="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded border border-[#ba1a1a]/30 mb-2 flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">error</span>
        <span>${msg}</span>
      </div>
    `).join('');
    errContainer.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert(Object.values(errors)[0]);
  }
}

// ======================================================
// 6. CHECKOUT STEP 2 LOGIC (Screenshot 5)
// ======================================================
function initCheckoutStep2() {
  const customer = MellouraCheckout.getCustomerDetails();

  // If customer details missing, redirect back to step 1
  if (!customer.email || !customer.fullName) {
    window.location.href = 'checkout-step-1.html';
    return;
  }

  // Populate Contact Details Card
  setText('review-customer-name', customer.fullName);
  setText('review-customer-email', customer.email);
  setText('review-customer-phone', customer.mobile);

  // Populate Shipping Address Card
  const formattedAddress = `
    ${customer.address}<br>
    ${customer.city}, ${customer.state} ${customer.pincode}<br>
    India
  `;
  const addressContainer = document.getElementById('review-shipping-address');
  if (addressContainer) addressContainer.innerHTML = formattedAddress;

  renderStep2CartItems();
  updateStep2OrderSummary();

  // Populate Gift Message
  const giftMsg = MellouraCart.getGiftMessage();
  const giftMsgDisplay = document.getElementById('review-gift-message-text');
  const giftMsgInput = document.getElementById('review-gift-message-input');
  if (giftMsgDisplay) {
    giftMsgDisplay.textContent = giftMsg ? `"${giftMsg}"` : '"None provided"';
  }
  if (giftMsgInput) {
    giftMsgInput.value = giftMsg;
  }

  // Coupon code submit
  const couponForm = document.getElementById('review-coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = getVal('review-coupon-input');
      const res = MellouraCart.applyCoupon(code);
      if (res.success) {
        MellouraCart.showToast(`Coupon ${res.coupon.code} applied! (${res.coupon.discountPercent}% OFF)`);
        updateStep2OrderSummary();
      } else {
        alert(res.message);
      }
    });
  }

  // WhatsApp Order Confirmation Button
  const btnWhatsApp = document.getElementById('btn-confirm-order-whatsapp');
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      // Save optional gift message if user edited it
      if (giftMsgInput && giftMsgInput.value) {
        MellouraCart.setGiftMessage(giftMsgInput.value);
      }

      const orderData = MellouraCheckout.formatWhatsAppOrderMessage();

      // Save order record to session for confirmation page
      sessionStorage.setItem('melloura_last_order', JSON.stringify({
        orderId: orderData.orderId,
        customer,
        totals: MellouraCart.getTotals(),
        items: MellouraCart.getItems(),
        timestamp: new Date().toISOString()
      }));

      // Open WhatsApp in new window
      window.open(orderData.whatsappUrl, '_blank');

      // Clear cart
      MellouraCart.clear();

      // Navigate to confirmation page
      window.location.href = 'confirmation.html';
    });
  }
}

function renderStep2CartItems() {
  const container = document.getElementById('review-cart-items');
  if (!container) return;

  const items = MellouraCart.getItems();
  container.innerHTML = items.map(item => `
    <div class="flex items-center gap-4 py-4 border-b border-[#d3c3bd]/50">
      <div class="w-20 h-20 md:w-24 md:h-24 bg-[#f7f3f0] rounded shrink-0 relative overflow-hidden group border border-[#d3c3bd]/40">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div class="flex-grow flex flex-col justify-center">
        <h4 class="font-serif text-sm md:text-base font-semibold text-[#25160e]">${item.name}</h4>
        <p class="font-sans text-xs text-[#4f4540] mt-0.5">${item.weight || 'Artisanal Selection'}</p>
        <p class="font-sans text-xs font-medium text-[#1c1b1a] mt-2">Qty: ${item.quantity}</p>
      </div>
      <div class="text-right flex flex-col justify-center shrink-0">
        <p class="font-sans text-sm md:text-base text-[#25160e] font-semibold">${MELLOURA_CONFIG.currency}${(item.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}

function updateStep2OrderSummary() {
  const totals = MellouraCart.getTotals();

  setText('review-summary-subtotal-count', `Subtotal (${totals.count} item${totals.count === 1 ? '' : 's'})`);
  setText('review-summary-subtotal', `${MELLOURA_CONFIG.currency}${totals.subtotal.toLocaleString()}`);
  setText('review-summary-shipping', totals.shipping === 0 ? 'FREE' : `${MELLOURA_CONFIG.currency}${totals.shipping}`);
  setText('review-summary-tax', `${MELLOURA_CONFIG.currency}${totals.tax.toLocaleString()}`);
  setText('review-summary-total', `${MELLOURA_CONFIG.currency}${totals.total.toLocaleString()}`);

  const couponRow = document.getElementById('review-coupon-row');
  if (couponRow) {
    if (totals.discount > 0) {
      couponRow.classList.remove('hidden');
      setText('review-coupon-label', totals.coupon.code);
      setText('review-coupon-discount', `-${MELLOURA_CONFIG.currency}${totals.discount.toLocaleString()}`);
    } else {
      couponRow.classList.add('hidden');
    }
  }
}

// ======================================================
// 7. CONFIRMATION PAGE LOGIC
// ======================================================
function initConfirmationPage() {
  const orderDataRaw = sessionStorage.getItem('melloura_last_order');
  if (!orderDataRaw) {
    return;
  }

  const orderData = JSON.parse(orderDataRaw);
  setText('conf-order-id', '#' + orderData.orderId);
  setText('conf-customer-name', orderData.customer.fullName);
  setText('conf-customer-email', orderData.customer.email);
  setText('conf-customer-phone', orderData.customer.mobile);
  setText('conf-order-total', `${MELLOURA_CONFIG.currency}${orderData.totals.total.toLocaleString()}`);

  const addressEl = document.getElementById('conf-shipping-address');
  if (addressEl) {
    addressEl.innerHTML = `
      ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.pincode}
    `;
  }

  const itemsContainer = document.getElementById('conf-items-list');
  if (itemsContainer) {
    itemsContainer.innerHTML = orderData.items.map(item => `
      <div class="flex items-center justify-between py-2 border-b border-[#d3c3bd]/30 text-xs">
        <span class="text-[#25160e] font-medium">${item.name} x ${item.quantity}</span>
        <span class="text-[#885210] font-semibold">${MELLOURA_CONFIG.currency}${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');
  }
}

// ======================================================
// UTILITY HELPERS
// ======================================================
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Global Window Function Aliases for Inline HTML Events
window.updateDetailQuantity = updateDetailQuantity;
window.handleDetailAddToCart = handleDetailAddToCart;
window.handleDetailBuyNow = handleDetailBuyNow;
window.swapImage = function (el, url) {
  MellouraUI.swapProductImage(el, url);
};
