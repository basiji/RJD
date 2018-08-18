var fs = require('fs');
var parser = require('fast-html-parser');
var request = require('request');
var dubways_all_url = 'https://www.radiojavan.com/podcasts/browse/show/Dubways';
var dubways_95_url = 'https://www.radiojavan.com/podcasts/podcast/Dubways-95'
/* Receive html from url 
request(url, function (error, response, body){
    console.log(response.statusCode);
});*/

var stream  = request(dubways_all_url).pipe(fs.createWriteStream('temp.html'));
stream.on('finish',function(){
    var document = fs.readFileSync('temp.html');
    var root = parser.parse(document.toString());
    var blocks = root.querySelectorAll("a.block_container");
    var block;
    for (var i = 0; i < blocks.length; i++) {
    block = blocks[i];
    console.log("Title : " + block.childNodes[3].childNodes[1].childNodes[0].rawText);
    console.log("Episode : " + block.childNodes[3].childNodes[3].childNodes[0].rawText.split(' ')[1]);
    console.log("Thumbnail : " + block.childNodes[1].childNodes[1].rawAttrs.split('"')[1]);
    console.log("Podcast link : " + block.rawAttrs.split('"')[1]);
    } 
});


// Extract audio from episode page
var getPodcastAudio = function (url, htmlname){
    var stream  = request(url).pipe(fs.createWriteStream(htmlname));
    stream.on('finish', function (){
        var document = fs.readFileSync(htmlname);
        var root = parser.parse(document.toString(), {
        script:true
        });
        var block = root.querySelectorAll('script')[9];
        console.log("Audio url : " + block.childNodes[0].rawText.split('=')[1].split("'")[1] + ".mp3" + "\n");
        //fs.unlink(htmlname, function(){
            
        //});
    });
}



