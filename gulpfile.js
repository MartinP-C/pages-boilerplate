var gulp = require('gulp'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    cssCompressor = require('gulp-csso'),
    browserSpecificPrefixer = require('gulp-autoprefixer'),
    jsCompressor = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    gulpSequence = require('gulp-sequence');

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10
        }).on('error', sass.logError))
        .pipe(browserSpecificPrefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cssCompressor())
        .pipe(gulp.dest('build/css'));
});

gulp.task('compileJS', function () {
    
    return gulp.src([
        'src/js/**/*.js'
    ])
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(gulp.dest('build/js'));
});

gulp.task('server', function () {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 100,
        open: false,
        server: {
            baseDir: [
                './'
            ]
        }
    });

    gulp.watch('src/scss/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', ['compileJS']).on('change', browserSync.reload);
    gulp.watch('index.html', ['reload']);
    
});

gulp.task('reload', function () {
    browserSync.reload();   
});

gulp.task('serve', gulpSequence([
    'sass',
    'compileJS',
    'server'
]));

gulp.task('build', ['sass', 'compileJS']);