var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename');

gulp.task('sass', function() {
    return gulp.src('./sass/**/*.sass')
        .pipe(sass({ outputStyle: 'expanded' })) //nested, expanded, compact, compressed
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove: true
        }))
        .pipe(cleanCSS())
        .pipe(rename(function(path){
            path.basename += '.min';
            path.extname = '.css';
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('default', ['sass']);
