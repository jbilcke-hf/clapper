module.exports = {
  packagerConfig: {
    asar: false, // true,
    icon: "./public/icon",
    osxSign: {}
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './public/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        options: {
          icon: './public/icon.icns'
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    /*
    Only needed if asar is set to true
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    */
  ],
};
