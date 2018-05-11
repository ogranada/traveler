
const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('gulp-better-rollup');
const rollup_babel = require('rollup-plugin-babel');
const sass = require('gulp-sass');

const SCRIPTS_BE = ['src/backend/**/*.js', '!src/backend/**/_*.js'];
const SCRIPTS_FE = ['src/frontend/**/*.js', '!src/frontend/**/_*.js', '!src/frontend/**/_*.min.js'];
const STYLES_SCSS = ['src/frontend/**/*.scss', '!src/frontend/**/_*.scss'];
const COPY_FILES = ['src/frontend/**/*.{css,ttf,otf,woff,woff2,svg,wot,jpg,png}'];
const MARKUP = 'src/**/*.html';

gulp.task('build-scripts-be', function buildScripts() {
  return gulp.src(SCRIPTS_BE)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('build-scripts', function buildScripts() {
  return gulp.src('src/frontend/scripts/main.js')
    .pipe(rollup({
      plugins: [
        rollup_babel()]
    }, 'umd'))
    .pipe(gulp.dest('build/static/scripts'));
});

gulp.task('build-styles', function buildScripts() {
  return gulp.src(STYLES_SCSS)
    .pipe(sass())
    .pipe(gulp.dest('build/static'));
});

gulp.task('build-markup', function buildScripts() {
  return gulp.src(MARKUP)
    .pipe(gulp.dest('build'));
});

gulp.task('copy-files', function buildScripts() {
  return gulp.src(COPY_FILES)
    .pipe(gulp.dest('build/static'));
});

gulp.task('build-all', gulp.parallel('build-scripts',
  'build-scripts-be',
  'build-scripts',
  'build-styles',
  'build-markup',
  'copy-files'));

gulp.task('watch', function watch(done) {
  gulp.watch(SCRIPTS_BE[0], gulp.series('build-scripts-be'));
  gulp.watch(SCRIPTS_FE[0], gulp.series('build-scripts'));
  gulp.watch(STYLES_SCSS[0], gulp.series('build-styles'));
  gulp.watch(MARKUP, gulp.series('build-markup'));
  gulp.watch(COPY_FILES, gulp.series('copy-files'));
  done();
});

gulp.task('default', gulp.series('build-all', 'watch'));
