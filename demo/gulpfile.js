'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var sassPath = 'sass/app.scss';

gulp.task('default', ['sass']);
gulp.task('watch', function() {
	gulp.watch(sassPath, ['sass']);
});

gulp.task('sass', function() {
	return gulp.src(sassPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./'));
});
