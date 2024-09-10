import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts', // Main entry point for your library
  output: [
    {
      file: 'dist/excelsior.esm.js', // Output for bundling ESM (ES6 modules)
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/excelsior.cjs.js', // Output for bundling CommonJS (Node.js)
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/excelsior.js', // Default entry point
      format: 'umd',
      name: 'excelsior',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
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
      minimize: true, // ...and minify it
    }),
  ],
  external: ['lit'], // Exclude Lit from the bundle since it's an external dependency
};
