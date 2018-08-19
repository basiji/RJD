
var fs = require('fs');
var request = require('request');
var parser = require('fast-html-parser');

var test_url = "https://radiojavan.com/podcasts/podcast/Dubways-95"
var stream  = request(test_url).pipe(fs.createWriteStream('temp.html'));
stream.on('finish',function(){

    var document = fs.readFileSync('temp.html');
    var root = parser.parse(document.toString(), {
        script:true
    });
    
    // Likes, Dislikes, Plays
    var rates = root.querySelectorAll('span.rating');
    var likes = rates[0].childNodes[0].rawText.split(' ')[0];
    var dislikes = rates[1].childNodes[0].rawText.split(' ')[0];
    var plays = root.querySelector('span.number_of_downloads').childNodes[0].rawText.split(' ')[0];
    
    // Download path, size
    var scripts = root.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++){
        if(scripts[i].childNodes[0])
            if(scripts[i].childNodes[0].rawText.includes('RJ.currentMP3Url'))
                var download_path = scripts[i].childNodes[0].rawText.split(';')[0].split('=')[1].split("'")[1] + ".mp3";
    }

    console.log('Likes : ' + likes + "\n Dislikes : " + dislikes + "\n Plays : " + plays + "\n Download : " + download_path);

});