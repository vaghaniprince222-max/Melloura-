
const MellouraUI = {
  activeCategory: "ALL",
  searchQuery: "",

  init() {
    this.renderHeader();
    this.renderCartDrawer();
    this.renderSearchModal();
    this.renderAccountModal();
    this.bindGlobalEvents();
    MellouraCart.notifyUpdate();
  },

  // ----------------------------------------------------
  // Exact Viewport-Centered Header Rendering
  // ----------------------------------------------------
  renderHeader() {
    const headerContainer = document.getElementById('site-header');
    if (!headerContainer) return;

    const isCheckout = window.location.pathname.includes('checkout') || window.location.hash.includes('checkout');

    if (isCheckout) {
      headerContainer.innerHTML = `
        <div class="relative w-full h-20 px-4 md:px-12 flex items-center justify-between border-b border-[#d3c3bd] bg-[#fdf9f6]">
          <button onclick="history.back()" class="p-2 text-[#25160e] hover:text-[#885210] transition-colors flex items-center gap-1 font-sans text-xs tracking-wider uppercase z-10">
            <span class="material-symbols-outlined text-lg">arrow_back</span>
            <span class="hidden sm:inline">Back</span>
          </button>
          
          <!-- Exact Center Brand Name -->
          <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center pointer-events-auto z-20">
            <a href="index.html" class="font-serif italic text-2xl md:text-3xl text-[#25160e] hover:opacity-90 transition-opacity">
              Melloura Chocolates
            </a>
          </div>

          <div class="flex items-center gap-2 text-[#25160e] z-10">
            <span class="material-symbols-outlined text-lg text-[#885210]">lock</span>
            <span class="font-sans text-[11px] tracking-widest uppercase hidden sm:inline text-[#4f4540]">Secure Checkout</span>
          </div>
        </div>
      `;
      return;
    }

    headerContainer.innerHTML = `
      <div class="relative w-full h-20 md:h-24 px-4 md:px-12 flex items-center justify-between bg-[#fdf9f6]">
        
        <!-- LEFT SIDE: Navigation on Desktop, Menu toggle on Mobile -->
        <div class="flex items-center gap-6 md:gap-8 z-10">
          <button onclick="MellouraUI.toggleMobileMenu(true)" class="md:hidden p-2 text-[#25160e] hover:text-[#885210] transition-colors" aria-label="Open Menu">
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>
          
          <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold tracking-widest text-[#1c1b1a] uppercase font-sans">
            <a href="shop.html" class="hover:text-[#885210] transition-colors duration-200">SHOP</a>
            <a href="shop.html?category=BESTSELLERS" class="hover:text-[#885210] transition-colors duration-200">BESTSELLERS</a>
            <a href="shop.html?category=GIFTING" class="hover:text-[#885210] transition-colors duration-200">COLLECTIONS</a>
            <a href="shop.html?category=GIFTING" class="hover:text-[#885210] transition-colors duration-200">GIFTING</a>
            <a href="index.html#heritage" class="hover:text-[#885210] transition-colors duration-200">ABOUT</a>
          </nav>
        </div>

        <!-- CENTER: Brand Logo at EXACT Horizontal Center of Viewport -->
        <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center pointer-events-auto z-20">
          <a href="index.html" class="font-serif text-3xl sm:text-4xl md:text-5xl text-[#25160e] font-bold tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap">
            Melloura
          </a>
        </div>

        <!-- RIGHT SIDE: Search, Account, Cart Icons -->
        <div class="flex items-center gap-2 sm:gap-3 md:gap-4 text-[#25160e] z-10">
          <button onclick="MellouraUI.toggleSearchModal(true)" class="p-2 hover:text-[#885210] transition-colors" title="Search Chocolates" aria-label="Search">
            <span class="material-symbols-outlined text-xl md:text-2xl">search</span>
          </button>
          <button onclick="MellouraUI.toggleAccountModal(true)" class="p-2 hover:text-[#885210] transition-colors" title="VIP Account Concierge" aria-label="Account">
            <span class="material-symbols-outlined text-xl md:text-2xl">person</span>
          </button>
          <button onclick="MellouraUI.toggleCartDrawer(true)" class="p-2 hover:text-[#885210] transition-colors relative" title="View Cart" aria-label="Cart">
            <span class="material-symbols-outlined text-xl md:text-2xl">shopping_bag</span>
            <span class="cart-badge-count absolute top-1 right-1 bg-[#885210] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans hidden">0</span>
          </button>
        </div>

      </div>
    `;
  },


  bindGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleCartDrawer(false);
        this.toggleMobileMenu(false);
        this.toggleSearchModal(false);
        this.toggleAccountModal(false);
      }
    });
  },

  // ----------------------------------------------------
  // Cart Drawer Controller
  // ----------------------------------------------------
  toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer-container');
    if (!drawer) return;
    if (open) {
      this.renderCartDrawer();
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderCartDrawer() {
    const container = document.getElementById('cart-drawer-container');
    if (!container) return;

    const items = MellouraCart.getItems();
    const totals = MellouraCart.getTotals();

    let itemsHtml = '';
    if (items.length === 0) {
      itemsHtml = `
        <div class="flex flex-col items-center justify-center py-20 text-center px-4">
          <span class="material-symbols-outlined text-5xl text-[#d3c3bd] mb-3">shopping_bag</span>
          <p class="font-serif text-xl font-bold text-[#25160e] mb-1">Your Shopping Bag is Empty</p>
          <p class="text-sm text-[#4f4540] mb-6">Discover our handcrafted artisanal collection</p>
          <a href="shop.html" onclick="MellouraUI.toggleCartDrawer(false)" class="px-6 py-3 bg-[#25160e] text-white font-sans text-xs font-bold tracking-widest uppercase rounded hover:bg-[#3c2a21] transition-colors shadow-sm">
            Explore Chocolates
          </a>
        </div>
      `;
    } else {
      itemsHtml = items.map((item, index) => `
        <div class="flex gap-4 py-4 border-b border-[#d3c3bd]/50 items-start">
          <img src="${item.image}" alt="${item.name}" class="w-18 h-18 object-cover rounded bg-[#f7f3f0] border border-[#d3c3bd]/40 flex-shrink-0" style="width: 72px; height: 72px;" />
          <div class="flex-grow">
            <h4 class="font-serif text-sm font-semibold text-[#25160e] line-clamp-1">${item.name}</h4>
            <p class="font-sans text-xs font-bold text-[#885210] mt-0.5">${MELLOURA_CONFIG.currency}${item.price}</p>
            
            <div class="flex items-center justify-between mt-3">
              <!-- Quantity selector -->
              <div class="flex items-center border border-[#d3c3bd] rounded bg-white">
                <button onclick="MellouraCart.updateQuantity(${index}, ${item.quantity - 1})" class="px-2.5 py-1 text-xs text-[#25160e] hover:bg-[#f1edea] transition-colors">-</button>
                <span class="px-3 text-xs font-medium text-[#25160e]">${item.quantity}</span>
                <button onclick="MellouraCart.updateQuantity(${index}, ${item.quantity + 1})" class="px-2.5 py-1 text-xs text-[#25160e] hover:bg-[#f1edea] transition-colors">+</button>
              </div>
              
              <!-- Red Remove action with trash icon -->
              <button onclick="MellouraCart.removeItem(${index})" class="text-[#ba1a1a] hover:text-[#93000a] text-xs font-sans font-medium flex items-center gap-1 transition-colors" title="Remove Item">
                <span class="material-symbols-outlined text-sm">delete</span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    container.innerHTML = `
      <div class="drawer-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
        <div class="fixed inset-0" onclick="MellouraUI.toggleCartDrawer(false)"></div>
        <div class="drawer-panel relative w-full max-w-md bg-[#fdf9f6] h-full shadow-2xl flex flex-col z-10">
          
          <!-- Drawer Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-[#d3c3bd] bg-[#f7f3f0]">
            <h3 class="font-serif text-xl font-bold text-[#25160e]">Your Shopping Bag</h3>
            <button onclick="MellouraUI.toggleCartDrawer(false)" class="p-2 text-[#4f4540] hover:text-[#25160e] transition-colors" aria-label="Close Cart">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Items List -->
          <div class="flex-grow overflow-y-auto px-6 py-2">
            ${itemsHtml}
          </div>

          <!-- Sticky Bottom Summary / Footer -->
          ${items.length > 0 ? `
            <div class="p-6 bg-[#f7f3f0] border-t border-[#d3c3bd] space-y-4">
              
              <!-- Promo Code Section -->
              <div class="border-b border-[#d3c3bd]/60 pb-3">
                <span class="font-sans text-[11px] font-bold tracking-widest text-[#4f4540] uppercase mb-2 block">HAVE A PROMO CODE?</span>
                ${totals.discount > 0 ? `
                  <div class="flex items-center justify-between bg-[#fdf9f6] border border-[#885210] p-2 rounded text-xs text-[#885210]">
                    <span class="font-semibold">Applied: ${totals.coupon.code} (${totals.coupon.discountPercent}% OFF)</span>
                    <button onclick="MellouraCart.removeCoupon(); MellouraUI.renderCartDrawer();" class="text-xs text-[#ba1a1a] hover:underline font-semibold">Remove</button>
                  </div>
                ` : `
                  <form onsubmit="event.preventDefault(); MellouraUI.handleDrawerPromoSubmit();" class="flex gap-2">
                    <input type="text" id="drawer-promo-input" placeholder="E.G. MELLOURA10" class="w-full bg-[#fdf9f6] border border-[#d3c3bd] rounded px-3 py-2 text-xs font-sans text-[#1c1b1a] uppercase tracking-wider focus:outline-none focus:border-[#25160e]" />
                    <button type="submit" class="px-4 py-2 bg-[#25160e] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#3c2a21] transition-colors shrink-0">
                      APPLY
                    </button>
                  </form>
                  <div id="drawer-promo-error" class="text-[11px] text-[#ba1a1a] mt-1 hidden"></div>
                `}
              </div>

              <!-- Order Summary Breakdown -->
              <div class="space-y-2 font-sans text-xs text-[#4f4540]">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="font-semibold text-[#25160e]">${MELLOURA_CONFIG.currency}${totals.subtotal.toLocaleString()}</span>
                </div>
                
                ${totals.discount > 0 ? `
                  <div class="flex justify-between text-[#885210]">
                    <span>Discount (${totals.coupon.code})</span>
                    <span class="font-semibold">-${MELLOURA_CONFIG.currency}${totals.discount.toLocaleString()}</span>
                  </div>
                ` : ''}

              
<!-- Complimentary Delivery -->
<div class="flex justify-between items-center">
  <span>Delivery</span>
  <span class="text-[#25d366] font-bold text-xs">FREE</span>
</div>

<!-- Grand Total -->
<div class="border-t border-[#d3c3bd] pt-3 flex justify-between items-baseline">
  <span class="font-serif text-base font-bold text-[#25160e]">
    Grand Total
  </span>
  <span class="font-serif text-xl font-bold text-[#25160e]">
    ${MELLOURA_CONFIG.currency}${Math.max(0, totals.subtotal - (totals.discount || 0)).toLocaleString()}
  </span>
</div>


              <!-- Primary Action: ORDER COMPLETE BAG ON WHATSAPP -->
              <div class="space-y-2 pt-1">
                <button onclick="MellouraUI.handleDrawerWhatsAppCheckout()" class="w-full bg-[#25D366] hover:bg-[#20bd59] text-white font-sans text-xs font-bold tracking-wider py-4 px-4 rounded transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 uppercase">
                  <span class="material-symbols-outlined text-lg fill-1">chat</span>
                  <span>ORDER COMPLETE BAG ON WHATSAPP</span>
                </button>

                <div class="flex gap-2 pt-1">
                  <a href="cart.html" onclick="MellouraUI.toggleCartDrawer(false)" class="flex-1 py-2.5 text-center border border-[#25160e] text-[#25160e] text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#25160e]/5 transition-colors">
                    View Bag Details
                  </a>
                  <a href="checkout-step-1.html" onclick="MellouraUI.toggleCartDrawer(false)" class="flex-1 py-2.5 text-center bg-[#25160e] text-white text-[11px] font-semibold tracking-wider uppercase rounded hover:bg-[#3c2a21] transition-colors">
                    Checkout Step 1
                  </a>
                </div>
              </div>

            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  handleDrawerPromoSubmit() {
    const input = document.getElementById('drawer-promo-input');
    const errEl = document.getElementById('drawer-promo-error');
    const code = (input?.value || "").trim();

    if (!code) {
      if (errEl) {
        errEl.textContent = "Please enter a promo code (e.g. WELCOME10)";
        errEl.classList.remove('hidden');
      }
      return;
    }

    const res = MellouraCart.applyCoupon(code);
    if (res.success) {
      if (errEl) errEl.classList.add('hidden');
      MellouraCart.showToast(`Promo ${res.coupon.code} applied! (${res.coupon.discountPercent}% OFF)`);
      this.renderCartDrawer();
    } else {
      if (errEl) {
        errEl.textContent = res.message || "Invalid promo code";
        errEl.classList.remove('hidden');
      }
    }
  },

  handleDrawerWhatsAppCheckout() {
    const items = MellouraCart.getItems();
    if (items.length === 0) {
      alert("Your shopping bag is empty!");
      return;
    }

    const orderData = MellouraCheckout.formatWhatsAppOrderMessage();
    const customer = MellouraCheckout.getCustomerDetails();

    sessionStorage.setItem('melloura_last_order', JSON.stringify({
      orderId: orderData.orderId,
      customer,
      totals: MellouraCart.getTotals(),
      items: items,
      timestamp: new Date().toISOString()
    }));

    window.open(orderData.whatsappUrl, '_blank');
    MellouraCart.clear();
    this.toggleCartDrawer(false);
    window.location.href = 'confirmation.html';
  },


  toggleMobileMenu(open) {
    const menu = document.getElementById('mobile-menu-container');
    if (!menu) return;
    if (open) {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderMobileMenu() {
    const container = document.getElementById('mobile-menu-container');
    if (!container) return;

    container.innerHTML = `
      <div class="mobile-menu-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
        <div class="mobile-menu-panel relative w-4/5 max-w-xs bg-[#fdf9f6] h-full shadow-2xl flex flex-col z-10">
          <div class="flex items-center justify-between p-6 border-b border-[#d3c3bd]">
            <a href="index.html" class="font-serif text-2xl font-bold text-[#25160e]">Melloura</a>
            <button onclick="MellouraUI.toggleMobileMenu(false)" class="p-1 text-[#25160e]">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          <nav class="flex flex-col p-6 gap-6 font-sans text-sm tracking-wider uppercase font-semibold text-[#1c1b1a]">
            <a href="shop.html" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Shop All Chocolates</a>
            <a href="shop.html?category=BESTSELLERS" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Bestsellers</a>
            <a href="shop.html?category=GIFTING" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Collections</a>
            <a href="shop.html?category=GIFTING" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Gifting</a>
            <a href="index.html#gift-builder" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Build A Gift Box</a>
            <a href="index.html#heritage" onclick="MellouraUI.toggleMobileMenu(false)" class="hover:text-[#885210] transition-colors">Our Heritage</a>
            <button onclick="MellouraUI.toggleMobileMenu(false); MellouraUI.toggleAccountModal(true);" class="text-left hover:text-[#885210] transition-colors font-sans text-sm tracking-wider uppercase font-semibold text-[#1c1b1a]">VIP Account Concierge</button>
          </nav>
          <div class="mt-auto p-6 border-t border-[#d3c3bd] bg-[#f7f3f0] space-y-4">
            <a href="https://wa.me/${MELLOURA_CONFIG.whatsappNumber}" target="_blank" class="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded text-xs font-semibold tracking-wider uppercase">
              <span class="material-symbols-outlined text-sm fill-1">chat</span> Order On WhatsApp
            </a>
            <div class="text-[11px] text-[#4f4540] text-center">
              © 2024 Melloura Chocolates
            </div>
          </div>
        </div>
        <div class="flex-grow" onclick="MellouraUI.toggleMobileMenu(false)"></div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // Search Modal
  // ----------------------------------------------------
  toggleSearchModal(open) {
    const modal = document.getElementById('search-modal-container');
    if (!modal) return;
    if (open) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = document.getElementById('modal-search-input');
        if (input) input.focus();
      }, 100);
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderSearchModal() {
    const container = document.getElementById('search-modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
        <div class="fixed inset-0" onclick="MellouraUI.toggleSearchModal(false)"></div>
        <div class="modal-panel relative w-full max-w-2xl bg-[#fdf9f6] rounded-lg shadow-2xl p-6 border border-[#d3c3bd]">
          <div class="flex items-center gap-3 border-b border-[#d3c3bd] pb-4">
            <span class="material-symbols-outlined text-[#81756f] text-2xl">search</span>
            <input id="modal-search-input" type="text" placeholder="Search handcrafted chocolates, kunafa, truffles..." class="w-full bg-transparent text-[#25160e] font-sans text-base outline-none placeholder-[#81756f]" oninput="MellouraUI.handleSearchInput(this.value)" />
            <button onclick="MellouraUI.toggleSearchModal(false)" class="text-[#4f4540] hover:text-[#25160e]">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div id="search-modal-results" class="mt-4 max-h-96 overflow-y-auto divide-y divide-[#d3c3bd]/40">
            <div class="text-xs text-[#81756f] py-4 text-center">Type above to search our luxury collection...</div>
          </div>
        </div>
      </div>
    `;
  },

  handleSearchInput(query) {
    const resultsContainer = document.getElementById('search-modal-results');
    if (!resultsContainer) return;

    const q = (query || "").trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `<div class="text-xs text-[#81756f] py-4 text-center">Type above to search our luxury collection...</div>`;
      return;
    }

    const matched = MELLOURA_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categories.some(c => c.toLowerCase().includes(q))
    );

    if (matched.length === 0) {
      resultsContainer.innerHTML = `<div class="text-xs text-[#4f4540] py-8 text-center">No chocolates found matching "${query}". Try "Biscoff", "Kunafa", or "Caramel".</div>`;
      return;
    }

    resultsContainer.innerHTML = matched.map(p => `
      <a href="product.html?slug=${p.slug}" class="flex items-center gap-4 py-3 hover:bg-[#f7f3f0] px-2 rounded transition-colors group">
        <img src="${p.images[0]}" alt="${p.name}" class="w-14 h-14 object-cover rounded bg-[#f1edea]" />
        <div class="flex-grow">
          <h4 class="font-serif text-sm font-semibold text-[#25160e] group-hover:text-[#885210] transition-colors">${p.name}</h4>
          <p class="text-xs text-[#4f4540] line-clamp-1">${p.shortDescription}</p>
        </div>
        <span class="font-serif text-sm font-semibold text-[#885210]">${MELLOURA_CONFIG.currency}${p.price}</span>
      </a>
    `).join('');
  },

  // ----------------------------------------------------
  // VIP Account / Concierge Modal
  // ----------------------------------------------------
  toggleAccountModal(open) {
    let modal = document.getElementById('account-modal-container');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'account-modal-container';
      document.body.appendChild(modal);
    }
    if (open) {
      this.renderAccountModal();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderAccountModal() {
    let container = document.getElementById('account-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'account-modal-container';
      document.body.appendChild(container);
    }

    const savedUser = localStorage.getItem('melloura_user_account');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const lastOrderRaw = sessionStorage.getItem('melloura_last_order');
    const lastOrder = lastOrderRaw ? JSON.parse(lastOrderRaw) : null;

    let bodyContent = '';

    if (user && user.isLoggedIn) {
      bodyContent = `
        <div class="space-y-6">
          <div class="flex items-center gap-4 bg-[#f7f3f0] p-4 rounded border border-[#d3c3bd]">
            <div class="w-12 h-12 rounded-full bg-[#25160e] text-white flex items-center justify-center font-serif text-xl font-bold">
              ${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h4 class="font-serif text-lg font-bold text-[#25160e]">${user.fullName || 'VIP Member'}</h4>
              <p class="font-sans text-xs text-[#885210] font-semibold uppercase tracking-wider">VIP Circle Connoisseur</p>
              <p class="font-sans text-xs text-[#4f4540]">${user.email}</p>
            </div>
          </div>

          ${lastOrder &&
          lastOrder.status === "confirmed" &&
          lastOrder.confirmedAt &&
          lastOrder.orderId &&
          Array.isArray(lastOrder.items) &&
          lastOrder.items.length > 0
          ? `
    <div class="border-t border-[#d3c3bd] pt-4">
      <span class="font-serif text-sm font-bold text-[#25160e] block mb-2">
        Recent Order History
      </span>

      <div class="bg-[#f7f3f0] p-3 rounded text-xs space-y-1 border border-[#d3c3bd]/60">
        <div class="flex justify-between font-semibold text-[#25160e]">
          <span>Order #${lastOrder.orderId}</span>
          <span class="text-[#16a34a]">Confirmed</span>
        </div>

        <div class="text-[#4f4540]">
          ${lastOrder.items.length} items • ₹${lastOrder.totals.total}
        </div>
      </div>
    </div>
  `
          : ''
        }

          <div class="border-t border-[#d3c3bd] pt-4 flex gap-3">
            <a href="shop.html" onclick="MellouraUI.toggleAccountModal(false)" class="flex-1 py-3 text-center bg-[#25160e] text-white font-sans text-xs font-bold tracking-widest uppercase rounded hover:bg-[#3c2a21] transition-colors">
              SHOP COLLECTION
            </a>
            <button onclick="localStorage.removeItem('melloura_user_account'); MellouraUI.renderAccountModal(); MellouraCart.showToast('Signed out successfully');" class="py-3 px-4 border border-[#25160e] text-[#25160e] font-sans text-xs font-bold tracking-widest uppercase rounded hover:bg-[#25160e]/5 transition-colors">
              SIGN OUT
            </button>
          </div>
        </div>
      `;
    } else {
      bodyContent = `
        <form
  id="account-sign-in-form"
  onsubmit="event.preventDefault(); MellouraUI.handleAccountSignIn();"
  class="space-y-4">

  <p class="font-sans text-xs text-[#4f4540] leading-relaxed">
    Join the Melloura VIP Circle for exclusive seasonal chocolate
    drops, private boutique tasting invitations, and 10% off your orders.
  </p>

  <!-- FULL NAME -->
  <div>
    <label
      for="acc-name"
      class="block text-[10px] font-sans uppercase font-bold tracking-widest text-[#4f4540] mb-1">
      Full Name
    </label>

    <input
      type="text"
      id="acc-name"
      name="name"
      autocomplete="name"
      placeholder="Enter your full name"
      required
      class="w-full bg-[#fdf9f6] border border-[#d3c3bd] rounded px-3 py-3 text-sm text-[#1c1b1a] focus:outline-none focus:border-[#885210] select-text pointer-events-auto">
  </div>

  <!-- EMAIL ADDRESS -->
  <div>
    <label
      for="acc-email"
      class="block text-[10px] font-sans uppercase font-bold tracking-widest text-[#4f4540] mb-1">
      Email Address
    </label>

    <input
      type="email"
      id="acc-email"
      name="email"
      autocomplete="email"
      inputmode="email"
      autocapitalize="off"
      spellcheck="false"
      placeholder="you@example.com"
      required
      class="w-full bg-[#fdf9f6] border border-[#d3c3bd] rounded px-3 py-3 text-sm text-[#1c1b1a] focus:outline-none focus:border-[#885210] select-text pointer-events-auto">
  </div>

  <!-- MOBILE NUMBER -->
  <div>
    <label
      for="acc-phone"
      class="block text-[10px] font-sans uppercase font-bold tracking-widest text-[#4f4540] mb-1">
      Mobile Number
    </label>

    <input
      type="tel"
      id="acc-phone"
      name="phone"
      autocomplete="tel"
      inputmode="tel"
      placeholder="+91 96245 94839"
      class="w-full bg-[#fdf9f6] border border-[#d3c3bd] rounded px-3 py-3 text-sm text-[#1c1b1a] focus:outline-none focus:border-[#885210] select-text pointer-events-auto">
  </div>

  <button
    type="submit"
    class="w-full py-3.5 bg-[#25160e] text-white font-sans text-xs font-bold tracking-widest uppercase rounded hover:bg-[#3c2a21] transition-colors shadow-sm mt-2">
    JOIN VIP CIRCLE / SIGN IN
  </button>

</form>
      `;
    }

    container.innerHTML = `
      <div class="modal-backdrop fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="fixed inset-0" onclick="MellouraUI.toggleAccountModal(false)"></div>
        <div class="modal-panel relative w-full max-w-md bg-[#fdf9f6] rounded-lg shadow-2xl p-6 md:p-8 border border-[#d3c3bd]">
          <div class="flex items-center justify-between border-b border-[#d3c3bd] pb-4 mb-6">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#885210] text-2xl">person</span>
              <h3 class="font-serif text-xl font-bold text-[#25160e]">VIP Account Concierge</h3>
            </div>
            <button onclick="MellouraUI.toggleAccountModal(false)" class="text-[#4f4540] hover:text-[#25160e] p-1">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          ${bodyContent}
        </div>
      </div>
    `;
  },

  handleAccountSignIn() {
    const name = document.getElementById('acc-name')?.value.trim();
    const email = document.getElementById('acc-email')?.value.trim();
    const phone = document.getElementById('acc-phone')?.value.trim() || '';

    if (!name || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    const userData = {
      fullName: name,
      email: email,
      phone: phone,
      isLoggedIn: true,
      signedUpAt: new Date().toISOString()
    };

    localStorage.setItem('melloura_user_account', JSON.stringify(userData));
    MellouraCart.showToast(`Welcome to Melloura VIP Circle, ${name}!`);
    this.renderAccountModal();
  },

  quickWhatsAppProduct(productName, price) {
    const text = `MELLOURA PRODUCT ENQUIRY\n\nI would like to order:\nProduct: ${productName}\nPrice: ${MELLOURA_CONFIG.currency}${price}\nQuantity: 1\n\nPlease confirm availability!`;
    const targetNumber = (typeof WHATSAPP_NUMBER !== 'undefined') ? WHATSAPP_NUMBER : MELLOURA_CONFIG.whatsappNumber;
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },

  // ----------------------------------------------------
  // Product Card Generator (Third Screenshot Visual Style)
  // ----------------------------------------------------
  generateProductCard(product) {
    const mainImg = (Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : "";
    const escapedName = product.name.replace(/'/g, "\\'");
    return `
      <div class="product-card group flex flex-col bg-white border border-[#d3c3bd]/60 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
        <!-- 1:1 Aspect Image Container -->
        <div class="relative aspect-square overflow-hidden bg-[#f7f3f0] block">
          <a href="product.html?slug=${product.slug}" class="block w-full h-full">
            <img src="${mainImg}" alt="${product.name}" loading="lazy" class="zoom-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </a>
        </div>

        <!-- Content Area (Third Screenshot Layout) -->
        <div class="p-4 sm:p-5 flex flex-col flex-grow">
          <!-- TOP: Small category/badge text + Green status icon -->
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-sans text-[10px] uppercase font-bold tracking-widest text-[#885210]">
              ${product.badge || (product.categories ? product.categories[0] : 'ARTISANAL')}
            </span>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-[#25d366] inline-block shrink-0"></span>
              <span class="text-[10px] text-[#25d366] font-sans font-semibold">In Stock</span>
            </div>
          </div>

          <!-- Product Name (Clickable) -->
          <a href="product.html?slug=${product.slug}" class="font-serif text-lg font-bold text-[#25160e] hover:text-[#885210] transition-colors mb-1 line-clamp-1">
            ${product.name}
          </a>

          <!-- Short Product Description -->
          <p class="font-sans text-xs text-[#4f4540] mb-3 line-clamp-2 leading-relaxed flex-grow">
            ${product.shortDescription}
          </p>

          <!-- Thin Divider Line -->
          <div class="w-full h-px bg-[#d3c3bd]/50 mb-3"></div>

          <!-- Price Row: Current Price | Compare Price Strikethrough | Green Discount Percentage -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-baseline gap-2">
              <span class="font-serif text-xl font-bold text-[#25160e]">
                ${MELLOURA_CONFIG.currency}${product.price}
              </span>
              ${product.compareAtPrice ? `
                <span class="font-sans text-xs text-[#81756f] line-through">
                  ${MELLOURA_CONFIG.currency}${product.compareAtPrice}
                </span>
              ` : ''}
            </div>
            ${product.discount ? `
              <span class="font-sans text-xs font-bold text-[#25d366] bg-[#25d366]/10 px-2 py-0.5 rounded">
                ${product.discount}
              </span>
            ` : ''}
          </div>

          <!-- BOTTOM Actions Row: Large Dark Chocolate "ADD TO BAG" Button + Small Green WhatsApp Button -->
          <div class="flex items-center gap-2 mt-auto">
            <button onclick="MellouraCart.addItem(MELLOURA_PRODUCTS.find(p=>p.id==='${product.id}'), 1); MellouraUI.toggleCartDrawer(true);" class="flex-grow py-3 px-4 bg-[#25160e] hover:bg-[#3c2a21] text-white font-sans text-xs font-bold tracking-widest uppercase rounded transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-98">
              <span class="material-symbols-outlined text-base">shopping_bag</span>
              <span>ADD TO BAG</span>
            </button>

            <button onclick="MellouraUI.quickWhatsAppProduct('${escapedName}', ${product.price})" class="py-3 px-3.5 bg-[#25D366] hover:bg-[#20bd59] text-white rounded transition-colors shadow-sm flex items-center justify-center shrink-0 active:scale-98" title="Order ${product.name} on WhatsApp" aria-label="Order on WhatsApp">
              <span class="material-symbols-outlined text-base fill-1">chat</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ----------------------------------------------------
  // Product Gallery Thumbnails Switcher (Screenshot 1)
  // ----------------------------------------------------
  swapProductImage(thumbElement, imgUrl) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
      mainImg.style.opacity = '0.4';
      setTimeout(() => {
        mainImg.src = imgUrl;
        mainImg.style.opacity = '1';
      }, 150);
    }
    document.querySelectorAll('.thumbnail-btn').forEach(btn => {
      btn.classList.remove('thumbnail-active', 'border-[#885210]', 'opacity-100');
      btn.classList.add('border-transparent', 'opacity-60');
    });
    if (thumbElement) {
      thumbElement.classList.remove('border-transparent', 'opacity-60');
      thumbElement.classList.add('thumbnail-active', 'border-[#885210]', 'opacity-100');
    }
  },

  // ----------------------------------------------------
  // Accordion Controller (Screenshot 1)
  // ----------------------------------------------------
  toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    if (!content) return;

    const isOpen = content.classList.contains('open');
    if (isOpen) {
      content.classList.remove('open');
      if (icon) icon.textContent = 'add';
    } else {
      content.classList.add('open');
      if (icon) icon.textContent = 'remove';
    }
  },

  // ----------------------------------------------------
  // Gift Box Builder Controller (Screenshot 4)
  // ----------------------------------------------------
  selectedGiftBox: {
    id: "signature-gift-box",
    name: "Signature Box (6 Pieces)",
    price: 1199,
    description: "Our most popular gifting size.",
    message: ""
  },

  selectGiftBox(type) {
    const boxes = {
      petite: { id: "petite-gift-box", name: "Petite Box (4 Pieces)", price: 199, desc: "Perfect for a small gesture." },
      signature: { id: "signature-gift-box", name: "Signature Box (6 Pieces)", price: 299, desc: "Our most popular gifting size." },
      grand: { id: "grand-gift-box", name: "Grand Box (12 Pieces)", price: 599, desc: "For ultimate indulgence." }
    };

    const choice = boxes[type] || boxes.signature;
    this.selectedGiftBox.id = choice.id;
    this.selectedGiftBox.name = choice.name;
    this.selectedGiftBox.price = choice.price;
    this.selectedGiftBox.description = choice.desc;

    // Update UI checkmarks
    ['petite', 'signature', 'grand'].forEach(k => {
      const el = document.getElementById('gift-opt-' + k);
      const icon = document.getElementById('gift-icon-' + k);
      if (el && icon) {
        if (k === type) {
          el.className = "flex items-center justify-between p-5 border-2 border-[#25160e] rounded-lg cursor-pointer bg-[#25160e]/5 transition-all";
          icon.textContent = "check_box";
        } else {
          el.className = "flex items-center justify-between p-5 border-2 border-[#d3c3bd] rounded-lg hover:border-[#25160e] cursor-pointer bg-white transition-all";
          icon.textContent = "check_box_outline_blank";
        }
      }
    });
  },

  promptPersonalMessage() {
    const current = this.selectedGiftBox.message || MellouraCart.getGiftMessage() || "";
    const modal = document.getElementById('gift-message-modal');
    if (modal) {
      document.getElementById('gift-modal-textarea').value = current;
      modal.classList.add('active');
    }
  },

  saveGiftMessageFromModal() {
    const textarea = document.getElementById('gift-modal-textarea');
    const msg = textarea ? textarea.value.trim() : "";
    this.selectedGiftBox.message = msg;
    MellouraCart.setGiftMessage(msg);
    const displayTag = document.getElementById('gift-message-preview');
    if (displayTag) {
      displayTag.textContent = msg ? `Custom message attached: "${msg}"` : "";
    }
    const modal = document.getElementById('gift-message-modal');
    if (modal) modal.classList.remove('active');
    MellouraCart.showToast("Personal gift message saved");
  },

  buildAndAddGiftBox() {
    const p = MELLOURA_PRODUCTS.find(item => item.id === this.selectedGiftBox.id) || {
      id: this.selectedGiftBox.id,
      name: this.selectedGiftBox.name,
      price: this.selectedGiftBox.price,
      weight: "Curated Box",
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDjqjS2bQ6kmJRWwQ6ySgze0Z-LU-9_8fsQ82FlqBEdMIYvqHGMxRDGeQHBPx56-UUIPix_Uw_6iWfXNMsQQhoEoDkYpZUxpRRylpR0KENY8AZRgYg5GinLafCPIht0HoBuK7cfT3IHbYq375AbJDau6ziO1uKrOAnSnh5Jp3GJe6dLVih9j_NAS7Rf7OduHM-ORMfV4l49E6a07FSjI7ngZNXe9zPhlfwrK9FBzYeRELTkRZBEhFdw"]
    };

    if (this.selectedGiftBox.message) {
      MellouraCart.setGiftMessage(this.selectedGiftBox.message);
    }

    MellouraCart.addItem(p, 1, { giftMessage: this.selectedGiftBox.message });
    this.toggleCartDrawer(true);
  },

  // ----------------------------------------------------
  // Footer Component Generator
  // ----------------------------------------------------
  renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.innerHTML = `
      <div class="w-full pt-20 pb-12 bg-[#ebe7e4] border-t border-[#d3c3bd]">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-4 md:px-12 max-w-[1280px] mx-auto mb-16">
          <!-- Brand Column -->
          <div class="lg:col-span-2">
            <h3 class="font-serif text-3xl md:text-4xl text-[#25160e] font-bold mb-4">Melloura</h3>
            <p class="font-sans text-xs md:text-sm text-[#4f4540] max-w-md mb-6 leading-relaxed">
              Crafting moments of serene indulgence through meticulously handcrafted luxury chocolates, blending European artistry with rich, warming flavors to elevate your everyday and special celebrations.
            </p>
           <div class="flex gap-3">

  <!-- Instagram Logo -->
  <a href="https://www.instagram.com/melloura_chocolates?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw=="
     target="_blank"
     rel="noopener noreferrer"
     class="w-9 h-9 rounded-full bg-[#fdf9f6] flex items-center justify-center text-[#C13584] hover:bg-[#25160e] hover:text-white transition-colors"
     aria-label="Instagram">

    <svg viewBox="0 0 24 24" width="20" height="20"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
    </svg>
  </a>

  <!-- Facebook Logo -->
  <a href="https://www.facebook.com/YOUR_PAGE/"
     target="_blank"
     rel="noopener noreferrer"
     class="w-9 h-9 rounded-full bg-[#fdf9f6] flex items-center justify-center text-[#1877F2] hover:bg-[#25160e] hover:text-white transition-colors"
     aria-label="Facebook">

    <svg viewBox="0 0 24 24" width="20" height="20"
         fill="currentColor">
      <path d="M13.5 21v-8h2.8l.4-3.2h-3.2V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3V13h2.8v8z"/>
    </svg>
  </a>

  <!-- Email Logo -->
  <a href="mailto:mellourachocolates@gmail.com"
     class="w-9 h-9 rounded-full bg-[#fdf9f6] flex items-center justify-center text-[#25160e] hover:bg-[#25160e] hover:text-white transition-colors"
     aria-label="Email Melloura">

    <svg viewBox="0 0 24 24" width="20" height="20"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="m4 7 8 6 8-6"/>
    </svg>
  </a>

</div>
          </div>

          <!-- Shop Links -->
          <div class="flex flex-col gap-3">
            <h4 class="font-serif text-base font-bold text-[#25160e] mb-1">Shop</h4>
            <a href="shop.html" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">All Chocolates</a>
            <a href="shop.html?category=BESTSELLERS" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Bestsellers</a>
            <a href="shop.html?category=GIFTING" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Gift Boxes</a>
            <a href="shop.html?category=KUNAFA" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Kunafa Collection</a>
            <a href="shop.html?category=CARAMEL" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Salted Caramels</a>
          </div>

          <!-- About Links -->
          <div class="flex flex-col gap-3">
            <h4 class="font-serif text-base font-bold text-[#25160e] mb-1">About</h4>
            <a href="index.html#heritage" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Our Story</a>
            <a href="index.html#standards" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Ingredients & Quality</a>
            <a href="index.html#standards" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Ethical Sourcing</a>
            <a href="index.html#heritage" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Artisan Atelier</a>
          </div>

          <!-- Support Links -->
          <div class="flex flex-col gap-3">
            <h4 class="font-serif text-base font-bold text-[#25160e] mb-1">Support</h4>
            <a href="https://wa.me/${MELLOURA_CONFIG.whatsappNumber}" target="_blank" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors flex items-center gap-1">
              <span>WhatsApp Concierge</span>
              <span class="material-symbols-outlined text-xs text-[#25D366]">chat</span>
            </a>
            <a href="checkout-step-1.html" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Order Tracking</a>
            <a href="index.html#standards" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">Temperature Guarantee</a>
            <a href="mailto:${MELLOURA_CONFIG.supportEmail}" class="text-xs text-[#4f4540] hover:text-[#885210] transition-colors">${MELLOURA_CONFIG.supportEmail}</a>
          </div>
        </div>

        <!-- Copyright bar -->
        <div class="px-4 md:px-12 max-w-[1280px] mx-auto border-t border-[#d3c3bd]/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#81756f]">
          <p>© 2024 Melloura Chocolates. Crafted with precision. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-[#25160e] transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-[#25160e] transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-[#25160e] transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    `;
  }
};

if (typeof module !== 'undefined') {
  module.exports = MellouraUI;
}


const MellouraFlavours = (() => {


  // ─── Flavour data list ───────────────────────────────────────────
  const flavours = [
    {
      id: 'golden-lotus',
      name: 'Golden Lotus',
      price: 599,
      compareAt: 699,
      badge: 'POPULAR',
      shortDescription: 'A luxurious blend of creamy chocolate with roasted caramel and Belgian speculoos biscuit paste, adorned with golden flecks.',
      weight: 'Pack of 12 Truffles',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Golden Lotus Caramel Truffles.png"
    },
    {
      id: 'Lotus Biscoff ',
      name: 'Lotus Biscoff ',
      price: 599,
      compareAt: 699,
      badge: "CHEF'S PICK",
      shortDescription: 'Dense, fudgy bites of slow-baked Belgian chocolate brownie loaded with Californian walnuts toasted in clarified butter.',
      weight: 'Box of 12 Pieces',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Gooey Biscoff Cookie Butter Bonbons.png"
    },
    {
      id: 'Walnut Royale',
      name: 'Walnut Royale',
      price: 599,
      compareAt: 699,
      badge: 'SIGNATURE',
      shortDescription: 'Velvety salted caramel ganache enrobed in premium dark chocolate with a hand-crowned caramel lattice top.',
      weight: 'Box of 12 Truffles',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Gourmet Walnut Brownie Truffles.png"
    },
    {
      id: 'Coconut Velvet',
      name: 'Coconut Velvet',
      price: 599,
      compareAt: 699,
      badge: 'TRENDING',
      shortDescription: 'Desiccated coconut and white chocolate ganache wrapped in a silky dark chocolate shell — tropical freshness meets Belgian craft.',
      weight: 'Pack of 12 Truffles',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Round Coconut (1).png"
    },
    {
      id: 'Mix Dry Fruits',
      name: 'Mix Dry Fruits',
      price: 599,
      compareAt: 629,
      badge: 'PREMIUM',
      shortDescription: 'A regal trio of cashew, almond and pistachio pralines encased in single-origin dark chocolate, dusted with gold.',
      weight: 'Box of 12 Pieces',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Round Dry-Fruit (1).png"
    },
    {
      id: 'Signature Square',
      name: 'Signature Square',
      price: 599,
      compareAt: 679,
      badge: 'LIGHT',
      shortDescription: 'Desiccated coconut and white chocolate ganache wrapped in a silky dark chocolate shell — tropical freshness meets Belgian craft.',
      weight: 'Pack of 12 Truffles',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Square  Dry-Fruit (1).png"
    },
    {
      id: 'Pistachio Kunafa',
      name: 'Pistachio Kunafa',
      price: 599,
      compareAt: 749,
      badge: 'BESTSELLER',
      shortDescription: 'Crispy kadaifi pastry, Antep pistachio cream and premium milk chocolate — the Dubai sensation, artisanal Melloura style.',
      weight: 'Box of 12 Pieces',
      image: "E:\\New folder (3)\\New folder (3)\\images\\Square Kunafa (1).png"
    },

  ];

  let currentIndex = 0;
  let currentQty = 1;
  let isAnimating = false;

  // ─── Discount helper ─────────────────────────────────────────────
  function discountText(price, compareAt) {
    if (!compareAt || compareAt <= price) return '';
    const pct = Math.round(((compareAt - price) / compareAt) * 100);
    return pct + '% OFF';
  }

  // ─── Render all list items ────────────────────────────────────────
  function renderList() {
    const list = document.getElementById('flavours-list');
    if (!list) return;
    list.innerHTML = flavours.map((f, i) => `
      <div class="flavour-item${i === currentIndex ? ' active' : ''}" onclick="MellouraFlavours.select(${i})" role="button" tabindex="0">
        <div style="flex:1;min-width:0">
          <div class="flavour-name">${f.name}</div>
        </div>
        <div style="display:flex;align-items:center;flex-shrink:0">
          <span class="flavour-price">₹${f.price}</span>
          <span class="material-symbols-outlined flavour-arrow">chevron_right</span>
        </div>
      </div>
    `).join('');
  }

  // ─── Update the detail panel (with fade animation) ────────────────
  function updateDetail(flavour) {
    const panel = document.getElementById('flavour-detail-panel');
    if (panel) {
      panel.classList.add('hidden-anim');
    }
    const img = document.getElementById('flavour-main-image');
    if (img) {
      img.classList.remove('fade-in');
      img.classList.add('fade-out');
    }

    setTimeout(() => {
      // Update image
      if (img) {
        img.src = flavour.image;
        img.alt = flavour.name;
        img.classList.remove('fade-out');
        img.classList.add('fade-in');
      }

      // Update text fields
      const badge = document.getElementById('flavour-badge');
      const name = document.getElementById('flavour-detail-name');
      const desc = document.getElementById('flavour-detail-desc');
      const price = document.getElementById('flavour-detail-price');
      const orig = document.getElementById('flavour-detail-original');
      const disc = document.getElementById('flavour-detail-discount');
      const weight = document.getElementById('flavour-detail-weight');

      if (badge) badge.textContent = flavour.badge || 'ARTISANAL';
      if (name) name.textContent = flavour.name;
      if (desc) desc.textContent = flavour.shortDescription;
      if (price) price.textContent = '₹' + flavour.price;
      if (orig) {
        orig.textContent = flavour.compareAt ? '₹' + flavour.compareAt : '';
        orig.style.display = flavour.compareAt ? '' : 'none';
      }
      if (disc) {
        const d = discountText(flavour.price, flavour.compareAt);
        disc.textContent = d;
        disc.style.display = d ? '' : 'none';
      }
      if (weight) weight.textContent = flavour.weight || 'Pack of 4 Truffles';

      // Reset qty
      currentQty = 1;
      const qtyDisplay = document.getElementById('flavour-qty-display');
      if (qtyDisplay) qtyDisplay.textContent = '1';

      // Fade panel back in
      if (panel) panel.classList.remove('hidden-anim');
      isAnimating = false;
    }, 280);
  }

  // ─── Public API ───────────────────────────────────────────────────
  return {
    init() {
      // Only run on the home page
      if (!document.getElementById('flavours-list')) return;
      currentIndex = 0;
      currentQty = 1;
      renderList();
      updateDetail(flavours[0]);
    },

    select(index) {
      if (isAnimating || index === currentIndex) return;
      isAnimating = true;
      currentIndex = index;

      // Update active state in list
      document.querySelectorAll('#flavours-list .flavour-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
      });

      updateDetail(flavours[index]);

      // Scroll selected item into view on mobile
      const activeEl = document.querySelectorAll('#flavours-list .flavour-item')[index];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    },

    changeQty(delta) {
      currentQty = Math.max(1, Math.min(99, currentQty + delta));
      const qtyDisplay = document.getElementById('flavour-qty-display');
      if (qtyDisplay) qtyDisplay.textContent = currentQty;
    },

    addToBag() {
      const flavour = flavours[currentIndex];
      // Build a product-compatible object for MellouraCart
      const product = {
        id: flavour.id,
        name: flavour.name,
        price: flavour.price,
        compareAtPrice: flavour.compareAt,
        discount: discountText(flavour.price, flavour.compareAt),
        badge: flavour.badge,
        shortDescription: flavour.shortDescription,
        weight: flavour.weight,
        images: [flavour.image],
        image: flavour.image
      };

      if (typeof MellouraCart !== 'undefined') {
        MellouraCart.addItem(product, currentQty);
        // Open cart drawer
        if (typeof MellouraUI !== 'undefined') {
          MellouraUI.toggleCartDrawer(true);
        }
      } else {
        alert('Cart not available. Please refresh the page.');
      }
    },

    buyNow() {
      const flavour = flavours[currentIndex];
      const product = {
        id: flavour.id,
        name: flavour.name,
        price: flavour.price,
        compareAtPrice: flavour.compareAt,
        discount: discountText(flavour.price, flavour.compareAt),
        badge: flavour.badge,
        shortDescription: flavour.shortDescription,
        weight: flavour.weight,
        images: [flavour.image],
        image: flavour.image
      };

      if (typeof MellouraCart !== 'undefined') {
        MellouraCart.addItem(product, currentQty);
      }
      // Redirect to cart page
      window.location.href = 'cart.html';
    },

    whatsapp() {
      const flavour = flavours[currentIndex];
      const number = (typeof WHATSAPP_NUMBER !== 'undefined') ? WHATSAPP_NUMBER : '919624594839';
      const msg = encodeURIComponent(
        `Hello Melloura! 🍫\n\nI'd like to order:\n\n` +
        `*${flavour.name}*\n` +
        `Price: ₹${flavour.price}\n` +
        `Quantity: ${currentQty}\n` +
        `Total: ₹${flavour.price * currentQty}\n\n` +
        `Please confirm availability and delivery details. Thank you!`
      );
      window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
    }
  };
})();

// Auto-init the flavours section when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MellouraFlavours.init();
});
