var bam2x= bam2x ||{};
bam2x.lincos = bam2x.lincos ||{};
(function(L,C) {
   function default_model()
    {
      return (function(options){
      for (var key in options)
      {
        this[key]=options[key];
      }});
    }
    
   
    L.IdeogramView=default_model();
    L.IdeogramView.prototype = {
      render: function(text,ticks){
               var ideogram=this.el;
               if(this.track_name)
                   {
               ideogram.attr("class",this.track_name);
                   };
               if(this.model.id)
               {
               ideogram.attr("id",this.model.id);
               };
               var self=this;
               //ideogram.attr("transform","translate("+this.x+","+this.y+")");
               ideogram.selectAll("rect").data([self]).enter().append("rect")
               .attr("x",function(d) {return d.x})
               .attr("y",function(d) {return d.y})
               .attr("height",function(d) {return d.height})
               .attr("width",function(d) {return d.width})
               .attr("fill",function(d) {return d.color})
               .attr("opacity",0.7)
               .on("mouseover",function(d,i) {d3.select(this).attr("opacity",1.0)})
               .on("mouseout",function(d,i) {d3.select(this).attr("opacity",0.7)})
               .append("title").text(function(d) { return self.model.id })
               if (text) {
                   text = ideogram.append("text").attr("class","chr-name");
                   text.attr("transform","translate("+self.x+","+(self.y-10)+")").attr("x",5).text(self.model.id);
               }
               if (ticks) {
              //TODO
               }
           },
      translateBed: function(start,end) { //bed format [start,end) 0 index
               var self=this;
               var k=(self.width/self.model.length);
               return [self.x+k*start,k*(end-start)]  //return x,width
           }
    };
    L.IdeogramTrack=default_model();
    L.IdeogramTrack.prototype = {
    totalLength: function()
    {
        var s=0;
        this.collection.forEach(function(i)
        {
             s+=i.length;
        });
        return s;
    },
      render: function(text,ticks)
           {
               this.ideogramViews={};
               var offsetx=this.x;
               var totalLength=this.totalLength();
               var totalGaps=this.collection.length-1;
               var gap=this.gap;
               var totalWidth=this.width-gap*totalGaps;
               var startx=offsetx;
               var self=this;
               this.collection.forEach(function(d,i) {
                   var width=d.length/totalLength*totalWidth;
                   var color=self.color
                   if (d.color) {color=d.color}
                   var ideogramView = new L.IdeogramView({"model":d,"x":startx,"y":self.y,"height":self.height,"width": width,"color":color,"el":self.el.append("g")} )
                   ideogramView.render(text,ticks);
                   startx=startx+width+gap;
                   self.ideogramViews[d.id]=ideogramView
               })
           },
           
           translateBed: function(id,start,end) //bed format [start,end) 0 index
           {
               return this.ideogramViews[id].translateBed(start,end);
               
           }
    };
    L.BedTrack=default_model();
    L.BedTrack.prototype = {
      render: function(coordinates)
           {   var self=this;
               this.collection.forEach(function(i)
                       {
                            var xw=coordinates.translateBed(i.chr,i.start,i.end);
                            var x=xw[0]
                            var width=xw[1]
                            var color=self.color
                            if (i.color) {color=i.color}
                            var ideogramView = new L.IdeogramView({"y":self.y,"x":x,"width":width,"height":self.height,"model":i,"el":self.el.append("g").attr("id",i.id),"color":color});
                            ideogramView.render(false,false);
                            self.bedViews[i.id]=ideogramView;
                       });
       },
    };
    L.PlotView=default_model();
    L.PlotView.prototype = {
      render: function(){
    var self=this;
    self.yMax = self.yMax || Math.max.apply(Math,this.model.values);
    self.yMin = self.yMin || Math.min.apply(Math,this.model.values);
    var len=self.model.length();
    var bars=this.el.selectAll("rect").data(this.model.values).enter().append("rect");
    var x=self.x;
    var width=self.width;
    var k=width/len;
    bars.attr("fill",self.model.color)
    .attr("x",function(d,i) {return x+k*i})
    .attr("y",function(d,i) { if (d<0) {return self.y} else {return self.y - d/self.yMax*self.height}})
    .attr("height",function(d,i){
        return Math.abs(d)/self.yMax*self.height;
        })
    .attr("width",function(d,i) {return k})
    .attr("opacity",0.7)
    .on("mouseover",function(d,i) {d3.select(this).attr("opacity",1.0)})
    .on("mouseout",function(d,i) {d3.select(this).attr("opacity",0.7)})
    .append("title").text(function(d,i) { return self.model.chr+"\npos:"+(i+1)+"\nvalue:"+d });
        
      }
    };
    L.PlotTrack=default_model();
    L.PlotTrack.prototype = {
      
      render: function(coordinates,name){
          var yMins=[];
          var yMaxs=[];
              for ( var key in this.collection){
                  yMins.push(Math.min.apply(Math,this.collection[key].values));
                  yMaxs.push(Math.max.apply(Math,this.collection[key].values));
                 }
          this.yMin=Math.min.apply(Math,yMins);
          this.yMax=Math.max.apply(Math,yMaxs);
          this.el.attr("class","plot");
          var self=this;
          if(name !== 'undefined' && name){
            text = self.el.append("g").append("text");
            text.attr("transform","translate("+self.x+","+(self.y-3)+")").attr("x",5).text(self.name);
          }
          this.collection.forEach(function(i)
                       {
                            var xw=coordinates.translateBed(i.chr,0,i.length());
                            var x=xw[0];
                            var width=xw[1];
                            var model=self.el.append("g").attr("id",i.chr+"_"+i.id);
                            var plotView = new L.PlotView({"height":self.height,"x":x,"y":self.y,"width":width,"model":i,"el":self.el.append("g"),"yMin":self.yMin,"yMax":self.yMax});
                            plotView.render();
                       });
            }

        
    };
    
    L.BedGraphTrack=default_model();
    L.BedGraphTrack.prototype={
      max: function(){
            var max=+this.collection[0].value;
            for (var v in this.collection)
                {
                 if (max < +this.collection[v].value) {max=+this.collection[v].value;}
                }
            return max;
        },
        min: function(){
            var min=this.collection[0].value;
            for (var v in this.collection)
                {
                 if (min > +this.collection[v].value) {min=+this.collection[v].value;}
                }
            return min;
     
        } ,
      render: function(coordinates) {
        var self=this;
        var bars=this.el.selectAll("rect").data(this.collection).enter().append("rect");
        this.el.attr("class","bedgraph");
        //this.el.attr("transform","translate("+this.cx+","+this.cy+")");
        this.yMin=this.yMin || this.min()
        this.yMax=this.yMax || this.max()
        
        if (this.yMin > 0) {this.yMin=0}
        bars.attr("x", function(d,i) {
                       return coordinates.translateBed(d.chr,d.start,d.end)[0];
                    })
                .attr("width", function(d,i) {
                       return coordinates.translateBed(d.chr,d.start,d.end)[1];
                    })
                .attr("fill",function(d,i) { if (d.color) {return d.color} else {return self.color}} )
                .attr("height",function(d,i) { return self.translateToHeight(d.value)})
                .attr("y",function(d,i) {
                        if(d.value >= 0 ){
                            return self.height + self.y - self.translateToHeight(d.value-self.yMin)}
                        if(d.value < 0 ) {
                            return self.height + self.y - self.translateToHeight(0-self.yMin)}
                        }
                    );
         bars.style("opacity",0.5)
                .on("mouseover",function(d) {
                            d3.select(this).style("opacity",1.0);
                            })
                .on("mouseout",function() {
                    d3.select(this).style("opacity",0.5);
                    })
                .append("title").text( function(d,i) { return d.chr + ":" + (+d.start+1) + "-" + d.end + "\n value:" + d.value });
    },

    translateToHeight: function(value)
    {
        return Math.abs(value)/(this.yMax-this.yMin)*(this.height);
    }
    };
    
    
    
    L.plot_json = function(data,el_id) {
      d3.select("#"+el_id).text("");
      var plotHeight=30;
      var bedHeight=10;
      //var cx = outerRadius + 30;
      //var cy = document.getElementById('canvas').clientHeight/2
      var width = document.getElementById(el_id).clientWidth-50;
     
      var gapHeight= 5
      var nowY = 20;
      var svg = d3.select("#"+el_id).attr("align","center").append("svg").attr("id","svg").attr("align","center");
      svg.attr("width",width+50);
      svg.attr("height",document.getElementById(el_id).clientHeight)
     
     
      var ideograms = []
      for (var i in data.ideograms){
          ideograms.push(new C.IdeogramModel(data.ideograms[i]))
      }
    
      var ideogramView = new L.IdeogramView({});
      var ideogramTrack = new L.IdeogramTrack({"y":nowY,"collection":ideograms,"el":svg.append("g"),"x":25,"width":width,"height":bedHeight,"gap":20});
     ideogramTrack.render(true,true);
     
     nowY=nowY+bedHeight+gapHeight+plotHeight;
     for( var i in data.tracks)
     {
     track=data.tracks[i];
     var plots=[];
     if (track.type=="plot")
     {
     for( var j in track.values)
     {
         var model=new C.PlotModel(track.values[j]);
         if (track.color)
         {
             model.color=track.color
         }
         plots.push(model);

     }
      var plotsCollection= plots;
      var plotTrack = new L.PlotTrack({"collection":plotsCollection,"el":svg.append("g"),"y":nowY,"height":plotHeight});
      plotTrack.render(ideogramTrack);
      nowY+=plotHeight+gapHeight
    }
    if (track.type=="bed")
    {
        var collection= new BedsCollection()
        collection.add(track.values)
        var color="black"
        if (track.color) { color=track.color}
        var bedTrack = new L.BedTrack({"collection":collection,"el":svg.append("g"),"y":nowY,"color":color,height:bedHeight});
        bedTrack.render(ideogramTrack);
        nowY+=bedHeight+gapHeight
    }
    if (track.type=="bedgraph")
    {
        var collection= []
        collection.push(track.values)
        var color="black"
        if (track.color) { color=track.color}
        var bgTrack = new L.BedGraphTrack({"collection":collection,"el":svg.append("g"),"y":nowY,"color":color,height:plotHeight});
        bgTrack.render(ideogramTrack);
        nowY+=plotHeight+gapHeight
    }
    }
 
}
    
    
  
}(bam2x.lincos,bam2x.circos))