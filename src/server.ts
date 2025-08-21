import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

app.use(cors({
  origin: ['http://localhost:4201', 'http://localhost:3004'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection (disabled for development)
// mongoose.connect('mongodb://localhost:27017/fastkart-blog')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// MongoDB schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods['comparePassword'] = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  content: String,
  metaTitle: String,
  metaDescription: String,
  metaImage: String,
  thumbnail: String,
  categories: [String],
  tags: [String],
  featured: Boolean,
  sticky: Boolean,
  published: Boolean,
  author: String
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

// In-memory storage (for categories, tags, reviews)
let categories = [
  { id: 1, name: 'Student', slug: 'student', description: '' },
  { id: 2, name: 'Re-Admission', slug: 're-admission', description: '' },
  { id: 3, name: 'Admissions', slug: 'admissions', description: '' },
  { id: 4, name: 'Mailbox', slug: 'mailbox', description: '' },
  { id: 5, name: 'Finance', slug: 'finance', description: '', subcategories: [
    { id: 51, name: 'Indicator', slug: 'indicator', parentId: 5 },
    { id: 52, name: 'Student', slug: 'finance-student', parentId: 5 },
    { id: 53, name: 'Organization', slug: 'organization', parentId: 5 },
    { id: 54, name: 'Unbalanced Account', slug: 'unbalanced-account', parentId: 5 }
  ]},
  { id: 6, name: 'Internship', slug: 'internship', description: '' },
  { id: 7, name: 'Teacher Management', slug: 'teacher-management', description: '' },
  { id: 8, name: 'Alumni', slug: 'alumni', description: '' },
  { id: 9, name: 'Companies', slug: 'companies', description: '' }
];
let tags = [
  { id: 1, name: 'Student', slug: 'student' },
  { id: 2, name: 'Teacher', slug: 'teacher' },
  { id: 3, name: 'Finance', slug: 'finance' },
  { id: 4, name: 'Admission', slug: 'admission' },
  { id: 5, name: 'RE-Admission', slug: 're-admission' },
  { id: 6, name: 'Export', slug: 'export' },
  { id: 7, name: 'Process', slug: 'process' },
  { id: 8, name: 'Email', slug: 'email' }
];
let reviews = [];
let nextCategoryId = 10;
let nextTagId = 9;
let nextReviewId = 1;

// Auth middleware (disabled for development)
const auth = (req, res, next) => {
  next();
};

const adminAuth = (req, res, next) => {
  next();
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await (user as any).comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key-here');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, role: 'admin' });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Blog API (simplified for development)
let blogs = [];
let nextBlogId = 1;

app.get('/api/blogs', (req, res) => {
  res.json({ success: true, data: blogs, total: blogs.length });
});
app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id == req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, data: blog });
});
app.post('/api/blogs', (req, res) => {
  const blogData = { ...req.body };
  
  // Generate slug if not provided
  if (blogData.title && !blogData.slug) {
    blogData.slug = generateSlug(blogData.title);
  }
  
  const blog = { id: nextBlogId++, ...blogData, createdAt: new Date() };
  blogs.push(blog);
  res.status(201).json({ success: true, data: blog });
});
app.put('/api/blogs/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Blog not found' });
  
  const blogData = { ...req.body };
  
  // Generate slug if title is updated and slug is not provided
  if (blogData.title && !blogData.slug) {
    blogData.slug = generateSlug(blogData.title);
  }
  
  blogs[index] = { ...blogs[index], ...blogData, updatedAt: new Date() };
  res.json({ success: true, data: blogs[index] });
});
app.delete('/api/blogs/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Blog not found' });
  blogs.splice(index, 1);
  res.json({ success: true, message: 'Blog deleted' });
});

