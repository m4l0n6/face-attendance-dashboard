# 📊 Modern Admin Dashboard Template

A simple admin dashboard template built with React, TypeScript, Vite, and Shadcn/UI components. Features a clean design with custom file-based routing system for scalable application development.

![Dashboard Preview](./public/Capture.PNG)

## Features

- **Fast Development** - Built with Vite for lightning-fast HMR
- **Responsive Design** - Works seamlessly across all devices
- **TypeScript** - Full type safety and excellent developer experience
- **File-based Routing** - Custom routing system based on file structure

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Components**: Shadcn/UI
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Table Library**: TanStack Table

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DuyBigPP/SHADCN_BASE.git
   cd shadcn_base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (DataTable, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── ui/              # Shadcn/UI components
├── config/              # Configuration files
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components (file-based routing)
├── routes/              # Routing configuration
└── utils/               # Helper utilities
```

## Key Features

### Custom File-based Routing
The application uses a custom file-based routing system that automatically generates routes based on your file structure in the `pages/` directory. No Nextjs for faster dev experience.

