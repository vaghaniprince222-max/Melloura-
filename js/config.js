const WHATSAPP_NUMBER = "919624594839";

const MELLOURA_CONFIG = {
  storeName: "Melloura",
  fullStoreName: "Melloura Chocolates",
  tagline: "Premium Handcrafted Chocolates for Gifting and Special Moments",
  currency: "₹",
  currencyCode: "INR",
  whatsappNumber: WHATSAPP_NUMBER,
  rawWhatsappNumber: "9624594839",
  supportEmail: "mellourachocolates@gmail.com",
  supportPhone: "+91 96245 94839",

  freeShippingThreshold: 999,
  flatShippingRate: 99,
  taxRate: 0.05,

  coupons: {
    "WELCOME10": {
      code: "WELCOME10",
      discountPercent: 10,
      description: "10% off on your luxury order"
    },

    "MELLOURA10": {
      code: "MELLOURA10",
      discountPercent: 10,
      description: "10% off on your luxury order"
    },

    "MELLOURA20": {
      code: "MELLOURA20",
      discountPercent: 20,
      description: "20% off celebration special"
    }
  }
};

if (typeof module !== "undefined") {
  module.exports = { MELLOURA_CONFIG, WHATSAPP_NUMBER };
}
