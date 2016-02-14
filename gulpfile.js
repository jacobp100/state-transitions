'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var sassPath = 'demos/styles';
var sassRoot = sassPath + '/*.scss';

gulp.task('default', ['sass']);
gulp.task('watch', function() {
	gulp.watch(sassPath + '/**', ['sass']);
});

gulp.task('sass', function() {
	return gulp.src(sassRoot)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./demos/resources/'));
});
