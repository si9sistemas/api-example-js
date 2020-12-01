"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
// const concat = require('gulp-concat');
const terser = require('gulp-terser');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Si9 Leads - By: Vinícius Magnabosco'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./src"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./src/vendor/"]);
}

function modules() {
  var bootstrap = gulp.src('./node_modules/bootstrap/**/*')
      .pipe(gulp.dest('./src/vendor/bootstrap'));

  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
      .pipe(gulp.dest('./src/vendor/jquery-easing'));

  var jquery = gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
      .pipe(gulp.dest('./src/vendor/jquery'));

  return merge(bootstrap, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./src/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./src/css"))
    .pipe(browsersync.stream());
}

function jsTaskCoreLeads() {
  return gulp
      .src('./src/js/core-leads.js')
      .pipe(rename('core-leads.min.js'))
      .pipe(terser())
      .pipe(gulp.dest('./src/js'))
      .pipe(browsersync.stream());
}

function jsTaskLeadsSi9() {
  return gulp
      .src('./src/js/new-lead.js')
      .pipe(rename('new-lead.min.js'))
      .pipe(terser())
      .pipe(gulp.dest('./src/js'))
      .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./src/scss/**/*", css);

  gulp.watch("./src/js/core-leads.js", jsTaskCoreLeads);
  gulp.watch("./src/js/new-lead.js", jsTaskLeadsSi9);

  gulp.watch("./src/**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);

const build = gulp.series(vendor, css, jsTaskCoreLeads, jsTaskLeadsSi9);

const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
