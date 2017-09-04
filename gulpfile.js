var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

var critical = require('critical').stream;
var gutil = require('gulp-util');

gulp.task('default', ['minifyhtml', 'minifycss', 'minifyjs', 'watch'], function () {
    console.log('Completed execution of Gulp Default');
});

gulp.task('prod', ['minifyhtml', 'minifycss', 'minifyjs'], function () {
    console.log('Completed execution of Gulp Prod');
});

gulp.task('minifyjs', function () {
    return gulp.src('vue/**/*.js')
        .pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('public/dist/js'))
});

gulp.task('minifycss', function () {
    return gulp.src(['public/css/bootstrap.min.css', 'public/css/font-awesome.min.css', 'public/css/reality-icon.css', 'public/css/search.min.css'
        , 'public/css/style.min.css', 'public/css/circle.css', 'public/css/custom.css'])
        .pipe(concat('all.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist/css/'));
});

gulp.task('minifyhtml', function () {
    return gulp.src('views/**/*.ejs')
        .pipe(gutil.env.type === 'prod' ? htmlmin({collapseWhitespace: true}) : gutil.noop())
        .pipe(gulp.dest('public/dist/views'));
});

gulp.task('watch', function () {
    gulp.watch('views/**/*.ejs', ['minifyhtml']);
    gulp.watch('public/css/*.css', ['minifycss']);
    gulp.watch('vue/**/*.js', ['minifyjs']);
});

gulp.task('critical', function () {
    return gulp.src('public/dist/views/critical.html')
        .pipe(critical({base: 'public/', inline: true, css: ['public/css/bootstrap.min.css']}))
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(gulp.dest('public/dist/views/critical-inline.html'));
});
