import gulpfile from '@parameter1/gulp/factory.js';

gulpfile({
  entry: 'src/index.js',
  watchPaths: [
    'src/**/*.js',
    '../packages/dataloader/src/**/*.js',
    '../packages/dayjs/src/**/*.js',
    '../packages/mongodb-pagination/src/**/*.js',
    '../packages/repositories/src/**/*.js',
  ],
});
