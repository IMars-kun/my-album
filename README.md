<div align="center">

# 💕 M Love
### *Every Moment, Together With You*

**A Premium, Romantic Photo Gallery & Portfolio**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

[Lihat Album Kita](https://marceila.imarskun.my.id/gallery)

</div>

## ✨ Overview

**M Love** is a modern, immersive photo gallery application designed to preserve and showcase your most precious memories. Built with a "premium-first" design philosophy, it features smooth animations, a romantic aesthetic, and a robust backend for managing your collection.

## 🚀 Features

- **🌸 Romantic UI/UX**: Custom-designed theme with floating heart animations, glassmorphism, and a refined color palette.
- **📸 Dynamic Gallery**: A beautiful, responsive grid layout for browsing albums and photos.
- **🖼️ Lightbox Experience**: Full-screen photo viewing with smooth transitions and high-resolution support.
- **🔐 Secret Admin Panel**: Secure dashboard for the "owner" to manage albums and upload photos.
- **⚡ Full CRUD Operations**: Easily create, read, update, and delete albums and photos.
- **📱 Mobile Optimized**: Fluid responsiveness across all devices, from small phones to large monitors.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Vanilla CSS
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Image Compression**: [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/imarskun/my-album.git
cd my-album
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Setup
Run the SQL queries found in the [`sqlnya`](file:///home/imarskun/Documents/Programming/my-album/sqlnya) file in your Supabase SQL Editor to initialize the `albums` and `photos` tables.

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your gallery in action!

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Navbar, Gallery, Admin tools).
- `src/lib`: Supabase client and utility functions.
- `src/types`: TypeScript definitions for data models.
- `public`: Static assets and icons.

## 📝 License

This project is private and intended for personal use.

---

<div align="center">
Made with ❤️ by [IMars-kun](https://github.com/imarskun)
</div>
