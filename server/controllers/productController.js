const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper: upload buffer to cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Get all active products (with filters)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalSales: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('seller', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name avatar bio github twitter website'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, tags } = req.body;

    const previewImages = [];
    let productFileUrl = '';

    // Handle image uploads from memory storage
    if (req.files && req.files.previewImages) {
      for (const file of req.files.previewImages) {
        try {
          const result = await uploadToCloudinary(file.buffer, 'devmart/images');
          previewImages.push(result.secure_url);
        } catch (err) {
          console.error('Image upload error:', err);
        }
      }
    }

    // Handle product file upload
    if (req.files && req.files.productFile && req.files.productFile[0]) {
      try {
        const result = await uploadToCloudinary(
          req.files.productFile[0].buffer,
          'devmart/files',
          'raw'
        );
        productFileUrl = result.secure_url;
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags) : [],
      previewImages,
      productFile: productFileUrl,
      seller: req.user._id,
    });

    await product.populate('seller', 'name avatar');

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const { title, description, price, category, tags, isActive } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (tags) updateData.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    // Handle new image uploads
    if (req.files && req.files.previewImages) {
      const previewImages = [];
      for (const file of req.files.previewImages) {
        try {
          const result = await uploadToCloudinary(file.buffer, 'devmart/images');
          previewImages.push(result.secure_url);
        } catch (err) {
          console.error('Image upload error:', err);
        }
      }
      if (previewImages.length > 0) updateData.previewImages = previewImages;
    }

    if (req.files && req.files.productFile && req.files.productFile[0]) {
      try {
        const result = await uploadToCloudinary(
          req.files.productFile[0].buffer,
          'devmart/files',
          'raw'
        );
        updateData.productFile = result.secure_url;
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('seller', 'name avatar');

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's own products
// @route   GET /api/products/seller/my-products
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate('seller', 'name avatar');

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
