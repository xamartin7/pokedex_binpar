# Pokédex

> Moderna enciclopedia pokemon para buscar y ver los datos de todos ellos.

## Para inicializarla en local

### Requisitos previos

Tener instalados:
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recomendado) or [npm](https://npmjs.com/)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/xamartin7/pokedex_binpar.git
   ```
   
   O en SSH:
   ```bash
   git clone git@github.com:xamartin7/pokedex_binpar.git
   ```

2. **Navega al directorio del proyecto**
   ```bash
   cd pokedex_binpar
   ```

3. **Instala las dependencias**
   
   Con pnpm (recommended):
   ```bash
   pnpm install
   ```
   
   Con npm:
   ```bash
   npm install
   ```

### ⚙️ Variables de entorno

1. **Crea el fichero de variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   O crea un fichero `.env` con las variables:
   ```env
   AUTH_SECRET="test"
   NODE_ENV="development"
   ```

### 🎯 Arrancar la aplicación

#### Producción

Con pnpm:
```bash
pnpm run build
pnpm run start
```

Con npm:
```bash
npm run build
npm run start
```

#### En desarrollo

Con pnpm:
```bash
pnpm run dev
```

Con npm:
```bash
npm run dev
```

La aplicación deberia de estar disponible en la ruta `http://localhost:3000`

