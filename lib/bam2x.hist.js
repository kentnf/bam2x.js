var bam2x = bam2x || {};
(function(B){
    B.hist=B.factory.default_model();
    B.hist.prototype = {
    plot: function(el) {
     /*
     revise from http://http://bl.ocks.org/mbostock/3048450
     */
     var self=this;
     var formatCount = d3.format(",.0f");
     var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = this.width,
        height = this.height;
        xmin=this.xmin || Math.min.apply(Math,this.values);
        xmax=this.xmax || Math.max.apply(Math,this.values);
        if(!this.id) {this.id="svg_hist"}

var x = d3.scale.linear()
    .domain([xmin, xmax])
    .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(this.binsize))
    (this.values);



var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var svg = el.append("svg").attr("class","hist").attr("id",this.id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    var binwidth= x(data[0].dx+data[0].x)-x(data[0].x)-1
    bar.append("rect")
        .attr("x", 1)
        .attr("width", binwidth )
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill",self.color ||"steelblue")
        .attr("shape-rendering","crispEdges");
    if (this.text)
    {
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", binwidth / 2)
        .attr("font-size",8)
        .attr("text-anchor", "middle")
        .attr("fill","#fff")
        .text(function(d) { return formatCount(d.y); });
    }
    else
    {
        bar.append("title").text(function(d) {return d.x+" : "+formatCount(d.y)}) 
    }
    if (this.ticks)
    {
       svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("font-size",8)
        .call(xAxis); 
     }

        }
     }
}(bam2x))

