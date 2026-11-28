import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3039;

function titleName(raw: string) {
  const lower = raw.trim().toLowerCase();
  let name = '';
  let capital = true;
  for (const character of lower) {
    if (character === ' ' || character === '-' || character === "'") {
      name += character;
      capital = true;
    } else if (capital) {
      name += character.toUpperCase();
      capital = false;
    } else {
      name += character;
    }
  }
  return name;
}

function usChessSearchPlugin() {
  return {
    name: 'uschess-search',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url || '', 'http://localhost');
        if (req.method !== 'GET' || requestUrl.pathname !== '/mule-chess/api/players') {
          next();
          return;
        }
        const query = (requestUrl.searchParams.get('q') || '').trim().slice(0, 80);
        res.setHeader('Content-Type', 'application/json');
        if (query.length < 2) {
          res.end('[]');
          return;
        }
        try {
          const upstream = await fetch(
            `https://ratings-api.uschess.org/api/v1/members?Fuzzy=${encodeURIComponent(query)}&Size=8`,
            { headers: { Accept: 'application/json', 'User-Agent': 'MuleChess' } }
          );
          if (!upstream.ok) {
            throw new Error(String(upstream.status));
          }
          const page = await upstream.json();
          const players = (page.items || [])
            .map((member) => {
              const regular = (member.ratings || []).find((item) => item.ratingSystem === 'R' && item.rating != null);
              return {
                id: String(member.id || '').trim(),
                firstName: titleName(member.firstName || ''),
                lastName: titleName(member.lastName || ''),
                rating: regular ? String(regular.rating) : '',
                state: String(member.stateRep || '').trim(),
              };
            })
            .filter((player) => player.id)
            .slice(0, 8);
          res.end(JSON.stringify(players));
        } catch {
          res.statusCode = 503;
          res.end(JSON.stringify({ message: 'US Chess search is unavailable.' }));
        }
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  base: '/',
  define: {
    'import.meta.env.VITE_APP_RELEASE': JSON.stringify(command === 'build' ? Date.now().toString() : 'dev'),
  },
  plugins: [
    usChessSearchPlugin(),
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
}));
