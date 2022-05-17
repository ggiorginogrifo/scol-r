const gulp = require('gulp');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
const pipeline = require('readable-stream').pipeline;
const AdmZip = require("adm-zip");
const fs = require('fs')
const convert = require('xml-js');

gulp.task('compress', function () {
    return pipeline(
        gulp.src('lib/*.js'),
        javascriptObfuscator({
            compact: true
        }),
        gulp.dest('dist')
    );
});


exports.createZip = async function createZipArchive() {
    try {
        const path = './'
        let regex = /[.]zip$/
        fs.readdirSync(path)
            .filter(f => regex.test(f))
            .map(f => fs.unlinkSync(path + f))

        const zip = new AdmZip();
        const outputFile = getCourseTitle() + "_" + createDateInHumanReadableWay() + ".zip";
        zip.addLocalFile("index.html");
        zip.addLocalFile("imsmanifest.xml");
        zip.addLocalFolder('dist', './lib');

        zip.writeZip(outputFile);
        console.log(`Created ${outputFile} successfully`);
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
}

function createDateInHumanReadableWay() {
    const date_ob = new Date();
    const day = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();

    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
  return year + "-" + month + "-" + day + " " + hours + "_" + minutes + "_" + seconds
}


function getCourseTitle() {
    const xmlFile = fs.readFileSync('imsmanifest.xml', 'utf8');

    const jsonData = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 2}));
    let courseTitle = jsonData.manifest.organizations.organization.title._text;
    courseTitle = courseTitle.replace('/"<>#%\{\}\|\\\^~\[\]`;\?:@=&/g', '');
    courseTitle = courseTitle.replaceAll(" ", "");
    return courseTitle;
}