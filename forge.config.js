// for some reason using forge.config.ts doesn't work,
//
// it says:
//   Failed to load: /Users/jbilcke/Projects/clapper/forge.config.ts
//   An unhandled rejection has occurred inside Forge:
//   SyntaxError: Unexpected token 'export'
//
// so we cannot use this:
// import type { ForgeConfig } from '@electron-forge/shared-types';
// export const config: ForgeConfig = {
module.exports = {
  packagerConfig: {
    name: "Clapper",
    asar: true,
    icon: "./public/images/logos/CL.png",
    osxSign: {},

    // One or more files to be copied directly into the app's
    // Contents/Resources directory for macOS target platforms
    // and the resources directory for other target platforms.
    // The resources directory can be referenced in the packaged
    // app via the process.resourcesPath value.
    extraResource: [
      ".next/standalone"
    ],
    // ignore: ['^\\/public$', '^\\/node_modules$', '^\\/src$', '^\\/[.].+'],
    
    // Walks the node_modules dependency tree to remove all of
    // the packages specified in the devDependencies section of
    // package.json from the outputted Electron app.
    prune: true,

    ignore: [
      '^\\/.next$',
      '^\\/src$',
      '^\\/documentation$',
      '^\\/test-results$',
      '^\\/playwright-report$',
      '^\\/.github$',
      '^\\/public$',
      '^\\/out$',
      '^\\/tests$',
      '^\\/Dockerfile$',
      '^\\/package-lock.json$',
      '^\\/.git$',
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: "Clapper contributors"
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './public/images/logos/CL.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        options: {
          icon: './public/images/logos/CL.icns'
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

