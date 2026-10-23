
const MellouraCart = {
  storageKey: "melloura_cart_items",
  couponKey: "melloura_applied_coupon",
  giftMsgKey: "melloura_gift_message",

  getItems() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read cart", e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.notifyUpdate();
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  },

  addItem(product, qty = 1, options = {}) {
    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id && JSON.stringify(item.options || {}) === JSON.stringify(options));

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      items.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || ""),
        weight: product.weight || "Artisanal Selection",
        quantity: qty,
        options: options
      });
    }

    this.saveItems(items);
    this.showToast(`${product.name} added to cart`);
    return items;
  },

  removeItem(index) {
    const items = this.getItems();
    if (index >= 0 && index < items.length) {
      const removed = items.splice(index, 1);
      this.saveItems(items);
      this.showToast(`Removed item from cart`);
    }
    return items;
  },

  updateQuantity(index, quantity) {
    const items = this.getItems();
    if (index >= 0 && index < items.length) {
      if (quantity <= 0) {
        return this.removeItem(index);
      } else {
        items[index].quantity = quantity;
        this.saveItems(items);
      }
    }
    return items;
  },

  clear() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.couponKey);
    localStorage.removeItem(this.giftMsgKey);
    this.notifyUpdate();
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCoupon() {
    try {
      const code = localStorage.getItem(this.couponKey);
      if (code && MELLOURA_CONFIG.coupons[code]) {
        return MELLOURA_CONFIG.coupons[code];
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  applyCoupon(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (MELLOURA_CONFIG.coupons[cleanCode]) {
      localStorage.setItem(this.couponKey, cleanCode);
      this.notifyUpdate();
      return { success: true, coupon: MELLOURA_CONFIG.coupons[cleanCode] };
    }
    return { success: false, message: "Invalid promo code" };
  },

  removeCoupon() {
    localStorage.removeItem(this.couponKey);
    this.notifyUpdate();
  },

  getGiftMessage() {
    return localStorage.getItem(this.giftMsgKey) || "";
  },

  setGiftMessage(msg) {
    localStorage.setItem(this.giftMsgKey, (msg || "").trim());
  },

  getTotals() {
    const subtotal = this.getSubtotal();
    const coupon = this.getCoupon();
    let discount = 0;

    if (coupon) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    }

    // Free delivery on every order
    const shipping = 0;

    const taxableAmount = Math.max(0, subtotal - discount);


    // GST is already included in the product price.

    // Calculate the GST component for display only.
    const tax = MELLOURA_CONFIG.taxRate > 0
      ? Math.round(
        taxableAmount -
        (taxableAmount / (1 + MELLOURA_CONFIG.taxRate))
      )
      : 0;

    // Do not add GST again to the total
    const total = Math.max(0, taxableAmount + shipping);




    return {
      subtotal,
      discount,
      coupon,
      shipping,
      isFreeShipping: shipping === 0 && subtotal > 0,
      tax,
      total,
      count: this.getCount()
    };
  },

  notifyUpdate() {
    // Update badge in all DOM instances
    const badges = document.querySelectorAll('.cart-badge-count');
    const count = this.getCount();
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });

    // Render drawer if present
    if (typeof MellouraUI !== 'undefined' && MellouraUI.renderCartDrawer) {
      MellouraUI.renderCartDrawer();
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('melloura:cartUpdated', { detail: this.getTotals() }));
  },

  showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
};

if (typeof module !== 'undefined') {
  module.exports = MellouraCart;
}
