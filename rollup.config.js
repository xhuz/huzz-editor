import postcss from 'rollup-plugin-postcss';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';

import image from 'rollup-plugin-img';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'HEditor',
    sourcemap: true
  },
  plugins: [
    image(),
    postcss({
      extensions: ['.css'],
      plugins: [
        nested(),
        cssnext()
      ]
    })
  ],
  watch: {
    include: 'src/**/*'
  }
}
