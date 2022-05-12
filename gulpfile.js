const gulp = require('gulp');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const pipeline = require('readable-stream').pipeline;

gulp.task('compress', function () {
    return pipeline(
        gulp.src('lib/*.js'),
        javascriptObfuscator({
            compact: true
        }),
        gulp.dest('dist')
    );
});

function defaultTask(cb) {
    cb();
}

exports.taskName = defaultTask