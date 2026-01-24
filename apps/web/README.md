#  Blog Application with Next.js, Makerkit & Supabase

**Developer:** Muhammad Kashif  
**Assignment:** Build a fully functional blog application

---

##  Project Overview

This project is a complete blog application built using **Next.js**, **Makerkit**, and **Supabase**.  
It allows users to browse blog posts, read full articles, and create new posts after authentication.

---

##  What i have done

-  View blog posts with pagination (5 posts per page)
-  Read full blog post details
- Create new blog posts (authenticated users only)
-  Authentication with Email/Password 
- User session persistence across browser tabs
- Row Level Security (RLS) for database protection

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **UI & Auth:** Makerkit
- **Backend & Database:** Supabase
- **API:** Supabase API
- **Authentication:** Supabase Auth
- **Local Database:** Supabase + Docker

---

##  How the Project Was Built

### 1. Getting Started
- Cloned the Makerkit starter template from GitHub
- Installed required dependencies
- Learned Makerkit architecture (new framework)
- Created a Supabase project for backend services

### 2. Database Setup
- Created `.env.local` for Supabase credentials
- Ran Supabase locally using Docker
- Created database migrations for blog posts
- Seeded initial blog data
- Implemented Row Level Security (RLS)


### 3. Application Pages & Features

| Route | Description |
|-------|-------------|
| `/blog` | Blog listing page with pagination |
| `/blog/[id]` | Blog post detail page |
| `/home/blog/create` | Create blog post (authenticated users only) |

### 4. Authentication
- Used Makerkit’s built-in authentication
- Email/Password login
- Session handling across tabs

---

##  Why I don't use GRAPQL and Apollo?

Although the assignment mentioned **GraphQL and Apollo**

**Reasons:**
- I don't have experiance with GraphQL/Apollo this was totally new for me i used REST APIs
- needed time to understand the structure and documenations concepts
- I have tried using AI software but i thought it create problems in evoluation 
- Focused on delivering fully working features
- 
- 

---

##  How to Run the Project Locally

###  Prerequisites

Make sure you have the following installed:

- **Node.js**
- **npm or pnpm**
- **Docker** (for Supabase local setup)
- **Git**

---
### Step-by-Step Details: How I Started

- Cloned the repository:  
  `https://github.com/makerkit/nextjs-saas-starter-kit-lite`

- Installed all required packages.

- Took time to understand how Makerkit works, as it was a new kit for me.  
  Learned its structure, flow, and how it can be customized.

- Created a Supabase project.

- Created a `.env` file and defined Supabase credentials.

- Ran Supabase locally using Docker.

- Defined the Supabase URL.

- Created a migration for blog posts in Supabase.

- Reset the database and encountered a storage error from an existing migration.  
  Renamed the migration so it could run after all existing migrations.

- Created a seed migration to insert sample data into the `blog_posts` table.

- Created the `/blog` page to display all blog posts.

- Defined Supabase clients to fetch data from Supabase.

- Implemented pagination to display 5 posts per page.

- Created the `/blog/[id]` route to display detailed blog posts.

- Created the `/home/blog/create` route for creating new blog posts.

- Used `use-auth` to protect routes, validate the page, avoid Supabase synchronization issues, and retrieve the authenticated user.

- Created a migration to enable Row Level Security (RLS).


###  Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/nextjs-saas-starter-kit-lite.git
cd nextjs-saas-starter-kit-lite
install pakages
npm run dev or pnpm run dev
