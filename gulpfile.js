const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS    = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const sourcemaps   = require('gulp-sourcemaps');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant'); // Подключаем библиотеку для работы с PNG
const htmlmin      = require('gulp-htmlmin');
const concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
const uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS
const del          = require('del'); // Подключаем библиотеку для удаления файлов и папок
const cache       = require('gulp-cache'); // Подключаем библиотеку кеширования

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "src" //Подставить dist когда будет готово для dist
        }
    });

    gulp.watch("src/**/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/assets/sass/**/*.+(scss|sass)")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        /*.pipe(gulp.dest("dist/css"))*/ //Активировать когда будет готово для dist
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('code', function () {
    return gulp.src("src/assets/js/**/*.js")
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function(){
    return gulp.src([
        'src/assets/css/normalize.css',
        'src/assets/css/font.css',
        'node_modules/selectize/dist/css/selectize.default.css',
        'src/assets/css/tooltipster-sideTip-borderless.min.css',
        'src/assets/css/tooltipster.bundle.min.css',
        'src/assets/css/ldbtn.min.css',
        'src/assets/css/loading.min.css',
        //'src/assets/css/animate.css',
        //'src/assets/css/tiltedpage-scroll.css',
        /*'src/css/fontello.css',*/
        /*'src/css/jquery.fancybox.min.css',*/
        //'node_modules/slick-carousel/slick/slick-theme.css',
        //'node_modules/slick-carousel/slick/slick.css',
        //'node_modules/animate.css/animate.css',
        //'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',

    ])
        .pipe(concat('_libs.css'))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.reload({stream: true}))
});

/*Таск для сборки всех библиотек в один файл*/
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'src/assets/js/jquery.min.js',
        'node_modules/selectize/dist/js/standalone/selectize.js',
        'src/assets/js/tooltipster.bundle.min.js',
        'node_modules/jquery-validation/dist/jquery.validate.min.js',
        //'node_modules/card-info/dist/card-info.min.js',
        'src/assets/js/card-info.min.js',
        //'src/assets/js/jquery.validate.min.js',
        //'src/assets/js/jquery.maskedinput.min.js',
        //'src/assets/js/jquery.vide.js',
        //'src/assets/js/jquery.tiltedpage-scroll.min.js',
        //'node_modules/slick-carousel/slick/slick.js', // Берем jQuery
        // Берем Magnific Popup
        //'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
        //'node_modules/jquery.waitforimages/dist/jquery.waitforimages.js',
        //'node_modules/wow.js/dist/wow.js'
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('src/assets/js')) // Выгружаем в папку app/js
        .pipe(browserSync.reload({stream: true}));
});

/*Экспорт*/
gulp.task('clean', async function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('export', function(){

    let buildHtml = gulp.src('src/**/*.html')
        /*.pipe(htmlmin({ collapseWhitespace: true }))*/
        .pipe(gulp.dest('dist'));
    let BuildCss = gulp.src('src/assets/css/**/*.css')
        .pipe(gulp.dest('dist/assets/css'));

    let BuildJs = gulp.src('src/assets/js/**/*.js')
        .pipe(gulp.dest('dist/assets/js'));

    let BuildPhp = gulp.src('src/assets/mailer/**/*.js')
            .pipe(gulp.dest('dist/assets/mailer'));

    let BuildFonts = gulp.src('src/assets/fonts/**/*.*')
        .pipe(gulp.dest('dist/assets/fonts'));

    let BuildImg = gulp.src('src/assets/img/**/*.*')
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/assets/img'));
    let BuildIcons = gulp.src('src/assets/icons/**/*.*')
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/assets/icons'));
    let BuildMailer = gulp.src("src/assets/mailer/**/*")
        .pipe(gulp.dest("dist/assets/mailer"));
    /*let BuildVideo = gulp.src("src/assets/video/!**!/!*")
        .pipe(gulp.dest("dist/assets/video"));*/
    return buildHtml, BuildCss, BuildJs, BuildPhp, BuildFonts, BuildImg, BuildIcons, BuildMailer /*BuildVideo*/;
});


/*gulp.task('mailer', function () {
    return gulp.src("src/mailer/!**!/!*")
        .pipe(gulp.dest("dist/mailer"));
});*/

gulp.task('watch', function() {
    gulp.watch("src/assets/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    /*gulp.watch("src/!*.html").on('change', gulp.parallel('html'));*/
    gulp.watch("src/assets/js/**/*.js", gulp.parallel("code"));
    gulp.watch(['src/assets/js/script.js', 'src/libs/**/*.js'], gulp.parallel('scripts'));
    gulp.watch("src/assets/css/normalize.css", gulp.parallel('css'));
    /*Активировать, если есть библиотеки Jquery и т.д.*/
});


gulp.task('default', gulp.parallel('styles', 'css', 'code', 'server', 'watch',  'scripts' /*'fonts', 'icons', 'mailer', 'html', 'images'*/ /*Активировать когда будет готово для dist*/));
gulp.task('build', gulp.series('clean', gulp.parallel('export')));