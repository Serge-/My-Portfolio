var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglifyjs'),
        concat = require('gulp-concat');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname));
  app.listen(4000);
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('styles', function() {
      return gulp.src('sass/*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'libs/magnific-popup/dist/jquery.magnific-popup.min.js','libs/WOW/dist/wow.min.js','libs/fakeLoader/fakeLoader.min.js'
  ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('js'));
});

gulp.task('css', function() {
  return gulp.src(['node_modules/animate.css/animate.min.css',
    'node_modules/magnific-popup/dist/magnific-popup.css'])
      .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch(['*.html', "portfolio/*.html"], notifyLiveReload);
  gulp.watch('js/*.js', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch', 'css', 'scripts'], function() {

});
