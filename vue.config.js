module.exports = {
  pwa: {
    name: 'albumer',
    themeColor: '#b65b6b',
    msTileColor: '#b65b6b',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
  },
};
