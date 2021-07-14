import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'pages', dest: 'pages/' }
      ]
    },
  ],
  plugins: [
    sass({})
  ]
};
