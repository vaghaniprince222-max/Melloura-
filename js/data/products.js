
const MELLOURA_PRODUCTS = [
  {
    id: "biscoff-bliss",
    slug: "biscoff-bliss",
    name: "Biscoff Bliss",
    badge: "BESTSELLER",
    isBestseller: true,
    price: 599,
    compareAtPrice: 699,
    discount: "18% OFF",
    rating: 4.9,
    reviewCount: 124,
    categories: ["ALL", "BESTSELLERS", "CARAMEL"],
    tags: ["BESTSELLER", "HANDCRAFTED", "VEGETARIAN"],
    shortDescription: "Belgian chocolate truffle layered with luscious Biscoff spread, crisp caramelized biscuit crumble and a delicate cinnamon finish.",
    description: "Belgian chocolate truffle layered with luscious Biscoff spread, crisp caramelized biscuit crumble and a delicate cinnamon finish. A harmonious blend of crunch and silkiness that melts effortlessly.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Golden Lotus Caramel Truffles.png"
    ],
    ingredients: "Premium Belgian dark chocolate (54%), Biscoff spread, crushed caramelized biscuits, fresh dairy cream, unsalted butter, sea salt, ground cinnamon.",
    allergens: "Contains dairy, gluten, and soy. Crafted in a facility that processes nuts.",
    delivery: "Ships in insulated packaging with frozen gel packs to preserve pristine texture. Standard delivery in 3-5 business days across India.",
    storage: "Store in a cool, dry place between 15°C - 20°C. Avoid direct sunlight and do not refrigerate immediately."
  },
  {
    id: "golden-lotus",
    slug: "golden-lotus",
    name: "Golden Lotus",
    badge: "POPULAR",
    isBestseller: true,
    price: 599,
    compareAtPrice: 699,
    discount: "18% OFF",
    rating: 4.8,
    reviewCount: 48,
    categories: ["ALL", "BESTSELLERS", "CARAMEL"],
    tags: ["BESTSELLER", "GOLD FOIL"],
    shortDescription: "A luxurious blend of creamy chocolate and crunchy lotus biscoff.",
    description: "A decadent pairing of roasted caramel and creamy Belgian milk chocolate infused with authentic Belgian speculoos biscuit paste and adorned with golden flecks.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Glossy Caramel Crumb Truffles.png"
    ],
    ingredients: "Belgian milk chocolate (42%), Lotus biscuit spread, pure dairy cream, cocoa butter, vanilla bean extract.",
    allergens: "Contains dairy, gluten, and soy.",
    delivery: "Insulated temperature-controlled dispatch within 24 hours.",
    storage: "Store in a cool, dry ambient space (18°C)."
  },
  {
    id: "Lotus Biscoff ",
    slug: "lotus-biscoff",
    name: "Lotus Biscoff ",
    badge: "CHEF'S PICK",
    isBestseller: true,
    price: 599,
    compareAtPrice: 699,
    discount: "18% OFF",
    rating: 4.8,
    reviewCount: 32,
    categories: ["ALL", "BESTSELLERS", "NUTTY"],
    tags: ["NUTTY", "CLASSIC"],
    shortDescription: "Fudgy chocolate brownie pieces with toasted premium walnuts.",
    description: "Dense, fudgy bites of slow-baked Belgian chocolate brownie loaded with Californian walnuts toasted in clarified butter for an earthy crunch.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Gooey Biscoff Cookie Butter Bonbons.png"
    ],
    ingredients: "Dark chocolate (60%), unsalted butter, organic brown sugar, toasted Californian walnuts, flour, farm eggs/egg-free substitute.",
    allergens: "Contains tree nuts, dairy, wheat.",
    delivery: "Vacuum sealed fresh for temperature-controlled shipping.",
    storage: "Best consumed within 10 days of opening."
  },
  {
    id: "Walnut Royale",
    slug: "walnut-royale",
    name: "Walnut Royale",
    badge: "SIGNATURE",
    isBestseller: true,
    price: 599,
    compareAtPrice: 699,
    discount: "15% OFF",
    rating: 4.9,
    reviewCount: 124,
    categories: ["ALL", "BESTSELLERS", "KUNAFA", "NUTTY"],
    tags: ["LIMITED EDITION", "KUNAFA", "PISTACHIO"],
    shortDescription: "An indulgent fusion of Middle Eastern tradition and artisanal chocolate craft.",
    description: "A thick shell of single-origin dark chocolate encases a vibrant, textured heart of creamy pistachio paste and toasted, buttery kataifi shredded pastry.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Gourmet Walnut Brownie Truffles.png"
    ],
    ingredients: "Dark chocolate 58%, pure Sicilian pistachio cream, roasted Turkish pistachios, kataifi filo pastry, clarified butter.",
    allergens: "Contains tree nuts (pistachios), dairy, wheat, soy.",
    delivery: "Shipped in thermal box with dry ice pack.",
    storage: "Store at 16°C - 19°C. Consume within 2 weeks."
  },
  {
    id: "Coconut Velvet",
    slug: "coconut-velvet",
    name: "Coconut Velvet",
    badge: "ARTISANAL",
    isBestseller: true,
    price: 599,
    compareAtPrice: 629,
    discount: "15% OFF",
    rating: 4.8,
    reviewCount: 76,
    categories: ["ALL", "CARAMEL"],
    tags: ["CARAMEL", "ARTISAN"],
    shortDescription: "Hand-poured chocolate sphere holding molten salted butter caramel.",
    description: "An ultra-thin Belgian dark chocolate orb that bursts with slow-cooked Brittany salted butter caramel upon the first bite.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Round Coconut (1).png"
    ],
    ingredients: "Dark chocolate (54%), sugar, cream, French butter, Guérande sea salt.",
    allergens: "Contains dairy. May contain traces of tree nuts.",
    delivery: "Climate-controlled delivery in 2-4 business days.",
    storage: "Store in a cool pantry. Do not expose to heat."
  },
  {
    id: "Mix Dry Fruits",
    slug: "mix-dry-fruits",
    name: "Mix Dry Fruits",
    badge: "PREMIUM",
    isBestseller: true,
    price: 599,
    compareAtPrice: 629,
    discount: "19% OFF",
    rating: 5.0,
    reviewCount: 98,
    categories: ["ALL", "GIFTING", "BESTSELLERS"],
    tags: ["GIFT BOX", "24 PIECES"],
    shortDescription: "An opulent 24-piece box featuring single-origin dark chocolate selections.",
    description: "A collector box of 24 handcrafted pralines and truffles spanning Ghana 70%, Ecuador 65%, and Madagascar 75% dark chocolate profiles.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Round Dry-Fruit (1).png"
    ],
    ingredients: "Cocoa mass, cocoa butter, organic cane sugar, fresh cream, roasted nuts, vanilla extract.",
    allergens: "Contains dairy, tree nuts, and soy.",
    delivery: "Secured with signature satin ribbon and protective travel sleeve.",
    storage: "Store in a wine chiller or cool environment (15°C - 18°C)."
  },
  {
    id: "Signature Square",
    slug: "signature-square",
    name: "Signature Square",
    badge: "SIGNATURE",
    isBestseller: false,
    price: 599,
    compareAtPrice: 679,
    discount: "16% OFF",
    rating: 4.9,
    reviewCount: 54,
    categories: ["ALL", "NUTTY"],
    tags: ["COFFEE", "PRALINE"],
    shortDescription: "Intense Arabica roast infused into delicate hazelnut and almond praline.",
    description: "Dark roasted espresso beans infused into a velvety almond-hazelnut praline, coated in 60% dark chocolate and finished with caramelized bean nibs.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Square  Dry-Fruit (1).png"
    ],
    ingredients: "Dark chocolate, roasted almonds, hazelnuts, Arabica coffee extract, cream, butter.",
    allergens: "Contains tree nuts and dairy.",
    delivery: "Express delivery across metro cities in 24-48 hours.",
    storage: "Store away from strong odors and heat sources."
  },
  {
    id: "Pistachio Kunafa",
    slug: "pistachio-kunafa",
    name: "Pistachio Kunafa",
    badge: "POPULAR",
    isBestseller: false,
    price: 599,
    compareAtPrice: 749,
    discount: "21% OFF",
    rating: 4.7,
    reviewCount: 65,
    categories: ["ALL", "NUTTY"],
    tags: ["NUTTY", "PIEDMONT"],
    shortDescription: "Roasted Piedmont hazelnuts enrobed in velvety milk chocolate.",
    description: "Whole roasted hazelnuts combined with crispy French crêpe biscuit flakes and gianduja milk chocolate.",
    weight: "12 Chocolates (20g) Per Piece",
    images: [
      "images/Square Kunafa (1).png"
    ]
  }
];

if (typeof module !== 'undefined') {
  module.exports = MELLOURA_PRODUCTS;
}
