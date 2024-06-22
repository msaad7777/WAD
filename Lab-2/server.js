const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const { ObjectId } = mongoose.Types;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://msaad:fDqWLltk8eW1GCSU@lab2.hk3wps5.mongodb.net/Marketplace?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected...');
  });
  
  mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`);
  });
  
  // Middleware
  app.use(bodyParser.json());
  app.use(cors());
  
  // Product schema and model
  const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    category: String,
  });
  
  const Product = mongoose.model('Product', productSchema);
  
  // Routes
  app.get('/', (req, res) => {
    res.send('Welcome to the Online Market Application');
  });
  
  // Get all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Get product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(ObjectId(req.params.id));
      if (!product) return res.status(404).send('Product not found');
      res.json(product);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Add new product
  app.post('/api/products', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Update product by ID
  app.put('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        ObjectId(req.params.id),
        req.body,
        { new: true }
      );
      if (!product) return res.status(404).send('Product not found');
      res.json(product);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Remove product by ID
  app.delete('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(ObjectId(req.params.id));
      if (!product) return res.status(404).send('Product not found');
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Remove all products
  app.delete('/api/products', async (req, res) => {
    try {
      await Product.deleteMany({});
      res.json({ message: 'All products deleted' });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Find all products which name contains 'kw'
  app.get('/api/products', async (req, res) => {
    try {
      const { name } = req.query;
      if (name) {
        const products = await Product.find({ name: new RegExp(name, 'i') });
        res.json(products);
      } else {
        res.status(400).send('Query parameter "name" is required');
      }
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
  // Resource not found
  app.use((req, res) => {
    res.status(404).send('Resource not found');
  });
  
// Start the server
  app.listen(HTTP_PORT, () => {
    console.log(`Ready to handle requests on port ${HTTP_PORT}`);
  });