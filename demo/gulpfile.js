'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var importOnce = require('node-sass-import-once');
var autoprefixer = require('gulp-autoprefixer');

var sassPath = 'sass';
var sassRoot = sassPath + '/app.scss'

gulp.task('default', ['sass']);
gulp.task('watch', function() {
	gulp.watch(sassPath + '/**', ['sass']);
});

gulp.task('sass', function() {
	return gulp.src(sassRoot)
		.pipe(sass({
			importer: importOnce,
			importOnce: {
				index: false,
				css: false,
				bower: false
			}
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./'));
});
