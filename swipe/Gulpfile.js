/*
* @Author: zikong
* @Date:   2015-12-04 20:04:03
* @Last Modified by:   zikong
* @Last Modified time: 2015-12-16 11:29:25
*/

'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('fuck',function(){
    gulp.src('./js/slide.js')
        .pipe( babel() )
        .pipe( uglify() )
        .pipe( rename('slide.min.js') )
        .pipe( gulp.dest('./min/') );
});

gulp.task('watch',function(){
    gulp.watch('./js/slide.js',['fuck']);
});

gulp.task('default',['watch'],function(){
    gulp.start('fuck');
});
