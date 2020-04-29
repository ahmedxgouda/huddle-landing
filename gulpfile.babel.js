// jshint esversion: 6
// Declaring
import {watch, parallel, src, dest, series} from 'gulp';
import sass, {logError} from 'gulp-sass';
import {init} from 'browser-sync';
import del from 'del';
import imagemin from 'gulp-imagemin';
import uglify from 'gulp-uglify';
import cleanCss from 'gulp-clean-css';
import usemin from 'gulp-usemin';
import htmlmin from 'gulp-htmlmin';
import rev from 'gulp-rev';
import flatmap from 'gulp-flatmap';
// functions
function css() {
    return src('./css/*.scss')
        .pipe(sass().on('error', logError))
        .pipe(dest('./css'));
}
function sass_watch(done) {
    watch('./css/*.scss', css);
    done();
}
function browser_sync(done) {
    var files = [
        './*.html',
        './css/*.css',
        './js/*.js',
        './img/*.{png,jpg,gif}',
        './svg/*.svg'
    ];
    init(files, {
        server: {
            baseDir: './'
        }
    });
    done();
}
function clean() {
    return del(['dist']);
}
function copy_fonts(done) {
    src('./node_modules/font-awesome/fonts/**/*.*')
    .pipe(dest('./dist/fonts'));
    done();
}
function image_min() {
    return src('./img/*.{png,jpg,gif,ico}')
        .pipe(imagemin(
            { optimizationLevel: 3, progressive: true, interlaced: true }
        ))
        .pipe(dest('dist/img'));
}
function svg_min() {
    return src('./svg/*.svg')
        .pipe(imagemin(
            { optimizationLevel: 3, progressive: true, interlaced: true }
        ))
        .pipe(dest('dist/svg'));
}
function use_min() {
    return src('./*.html')
    .pipe(flatmap((stream, file) => {
        return stream
        .pipe(usemin({
            css: [cleanCss(), rev()],
            html: [() => { return htmlmin({ collapseWhitespace: true }); }],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
        }));
    }))
    .pipe(dest('./dist'));    
}
// Exports Commands
const _sass = css;
export {_sass as sass};
const _sass_watch = sass_watch;
export {_sass_watch as sass_watch};
const _browser_sync = browser_sync;
export {_browser_sync as browser_sync};
const _clean = clean;
export {_clean as clean};
const _copyfonts = copy_fonts;
export {_copyfonts as copyfonts};
const _imagemin = image_min;
export {_imagemin as imagemin};
const _usemin = use_min;
export {_usemin as usemin};
const build = series(clean, copy_fonts, image_min, svg_min, use_min);
export {build as build};
const _default = parallel(browser_sync, sass_watch);
export {_default as default};