const express = require('express');
const router = express.Router();
const { Product } = require('../models/index');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// @route   GET /api/products
// @desc    Get all products (with optional search)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let whereClause = {};

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    if (category) {
      whereClause.category = category;
    }

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    await product.destroy();
    res.json({ message: '✅ Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;