const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const less = require("gulp-less");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const GulpUglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const runsequence = require('gulp-run-sequence');
const connect = require('gulp-connect');
const pngquant=require('imagemin-pngquant');
const cache=require('gulp-cache');

gulp.task('less',()=>{
    return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(autoPrefixer({
      overrideBrowserslist: ['last 2 version'], // 兼容最新的两个版本
      cascade: false
    }))
  //   .pipe(rename({
  //       suffix:'.min'
  //   }))
    .pipe(gulp.dest('dist/css'))    
})
gulp.task('image',()=>{
    return gulp.src('src/images/*.{png,jpg,gif}')
    .pipe(cache(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/images'))
})
gulp.task('html',()=>{
    return gulp.src('src/index.html')
            .pipe(gulp.dest('dist'))
})
gulp.task('server',(done)=>{
    connect.server({
        root:'dist',
        liverreload:true,
        port:9999
    })
    done();
})

gulp.task('watch',(done)=>{
    gulp.watch('src/less/*.less',gulp.series(['less']));
    gulp.watch('src/images/**/*.{jpg,png,gif}',gulp.series(['image']))
    gulp.watch('src/index.html',gulp.series(['html']))
})
gulp.task('build',gulp.series(['less','image','html']))
gulp.task('default',gulp.series(['build','server']))