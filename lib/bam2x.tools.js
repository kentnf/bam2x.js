var bam2x = bam2x || {};
bam2x.tools = bam2x.tools ||{};
(function(B,T){
T.httpGet = function(url) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
T.getCircosDemo=function() {
    function random_generator(a,b,c)
{
    var data={};
    a = typeof a !== 'undefined' ? a : 5;
    b = typeof b !== 'undefined' ? b : 2;
    c = typeof c !== 'undefined' ? c : 20;
    data.ideograms=[];;
    data.links=[];
    data.plottracks=[];
    data.config={};
    if (a>10) {a=10};
    for (var i=0;i<a;i++)
    {
        data.ideograms.push({"id":"chr"+(i+1),"length":Math.floor((Math.random() * 75) + 25),"color":colors(i)})
    }
    data.tracks=[];
    for(var i=0;i<b;i++)
    {
        data.tracks.push(random_track(data.ideograms,"rnd_track_"+i))
    }
    links=[]
    for(var i=0;i<c;i++) {

        links.push(random_link(data.ideograms))
    }
    data.tracks.push({"type":"links","name":"test_link","values":links});
    data.config["outerRadius"]=Math.floor(Math.random()*75)+b*50+50;
    return data;
}
function random_track(ideograms,name)
{
    var track={};
    track.name=name
    track.type="plot"
    track.values=[];
    for(key in ideograms){
        values=[]
        for(var i=0;i<ideograms[key].length;i++){
            values.push(Math.random()*10);
            }
         track.values.push({"chr":ideograms[key].id,"values":values,"color":colors(Math.floor(Math.random()*10))})   
    }
    return track;
}

function random_link(ideograms){
    var a=Math.floor(Math.random()*ideograms.length)
    var b=Math.floor(Math.random()*ideograms.length)
    var size_a=Math.floor(Math.random()*10)+2
    var start_a=Math.floor(Math.random()*(ideograms[a].length-size_a))
    var size_b=Math.floor(Math.random()*10)+2
    var start_b=Math.floor(Math.random()*(ideograms[b].length-size_a))
    var link={}
    link.source={"chr":ideograms[a].id,"start":start_a,"end":start_a+size_a}
    link.target={"chr":ideograms[b].id,"start":start_b,"end":start_b+size_b}
    link.color=colors(Math.floor(Math.random()*10))
    return link;
}
    
    var a=Math.floor(Math.random()*10)+2;
    var b=Math.floor(Math.random()*3)+1;
    var c=Math.floor(Math.random()*20)+20;
    
 return random_generator(a,b,c);

}

}(bam2x,bam2x.tools))

