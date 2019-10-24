import postcss from 'rollup-plugin-postcss';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'HEditor'
  },
  plugins: [
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
