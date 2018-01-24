const gulp = require('gulp');
const bump = require('gulp-bump');
const babel = require('gulp-babel');
const git = require('gulp-git');
const fs = require('fs');
const semver = require('semver');

// read configuration from package.json
var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};


gulp.task('default', defaultTask);

function defaultTask(done) {
  // place code for your default task here
  done();
}

// Babel
gulp.task('babel', () =>
    gulp.src('src/**/*.js')
        .pipe(babel({}))
        .pipe(gulp.dest('dist'))
);


// Run git add
// src is the file(s) to add (or ./*)
gulp.task('add', function(){
  return gulp.src('./')
    .pipe(git.add({args: '-A --ignore-errors'}));
});

// Run git commit without checking for a message using raw arguments
gulp.task('commit', function(){
  return gulp.src('./')
    .pipe(git.commit(undefined, {
      args: '--all -m "minor update"',
      disableMessageRequirement: true
    }));
});

// Run git push
// branch is the current branch & remote branch to push to
gulp.task('push', function(){
  git.push('origin', function (err) {
    if (err) throw err;
  });
});


// Bump version 'minor and update package.json:
gulp.task('bump-minor', function(){
  return gulp.src(['./package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

// Bump version 'patch' and update package.json:
gulp.task('bump-patch', function(){
  return gulp.src(['./package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});


gulp.task('update-npm', gulp.series('bump-patch', 'babel', 'add', 'commit', 'push'));
