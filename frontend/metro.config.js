const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    assetPlugins: ['expo-asset/tools'],
    ...defaultConfig.transformer,
  },
};
