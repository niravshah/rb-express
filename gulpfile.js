var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

var critical = require('critical').stream;
var gutil = require('gulp-util');



gulp.task('default', ['minifyhtml', 'minifycss', 'minifyjs', 'watch'], function () {
    // place code for your default task here
});

gulp.task('minifyjs', function () {
    return gulp.src('vue/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js'))
});

gulp.task('minifycss', function () {
    return gulp.src('public/css/custom.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('minifyhtml', function () {
    return gulp.src('views/**/*.ejs')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public/dist/views'));
});

gulp.task('watch', function () {
    gulp.watch('views/**/*.ejs', ['minifyhtml']);
    gulp.watch('public/css/custom.css', ['minifycss']);
    gulp.watch('public/vue/**/*.js', ['minifyjs']);
});

gulp.task('critical', function () {
    return gulp.src('public/dist/views/critical.html')
        .pipe(critical({base: 'public/', inline: true,css: ['public/css/bootstrap.min.css']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(gulp.dest('public/dist/views/critical-inline.html'));
});
