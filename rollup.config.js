import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts', // Main entry point for your library
  output: [
    {
      file: 'dist/bundle.esm.js', // ESM (ES Module) output
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.cjs.js', // CommonJS output
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.umd.js', // UMD (Universal Module Definition) output
      format: 'umd',
      name: 'excelsior', // Change this to the global variable name for UMD builds
      sourcemap: true,
    }
  ],
  plugins: [
    // TypeScript plugin: Transpile .ts files
    typescript({
      tsconfig: './tsconfig.json',
    }),

    // Resolve plugin: Helps Rollup find external dependencies
    resolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),

    // Terser plugin: Minify the output
    terser(),

    // Summary plugin: Show bundle size after building
    summary(),

    // Replace plugin: Swap environment variables (good for prod/dev builds)
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      preventAssignment: true, // Important to add this in Rollup 2+
    }),

    // PostCSS plugin: Extract and minify CSS within components
    postcss({
      extract: true, // Extract CSS into separate file
      minimize: true, // ...and minifies it
    }),
  ],
  external: ['lit'], // Exclude Lit from the bundle since it's an external dependency
};
