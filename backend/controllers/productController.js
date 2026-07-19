const Product = require("../models/Products");

const getProducts = async (req, res) => {
  try {
    const { sid, latest, deals ,fresh ,foryoudeal,foryoulatest} = req.query;
    const filter = {};

    if (sid) filter.sid = Number(sid);
    if (latest === "true") filter.isLatest = true;
    if (deals === "true") filter.isDeal = true;
    if (fresh === "true") filter.isFresh = true;
   if (foryoudeal === "true") filter.isForYouDeal = true;
   if (foryoulatest === "true") filter.isForYouLatest = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const products = await Product.find({}).select("sid subcategory_name");
    const unique = new Map();

    products.forEach((product) => {
      if (product.sid && !unique.has(product.sid)) {
        unique.set(product.sid, {
          id: product.sid,
          subcategory_name: product.subcategory_name,
        });
      }
    });

    res.status(200).json(Array.from(unique.values()));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProducts, addProduct, getSubcategories };
