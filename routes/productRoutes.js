import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'firstName lastName email');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).populate('createdBy', 'firstName lastName email');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, price, category, imageBase64, imageName } = req.body;
    let imageUrl;

    if (imageBase64) {
      const fileName = imageName || `product-${Date.now()}.png`;
      imageUrl = await uploadImage(`products/${fileName}`, imageBase64, 'image/png');
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!product.createdBy.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    if (updates.imageBase64) {
      const fileName = updates.imageName || `product-${Date.now()}.png`;
      updates.imageUrl = await uploadImage(`products/${fileName}`, updates.imageBase64, 'image/png');
    }

    Object.assign(product, updates);
    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (!product.createdBy.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted', id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
