module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        // Order matters: "@/assets" must be matched before the generic "@".
        alias: { '@/assets': './assets', '@': './src' },
      },
    ],
  ],
};
