module.exports = {
  entries: ['src/App.jsx'],
  outDir: 'dist',
  publicUrl: './',
  sourceMaps: true,
  autoInstall: true,
  optimizers: {
    '*.js': ['@parcel/optimizer-terser']
  }
};