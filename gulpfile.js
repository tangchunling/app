/**
 * 速店助手微信小程序 gulpfile
 * @version 0.0.1
 * @author Jerry <superzcj_001@163.com>
 * @date 2017-05-25
 * @copyright 2017
 */
'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
const rename = require('gulp-rename');

gulp.task('less', function(){
	return gulp.src([ 'src/less/**/*.less', '!src/less/base/*.less' ])
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ],
			plugins: [ autoprefix ],
		}))
		.pipe(rename({
			extname: '.wxss',
		}))
		.pipe(gulp.dest('dist/wxss'));
});

gulp.task('watch', function(){
	const watcher = gulp.watch([ 'src/less/**/*.less' ]);
	watcher.on('change', function(event){
		gulp.start('less');
	});
});

gulp.task('default', [ 'watch' ]);