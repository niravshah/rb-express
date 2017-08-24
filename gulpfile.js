var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');


var cleanCSS = require('gulp-clean-css');


gulp.task('default', ['minifyhtml','minifycss'], function () {
    // place code for your default task here
});


gulp.task('minifycss', function() {
    return gulp.src('public/css/custom.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('minifyhtml', function() {
    return gulp.src('views/**/*.ejs')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('views/dist'));
});
