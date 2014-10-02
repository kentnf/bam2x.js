var bam2x=bam2x || {};

(function(B) {
B.MafView= function(options) {
  for (var key in options){
        this[key]=options[key];
  }
}
B.MafView.prototype = {
    render: function(){
      this.el.selectAll("*").remove();
      var d=this.model.maf
      var self=this
      this.ctrl=this.el.append("div")
      this.svg=this.el.append("div").append("svg")
      this.svg.attr("height",self.height).attr("width",self.width);
      this.ctrl.append("h3").text(self.name+" Alignment , Score:"+d.score)
      this.ctrl.append("input").attr("class","button").attr("type","button").attr("value","zoom to selected region").on("click", function()
      {
          self.model.axis1.start=Math.round(brush.extent()[0])
          self.model.axis1.end=Math.round(brush.extent()[1])
          var new_start=self.model.axis2.end
          var new_end=self.model.axis2.start
          self.model.maf.blocks.forEach(
          function(d) {
              if(d[0][1]<self.model.axis1.end && d[0][2] > self.model.axis1.start)
               {
                   if (new_start > d[1][1]) {new_start=d[1][1]}
                   if (new_end < d[1][2]) {new_end=d[1][2]}
                  
               }
              }
          )
          self.model.axis2.start=new_start
          self.model.axis2.end=new_end
          self.render()
      });

     this.ctrl.append("input").attr("class","button").attr("type","button").attr("value","reset to original region").on("click", function()
      {
          self.model.axis1.start=self.model.maf.srcs[0][1]
          self.model.axis1.end=self.model.maf.srcs[0][2]
          self.model.axis2.start=self.model.maf.srcs[1][1]
          self.model.axis2.end=self.model.maf.srcs[1][2]
          self.render()
      });
    
    this.ctrl.append("input").attr("class","button").attr("type","button").attr("value","open first region in ucsc").on("click",function()
    {
      var URL="http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position="+self.model.axis1.chr+"%3A"+self.model.axis1.start+"-"+self.model.axis1.end;
      window.open(URL, '_blank');
    });
      this.ctrl.append("input").attr("class","button").attr("type","button").attr("value","open second region in ucsc").on("click",function()
    {
      var URL="http://genome.ucsc.edu/cgi-bin/hgTracks?db=mm9&position="+self.model.axis2.chr+"%3A"+self.model.axis2.start+"-"+self.model.axis2.end;
      window.open(URL, '_blank');
    });
    
    
    this.ctrl.append("input").attr("class","button").attr("type","button").attr("value","download as pdf").on("click", function()
      {
        var svg_xml= (new XMLSerializer).serializeToString(self.svg[0][0])
        var form=$('<form>',{"action":"/cgi-bin/download.py","method":"post"})
        .append($('<input>',{"name":"data","value":svg_xml,"type":"hidden"}))
        .append($('<input>',{"name":"output_format","value":"pdf","type":"hidden"}))
        .append($('<input>',{"name":"width","value":1500,"type":"hidden"}))
        .append($('<input>',{"name":"height","value":300,"type":"hidden"}))
        .append($('<input>',{"name":"filename","value":fn[0][0].value||fn[0][0].placeholder,"type":"hidden"}))
        form.submit()
      });
    
    var fn=this.ctrl.append("input").attr("placeholder","download").attr("id","filename")
   this.ctrl.append("text").text(".pdf")

      var axis1_v = new B.AxisView({"model":self.model.axis1,"el":this.svg.append("g"),"x":20,"y":50,"width":1000,"height":2,"color":"black"});
     
     
            
 
            var unit=1000/(self.model.axis1.end-self.model.axis1.start)
      var axis2_width=unit*(self.model.axis2.end-self.model.axis2.start)
      var axis2_v = new B.AxisView({"model":self.model.axis2,"el":self.svg.append("g"),"x":20,"y":150,"width":unit*(self.model.axis2.end-self.model.axis2.start),"height":2,"color":"black"});
      if (axis2_width > 1000)
      {
          axis1_v.x=axis1_v.x+(axis2_width-1000)/2
          axis1_v.resetscale();
      }
      else
      {
         axis2_v.x=axis2_v.x+(1000-axis2_width)/2
         axis2_v.resetscale();
      }

      axis1_v.render(true);
      axis2_v.render(true);
 var brush=d3.svg.brush().x(axis1_v.scale).on("brush",function(){
})
   var context = self.svg.append("g")
    .attr("class", "context")
     context.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", 10)
      .attr("height", 75)




        this.model.bed1.forEach( function(e,i) {
          /*
          var bedModel=new B.BedModel(e)
          var bedView= new B.BedView({"model":bedModel,"el":self.svg.append("g"),"height":5,"color":"red"});
          bedView.render(axis1_v,40);
          */
          var bed12view = new B.Bed12View({"model":new B.BedModel(e),"el":self.svg.append("g"),"height":5,"color":"darkcyan"})
          bed12view.render(axis1_v,40);
          } )
     

        this.model.bed2.forEach( function(e,i) {
        /*
          var bedModel=new B.BedModel(e)
          dvar bedView= new B.BedView({"model":bedModel,"el":self.svg.append("g"),"height":5,"color":"red"});
          */
          var bed12view = new B.Bed12View({"model":new B.BedModel(e),"el":self.svg.append("g"),"height":5,"color":"royalblue"})
          bed12view.render(axis2_v,160);

          } )
    //TODO  add button and listener

/****----------------------------------------------------
 *   links section, to be modulized as function.
     add to listerer |
 *-------------------------------------------------------  */
var exons_1=new Array()
self.model.bed1.forEach(function(d) {
var rna=new B.BedModel(d);
rna.exons().forEach(function(d) {exons_1.push(d)})
})
var exons_2=new Array()
self.model.bed2.forEach(function(d) {
var rna=new B.BedModel(d);
rna.exons().forEach(function(d) {exons_2.push(d)})
})

var scale=[axis1_v.scale,axis2_v.scale]
var polys=[]
var block_in_range = function(block) {
    var start1=block[0][1]
    var end1=block[0][2]
    var start2=block[1][1]
    var end2=block[1][2]
    if (start1<self.model.axis1.end && end1 > self.model.axis1.start) { return true;}
    else if (start2<self.model.axis2.end && end2 > self.model.axis2.start) { return true ;}
    else { return false;}
}
var bed_in_range = function(d) {
return true;
}

//TODO add  plot1 and plot2

var WIGMAX=3000
if (self.model.plot1 && self.model.axis1.end-self.model.axis1.start < WIGMAX)
{
 var pv1 = new B.PlotView({"y":30,"height":20,"el":self.svg.append("g"),"model":self.model.plot1})
 pv1.render(axis1_v);
}
if(self.model.plot2 && self.model.axis2.end-self.model.axis2.start < WIGMAX)
{
 var pv2 = new B.PlotView({"y":180,"height":20,"el":self.svg.append("g"),"model":self.model.plot2})
 pv2.render(axis2_v);
}


//TODO  base pair coordinates translate



d.blocks.filter(block_in_range).forEach(function(d0,i0) {
        var poly=[]
        if (self.model.axis1.strand=="-")
        {
            poly.push({"x":d0[0][2],"y":50,"scale":0});
            poly.push({"x":d0[0][1],"y":50,"scale":0});
        }
        else
        {
            poly.push({"x":d0[0][1],"y":50,"scale":0});
            poly.push({"x":d0[0][2],"y":50,"scale":0});
        }
        if (self.model.axis2.strand=="-")
        {
            poly.push({"x":d0[1][1],"y":150,"scale":1});
            poly.push({"x":d0[1][2],"y":150,"scale":1});
        }
        else
        {
            poly.push({"x":d0[1][2],"y":150,"scale":1});
            poly.push({"x":d0[1][1],"y":150,"scale":1});
        }
        var color="grey";

        /* TODO improve e.end and e.stop
         */
        
        exons_1.forEach( function(e) {
           if (e.start < d0[0][2] && e.stop > d0[0][1]) {color="darkcyan"}
        })
        exons_2.forEach( function(e) {
           if (e.start < d0[1][2] && e.stop > d0[1][1]) {
               if (color=="darkcyan")
               {
               color="blue"
               }
               else
               {
                   color="steelblue"
               }
               }
        })
        polys.push({"color":color,"data":poly})
})
//console.log(polys)
    self.svg.selectAll("polygon")
    .data(polys)
  .enter().append("polygon")
    .attr("points",function(d) {
        return d.data.map(function(d) {
            return [scale[d.scale](d.x),d.y].join(",");
        }).join(" ");
    })
    //.attr("stroke","black")
    //.attr("stroke-width",2)
    .attr("fill",function(d) { return d.color})
    .attr("opacity",0.7)
    
    .on("mouseover",function(d) { d3.select(this).style("opacity",0.9);
    self.svg.append("rect").attr("class","flash").attr("x",scale[0](d.data[0].x)).attr("width",scale[0](d.data[1].x)-scale[0](d.data[0].x)).attr("y",0).attr("height",50).attr("fill","yellow").attr("opacity",0.2);
    self.svg.append("rect").attr("class","flash").attr("x",scale[1](d.data[3].x)).attr("width",scale[1](d.data[2].x)-scale[1](d.data[3].x)).attr("y",150).attr("height",50).attr("fill","yellow").attr("opacity",0.2);
    })
    .on("mouseout",function(d) {
        d3.select(this).style("opacity",0.7)
        self.svg.selectAll(".flash").remove();
        }).append("title").text(function(d) {return d.data[0].x+"-"+d.data[1].x+"  vs "+d.data[3].x+"-"+d.data[2].x});
    /* ------------------------- end of links seciton --------------------- */


    }
}
}(bam2x)

)
