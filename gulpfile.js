var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var cleanCSS = require('gulp-clean-css');


gulp.task('default', ['minifycss'], function () {
    // place code for your default task here
});


gulp.task('minifycss', function() {
    return gulp.src('public/css/custom.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist'));
});