// Category API
app.get('/api/categories', (req, res) => {
  console.log('GET /api/categories called');
  res.json({ success: true, categories: categories, total: categories.length });
});
app.get('/api/categories/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, data: category });
});
app.post('/api/categories', (req, res) => {
  const { name, description, status } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const category = { id: nextCategoryId++, name, slug, description: description || '', status: status || 1, createdAt: new Date(), updatedAt: new Date() };
  categories.push(category);
  res.status(201).json({ success: true, data: category });
});
app.put('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Category not found' });
  const { name, slug, description, status } = req.body;
  categories[index] = { ...categories[index], name: name || categories[index].name, slug: slug || categories[index].slug, description: description !== undefined ? description : (categories[index] as any).description || '', status: status !== undefined ? status : (categories[index] as any).status || 1, updatedAt: new Date() } as any;
  res.json({ success: true, data: categories[index] });
});
app.delete('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Category not found' });
  categories.splice(index, 1);
  res.json({ success: true, message: 'Category deleted' });
});

// Tag API
app.get('/api/tags', (req, res) => {
  console.log('GET /api/tags called');
  res.json({ success: true, data: tags, total: tags.length });
});
app.get('/api/tags/:id', (req, res) => {
  const tag = tags.find(t => t.id === parseInt(req.params.id));
  if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
  res.json({ success: true, data: tag });
});
app.post('/api/tags', (req, res) => {
  const { name, slug } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });
  const tag = { id: nextTagId++, name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), createdAt: new Date(), updatedAt: new Date() };
  tags.push(tag);
  res.status(201).json({ success: true, data: tag });
});
app.put('/api/tags/:id', (req, res) => {
  const index = tags.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Tag not found' });
  const { name, slug } = req.body;
  tags[index] = { ...tags[index], name: name || tags[index].name, slug: slug || tags[index].slug, updatedAt: new Date() } as any;
  res.json({ success: true, data: tags[index] });
});
app.delete('/api/tags/:id', (req, res) => {
  const index = tags.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Tag not found' });
  tags.splice(index, 1);
  res.json({ success: true, message: 'Tag deleted' });
});

// Review API
app.get('/api/blogs/:blogId/reviews', (req, res) => {
  const blogReviews = reviews.filter(r => r.blogId === parseInt(req.params.blogId));
  res.json({ success: true, data: blogReviews });
});
app.post('/api/blogs/:blogId/reviews', (req, res) => {
  const { rating, comment, author } = req.body;
  if (!rating || !comment) return res.status(400).json({ success: false, message: 'Rating and comment required' });
  const review = { id: nextReviewId++, blogId: parseInt(req.params.blogId), rating, comment, author: author || 'Anonymous', createdAt: new Date() };
  reviews.push(review);
  res.status(201).json({ success: true, data: review });
});
app.delete('/api/reviews/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Review not found' });
  reviews.splice(index, 1);
  res.json({ success: true, message: 'Review deleted' });
});

// Other API endpoints
app.get('/api/setting.json', (req, res) => {
  const settings = {
    "values": {
      "site_name": "Fastkart Blog",
      "site_title": "Fastkart Blog System",
      "site_description": "A simple blog system built with Angular and Express",
      "site_logo": "assets/images/logo.png",
      "site_favicon": "assets/images/favicon.ico",
      "site_email": "info@fastkart.com",
      "site_phone": "+1 123 456 7890",
      "site_address": "123 Street, City, Country",
      "social_links": {
        "facebook": "https://facebook.com",
        "twitter": "https://twitter.com",
        "instagram": "https://instagram.com",
        "linkedin": "https://linkedin.com"
      },
      "meta": {
        "meta_title": "Fastkart Blog",
        "meta_description": "A simple blog system built with Angular and Express",
        "meta_keywords": "blog, angular, express, mongodb"
      }
    }
  };
  res.json(settings);
});

app.get('/api/account.json', (req, res) => {
  res.json({ success: true, data: { name: 'Admin', email: 'admin@example.com', role: 'admin' } });
});

app.post('/api/upload', (req, res) => {
  const timestamp = Date.now();
  const filename = `${timestamp}-image.jpg`;
  res.json({
    original_url: `http://localhost:3004/uploads/${filename}`,
    filename: filename
  });
});

app.get('/api/attachments', (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/attachments', (req, res) => {
  res.json([{ original_url: 'http://localhost:3004/uploads/sample.jpg' }]);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 3004;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
