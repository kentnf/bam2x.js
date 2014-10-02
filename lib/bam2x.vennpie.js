var bam2x=bam2x || {};
(function(B){
  B.vennpie= function(data,labels,el) {
    this.data=data;
    this.el=el;
    this.labels=labels;
  };
  
  B.vennpie.prototype = {
scale: 15,
r: 70,
padding: 20,
setScale: function(scale) {
  this.scale=scale;
  return this;
},
setPadding: function(padding) {
  this.padding=padding;
  return this;
},
setR: function(r) {
  this.r = r;
  return this;
},
_vennpie: function(){
    this.labels = typeof this.labels !== "undefined" ? this.labels:["A","B"];
    this.scale=this.r/7;
    var arcs = [];
    var a = 0  ;
    var total =  this.data.length == 4 ? this.data[3] : this.data[0]+this.data[1]-this.data[2]
    k = 3.1415926 * 2 / total;
    arcs[0] = {
        label : this.labels[0],
        data: this.data[0],
        proportion: this.data[0]/total,
        startAngle: 0,
        endAngle: this.data[0] * k,
        outerRadius: 5 * this.scale,
        innerRadius: 4 * this.scale
    };
    arcs[1] = {
        label: this.labels[1],
        data: this.data[1],
        proportion : this.data[1]/total,
        startAngle: (this.data[0]-this.data[2])*k ,
        endAngle: (this.data[0]+this.data[1]-this.data[2])*k,
        outerRadius: 6*this.scale,
        innerRadius: 5*this.scale
    };

    arcs[3] = {
        label : "not " +this.labels[0] + " or " + this.labels[1],
        data: d = total-this.data[0]-this.data[1]+this.data[2],
        proportion: d/total,
        startAngle: (this.data[0]+this.data[1]-this.data[2])*k,
        endAngle: 2*3.1415926,
        outerRadius: 6* this.scale,
        innerRadius: 0,
    };
   arcs[2] = {
        label : this.labels[0]+" or "+this.labels[1],
        data: d = this.data[0]+this.data[1]-this.data[2],
        proportion: d/total,
        startAngle: 0,
        endAngle: (this.data[0]+this.data[1]-this.data[2])*k,
        outerRadius: 4 * this.scale,
        innerRadius: 0,
    };
    arcs[4] = {
        label : this.labels[0]+" and  "+this.labels[1],
        data: d = this.data[2],
        proportion: d/total,
        startAngle: (this.data[0]-this.data[2])*k,
        endAngle: (this.data[0])*k,
        outerRadius: 7 * this.scale,
        innerRadius: 6 * this.scale,
    }
 
    return arcs
},

table: function(el) {
    var table = el.append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");
    var columns = ["category","number","proportion"]
    var total=this.data[3],both = this.data[2];
    var either=this.data[0]+this.data[1]-both;
    var other = total - either;
    var tdata = [
                [this.labels[0], this.data[0], this.data[0]/total],
                [this.labels[1], this.data[1], this.data[1]/total],
                ["both",both, both/total],
                ["either",either, either/total],
                ["other", other, other/total],
                ["total", total, 1.0],
                 ]
    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(tdata)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(d) {
                return d;
            })
        .enter()
        .append("td")
        .text(function(d,i) {  return  i==2 ? d.toFixed(2):d })

},


figure:function(el){
var self=this;
var pie=this._vennpie(this.data,this.labels);
    color = d3.scale.category10();
 var arc = d3.svg.arc() ;
var vis_size= 2*this.r+2*this.padding

var svg= el
        .append("svg:svg")
        .data([this.data])
            .attr("width", vis_size*1.618)
            .attr("height",vis_size);

var  vis=svg.append("svg:g")
            .attr("transform", "translate(" + this.r + "," + this.r + ")")
var legend_text=[this.labels[0],this.labels[1],"either","other","both"];
var legend=svg.selectAll(".legend").data(legend_text).enter().
            append("g").attr("class","legend")
              .attr("transform",function(d,i) { return "translate("+ vis_size + ","+(i*20+40) +")"})
        legend.append("circle")
              .attr("r",3)
              .attr("fill",function(d,i) {console.log(color(i));return color(i);})
        legend.append("text").attr("dx",10).attr("dy",5)
              .text(function(d,i) {return d})
              

var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice");
    arcs.append("svg:path")
         .attr("fill", function(d, i) { return color(i); } )
         .attr("d", arc)
         .attr("opacity",0.7)
         .on("mouseover",function(d,i)
                    {
                        d3.select(this).style("opacity",1.0);
                        vis.append("g").attr("id","flash").append("path").attr("d",d3.svg.arc().outerRadius(7*self.scale).innerRadius(0).startAngle(d.startAngle).endAngle(d.endAngle)).attr("opacity",0.3).attr("fill","yellow");
                    })
        .on("mouseout",function(d,i) {d3.select(this).style("opacity",0.7);
        vis.select("#flash").remove();}
        )
        .append("title").text(function(d) {return d.label+"\nnumber:"+d.data+"\nproportion:"+d.proportion.toFixed(2)})
},


render: function(){
    this.figure(this.el.append("div").attr("class","figure"));
    this.table(this.el.append("div").attr("class","table"));
}

}
  
}(bam2x))

