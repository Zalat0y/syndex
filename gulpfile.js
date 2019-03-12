//  подключение пакетов

var gulp = require('gulp');

var less = require('gulp-less');

var browserSync = require('browser-sync').create();
// следит за ошибками
var plumber = require('gulp-plumber');
//  дает сигнал об ошибке
var notify = require('gulp-notify');

var autopr = require('gulp-autoprefixer');

// показывает в каком месте ты находишся
var sourcemaps = require('gulp-sourcemaps');

var minify = require('gulp-csso');

var uglify = require('gulp-uglify');

var pump = require('pump');

var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin');

var webp = require('gulp-webp');

//  удадяет файлы
var del = require('del');

var posthtml = require('gulp-posthtml');




// задачи для gulp


// нужно сделать правильную последовательность

/* 1. clean:build
      2. compiel files
          3. run server

gulp.task('clean:build', function() {

	return del('./build/');

});
*/

gulp.task('less', function() {

	return gulp.src('src/less/main.less')
		// следит за ошибками
		.pipe(plumber({
			errorHandler: notify.onError( function(err){
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(less())
		// autoprefixer
		.pipe( autopr ({
			browsers: ['last 7 versions'],
			cascade: false
		}))
		// end
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream())
		// сжимаем и переименовываем файл сss
		.pipe(minify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('src/css'));

});

 gulp.task('server', function() {

     browserSync.init({
     	server: {
     		baseDir: 'src/'
     	}
     });
     gulp.watch('src/*.html').on('change', browserSync.reload);
     gulp.watch('src/less/**/*.less', gulp.parallel('less'));
     gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
     // слежка за всеми файлами
     // gulp.watch('src/**/*.html').on('change', browserSync.reload);
     // gulp.watch('src/js/**/*.js', gulp.parallel('copy:js'));
     // gulp.watch('src/img/**/*.*', gulp.parallel('copy:img'));


 });


   /*  минификацыя изображний */


 gulp.task('imagemin', function() {
     return gulp.src('src/img/**/*.{png,jpg,svg}')
		.pipe(imagemin([
				imagemin.optipng({optimizationLevel: 3}),
				imagemin.jpegtran({progressive: true}),
				imagemin.svgo()
			]))
       .pipe(gulp.dest('build/img/'));
 });

//         js minify

gulp.task('compressjs', function (cb) {
  pump([
        gulp.src('src/js/main.js'),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('src/js')
    ],
    cb
  );
});

// gulp.task('webp', function() {
//     return gulp.src('src/img/**/*.{jpg}')
//     .pipe(webp({quality: 90}))
//     .pipe(gulp.dest('build/img/'));
// });


   /*  Копирование файлов  */

gulp.task('copy', function() {
    return gulp.src([
    		'src/img/**',
				'src/css/main.css',
    		'src/css/main.min.css',
				'src/js/main.js',
    		'src/js/main.min.js',
    		'src/**.html'
    	], {
    		base:'src'
    	})
    .pipe(gulp.dest('build'));
});


    /*  compil html svg */

// gulp.task('html', function() {
//     return gulp.src('src/*.html')
//     .pipe(posthtml())
//     .pipe(gulp.dest('build'));
// });

     /*  удаление файлов*/

gulp.task('clean', function() {
    return del ('build')
});



                 /* build project*/


gulp.task('build', gulp.series('clean', 'compressjs', 'copy', 'imagemin'));


       		  /* Start code */

gulp.task('default', gulp.parallel('less', 'server'));
