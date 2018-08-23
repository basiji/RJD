var fs = require('fs');
var request = require('request');
var parser = require('fast-html-parser');
//var stream  = request('https://www.radiojavan.com/podcasts/podcast/Dynatomix-30').pipe(fs.createWriteStream('test.html'));

  /*  stream.on('finish',function(){
    var document = fs.readFileSync('test.html');;
    var root = parser.parse(document.toString(), {
        script:true
    });*/

    var document = fs.readFileSync('test.html');;
    var root = parser.parse(document.toString(), {
        script:true
    });

    // Thumbnail, Likes, Dislikes, Plays
    var block = root.querySelectorAll('div.block_container');
    console.log(block[0].childNodes[1].rawAttrs.split("=")[2].split('"')[1])

    //});