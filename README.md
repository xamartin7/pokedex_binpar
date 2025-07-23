# 🔥 Pokédex

> A modern, comprehensive Pokédex application built with Next.js, featuring all Pokémon generations with detailed information, statistics, and evolution chains.

## 🚀 Quick Start

### Prerequisites

Make sure you have one of the following package managers installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or [npm](https://npmjs.com/)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xamartin7/pokedex_binpar.git
   ```
   
   Or using SSH:
   ```bash
   git clone git@github.com:xamartin7/pokedex_binpar.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd pokedex_binpar
   ```

3. **Install dependencies**
   
   Using pnpm (recommended):
   ```bash
   pnpm install
   ```
   
   Using npm:
   ```bash
   npm install
   ```

### ⚙️ Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Or create a new `.env` file with the following variables:
   ```env
   AUTH_SECRET="test"
   AUTH_DISCORD_ID="test"
   AUTH_DISCORD_SECRET="test"
   DATABASE_URL="file:./db.sqlite"
   ```

### 🎯 Running the Application

#### Production Build

Using pnpm:
```bash
pnpm run build
pnpm run start
```

Using npm:
```bash
npm run build
npm run start
```

#### Development Mode

Using pnpm:
```bash
pnpm run dev
```

Using npm:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Starts the development server |
| `build` | Creates an optimized production build |
| `start` | Starts the production server |
| `lint` | Runs ESLint to check code quality |
| `lint:fix` | Runs ESLint and fixes auto-fixable issues |
| `type-check` | Runs TypeScript type checking |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── contexts/              # React contexts
├── server/                # Backend logic (tRPC, auth, database)
├── styles/                # Global styles
├── trpc/                  # tRPC client configuration
└── types/                 # TypeScript type definitions
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **API**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm

## 📝 Features

- 📱 Responsive design for all devices
- 🔍 Advanced search and filtering
- 📊 Detailed Pokémon statistics and information
- 🔄 Evolution chains visualization
- 🎨 Modern and intuitive UI
- ⚡ Fast performance with Next.js optimizations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ for Pokémon fans everywhere
</div>

