var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', ['scripts'], function () {
    // place code for your default task here
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(['public/vue/libs/vue.js','public/vue/libs/vue-resource.js','public/vue/libs/vee-validate.js','public/vue/plugins/jwt-plugin.js'])
        .pipe(concat('vue.js'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename('vue.min.js'))
        .pipe(uglify())
        .on('error', function (err) {
            console.log('Error:', err)
        })
        .pipe(gulp.dest('public/dist'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('vue/**/*.js', ['scripts']);
});
