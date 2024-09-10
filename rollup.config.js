import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';  

// Banner to put at the top of our generated files
const banner = `
  /**
   * 
   * ░█▀▀▀ ▀▄░▄▀ ░█▀▀█ ░█▀▀▀ ░█─── ░█▀▀▀█ ▀█▀ ░█▀▀▀█ ░█▀▀█ 
   * ░█▀▀▀ ─░█── ░█─── ░█▀▀▀ ░█─── ─▀▀▀▄▄ ░█─ ░█──░█ ░█▄▄▀ 
   * ░█▄▄▄ ▄▀░▀▄ ░█▄▄█ ░█▄▄▄ ░█▄▄█ ░█▄▄▄█ ▄█▄ ░█▄▄▄█ ░█─░█
   * 
   * Part of New York State's Excelsior Design System (v0.0.1)
   * (c) ${new Date().getFullYear()} New York State Design System Team
   * Description: A design system for New York State's digital products.
   * Repository: https://github.com/its-hcd/excelsior
   * License: MIT
   */
`;

// Plugin config to use in all builds
const plugins = [
  typescript({
    tsconfig: './tsconfig.base.json',
  }),

  // Resolve plugin: Helps Rollup find external dependencies
  resolve({
    extensions: ['.mjs', '.js', '.json', '.ts'],
  }),

  // Summary plugin: Show bundle size after building
  summary(),

  // Replace plugin: Swap environment variables (good for prod/dev builds)
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    preventAssignment: true,
  }),

  // PostCSS plugin: Extract and minify CSS within components
  postcss({
    extract: true, // Extract CSS into separate file
    minimize: true, // ... and minify the CSS
  }),
];

// Main Rollup config with different outputs
export default [
  // ESM Build (for modern browsers)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/excelsior.esm.js',
      format: 'es',
      sourcemap: true,
      banner
    },
    plugins: [
      del({ targets: 'dist/*', runOnce: true }),  // Clean up the `dist` folder before the first build
      ...plugins,
    ],
    external: ['lit'],  // Don't include Lit in the ESM build
  },

  // CJS Build (for Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/excelsior.cjs.js',
      format: 'cjs',
      sourcemap: true,
      banner
    },
    plugins,
    external: ['lit'],  // Don't include Lit in the CJS build
  },

  // UMD Build (for older/legacy browsers)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/excelsior.js',
      format: 'umd',
      name: 'excelsior',
      sourcemap: true,
      banner,
      globals: {
        lit: 'Lit',  // Map Lit to the global 'Lit' object for UMD builds
      },
    },
    plugins,
    external: [],  // Include lit in the UMD build
  }
];