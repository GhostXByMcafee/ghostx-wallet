module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-encrypted-storage': './src/mocks/react-native-encrypted-storage.ts'
          },
        },
      ],
    ],
  };
}; 