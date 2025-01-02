module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Use the correct preset
    plugins: [], // Remove "expo-router/babel" from plugins
  };
};
