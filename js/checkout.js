/**
 * Checkout State, Validation and WhatsApp Order Generation
 * For Melloura Chocolates
 */

const MellouraCheckout = {
  customerStorageKey: "melloura_customer_details",

  getCustomerDetails() {
    try {
      const data = localStorage.getItem(this.customerStorageKey);
      return data ? JSON.parse(data) : {
        email: "",
        mobile: "",
        fullName: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
      };
    } catch (e) {
      return {};
    }
  },

  saveCustomerDetails(details) {
    localStorage.setItem(this.customerStorageKey, JSON.stringify(details));
  },

  validateCustomerDetails(data) {
    const errors = {};
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (!data.mobile || !/^[0-9+-\s]{8,15}$/.test(data.mobile.trim())) {
      errors.mobile = "Please enter a valid mobile number";
    }
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name";
    }
    if (!data.address || data.address.trim().length < 5) {
      errors.address = "Please enter your complete delivery address";
    }
    if (!data.city || data.city.trim().length < 2) {
      errors.city = "Please enter your city";
    }
    if (!data.state) {
      errors.state = "Please select your state";
    }
    if (!data.pincode || !/^[0-9]{6}$/.test(data.pincode.trim())) {
      errors.pincode = "Please enter a valid 6-digit Pincode";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  formatWhatsAppOrderMessage() {
    const customer = this.getCustomerDetails();
    const items = MellouraCart.getItems();
    const totals = MellouraCart.getTotals();
    const giftMessage = MellouraCart.getGiftMessage();
    const orderId = "MEL-" + Math.floor(100000 + Math.random() * 900000);

    // Exact requested format from user instructions:
    let msg = "MELLOURA ORDER\n\n";
    msg += "Customer Name: " + (customer.fullName || "") + "\n";
    msg += "Mobile: " + (customer.mobile || "") + "\n";
    msg += "Email: " + (customer.email || "") + "\n\n";

    msg += "SHIPPING ADDRESS:\n";
    msg += "Full Name: " + (customer.fullName || "") + "\n";
    msg += "Address: " + (customer.address || "") + "\n";
    msg += "City: " + (customer.city || "") + "\n";
    msg += "State: " + (customer.state || "") + "\n";
    msg += "Pincode: " + (customer.pincode || "") + "\n\n";

    msg += "ORDER ITEMS:\n";
    items.forEach((item) => {
      msg += "Product: " + item.name + (item.weight ? " (" + item.weight + ")" : "") + "\n";
      msg += "Quantity: " + item.quantity + "\n";
      msg += "Price: " + MELLOURA_CONFIG.currency + (item.price * item.quantity).toLocaleString() + "\n\n";
    });

    msg += "Subtotal: " + MELLOURA_CONFIG.currency + totals.subtotal.toLocaleString() + "\n";
    msg += "Shipping: " + (totals.shipping === 0 ? "FREE" : MELLOURA_CONFIG.currency + totals.shipping) + "\n";
    if (totals.discount > 0) {
      msg += "Discount (" + (totals.coupon ? totals.coupon.code : "") + "): -" + MELLOURA_CONFIG.currency + totals.discount.toLocaleString() + "\n";
    } else {
      msg += "Discount: None\n";
    }
    msg += "Tax: " + MELLOURA_CONFIG.currency + totals.tax.toLocaleString() + "\n";
    msg += "TOTAL: " + MELLOURA_CONFIG.currency + totals.total.toLocaleString() + "\n\n";

    msg += "Gift Message: " + (giftMessage && giftMessage.trim() ? giftMessage.trim() : "None") + "\n";

    const targetNumber = (typeof WHATSAPP_NUMBER !== 'undefined') ? WHATSAPP_NUMBER : MELLOURA_CONFIG.whatsappNumber;

    return {
      orderId,
      message: msg,
      whatsappUrl: "https://wa.me/" + targetNumber + "?text=" + encodeURIComponent(msg)
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = MellouraCheckout;
}
