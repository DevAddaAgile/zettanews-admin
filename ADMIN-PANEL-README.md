# Blog Admin Panel

This is the admin panel for the blog system built with Angular, Express, and MongoDB.

## Features

- Super Admin login
- CRUD operations for blogs, tags, and categories
- Publish/unpublish blogs
- View blog list in a table format

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running on localhost:27017

### Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running:
```bash
# Start MongoDB if not already running
# On Windows:
# "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath="C:\data\db"
# On macOS/Linux:
# mongod --dbpath /data/db
```

3. Start the application:
```bash
npm run dev:ssr
```

4. Access the admin panel:
- Admin Panel: http://localhost:4201/admin

### Super Admin Credentials

- Email: admin@example.com
- Password: admin123

## Admin Panel Features

### Blog Management
- View all blogs in a table format
- Create new blogs with title, content, excerpt, featured image
- Assign tags and categories to blogs
- Edit existing blogs
- Delete blogs
- Publish/unpublish blogs

### Tag Management
- View all tags
- Create new tags
- Edit existing tags
- Delete tags

### Category Management
- View all categories
- Create new categories with name and description
- Edit existing categories
- Delete categories

## API Endpoints

### Authentication
- POST /api/auth/login - Login user

### Blogs
- GET /api/blogs - Get all blogs
- GET /api/blogs/id/:id - Get blog by ID
- GET /api/blogs/slug/:slug - Get blog by slug
- POST /api/blogs - Create a new blog (admin only)
- PUT /api/blogs/:id - Update blog (admin only)
- DELETE /api/blogs/:id - Delete blog (admin only)
- PATCH /api/blogs/:id/toggle-publish - Toggle publish status (admin only)

### Tags
- GET /api/tags - Get all tags
- POST /api/tags - Create a new tag (admin only)
- PUT /api/tags/:id - Update tag (admin only)
- DELETE /api/tags/:id - Delete tag (admin only)

### Categories
- GET /api/categories - Get all categories
- POST /api/categories - Create a new category (admin only)
- PUT /api/categories/:id - Update category (admin only)
- DELETE /api/categories/:id - Delete category (admin only)