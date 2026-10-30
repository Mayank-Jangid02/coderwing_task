import Product from '../models/product.model.js';

const initialProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation, exceptional high-resolution sound quality, and up to 30-hour battery life with quick charging.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: { rate: 4.8, count: 420 },
    stock: 35,
    featured: true,
  },
  {
    name: 'Apple Watch Series 9 Smartwatch',
    description: 'Advanced health sensors, bright Always-On Retina display, S9 SiP processor, crash detection, and water resistance up to 50 meters.',
    price: 399.00,
    originalPrice: 429.00,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    rating: { rate: 4.9, count: 560 },
    stock: 22,
    featured: true,
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    description: 'Wireless Bluetooth mechanical keyboard with Gateron hot-swappable switches, RGB backlighting, and Mac/Windows cross-compatibility.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    rating: { rate: 4.7, count: 215 },
    stock: 45,
    featured: true,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, and ergonomic thumb rest for all-day comfort.',
    price: 99.99,
    originalPrice: 119.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    rating: { rate: 4.9, count: 830 },
    stock: 50,
    featured: false,
  },
  {
    name: 'Minimalist Commuter Backpack',
    description: 'Water-resistant coated canvas, dedicated 16-inch padded laptop compartment, luggage pass-through strap, and ergonomic shoulder cushions.',
    price: 74.50,
    originalPrice: 89.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    rating: { rate: 4.6, count: 180 },
    stock: 40,
    featured: false,
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses',
    description: 'Timeless tear-drop shape sunglasses with crystal green lenses, UV400 protection, and lightweight golden metal frame.',
    price: 163.00,
    originalPrice: 185.00,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    rating: { rate: 4.5, count: 310 },
    stock: 18,
    featured: false,
  },
  {
    name: 'Bose SoundLink Flex Bluetooth Speaker',
    description: 'Rugged portable waterproof outdoor speaker with PositionIQ technology, deep bass, and 12-hour rechargeable battery life.',
    price: 149.00,
    originalPrice: 169.00,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    rating: { rate: 4.7, count: 290 },
    stock: 30,
    featured: true,
  },
  {
    name: 'Stainless Steel Insulated Water Bottle (32oz)',
    description: 'Double-wall vacuum insulation keeps drinks ice cold for 24 hours or piping hot for 12 hours. Leakproof chug lid included.',
    price: 32.99,
    originalPrice: 39.99,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    rating: { rate: 4.8, count: 512 },
    stock: 65,
    featured: false,
  },
];

export const getAllProducts = async (req, res) => {
  try {
    // If no products exist in the collection, auto-seed with realistic data
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(initialProducts);
      console.log('Seeded initial products automatically');
    }

    const { category, search, sortBy } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sortBy === 'rating') {
      sortOption = { 'rating.rate': -1 };
    } else if (sortBy === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);
    const categories = await Product.distinct('category');

    return res.status(200).json({
      success: true,
      count: products.length,
      categories: ['All', ...categories],
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
};

export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(initialProducts);
    return res.status(201).json({
      message: 'Products re-seeded successfully',
      count: inserted.length,
      products: inserted,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to seed products', error: error.message });
  }
};

