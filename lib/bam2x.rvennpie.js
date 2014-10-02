var bam2x=bam2x || {};
(function(B){
	B.RVennPie = function(data) {
		this.data=data;
		this.scale=15
		this.r=100
		this.padding=20;
		this.pie=this.vennpie(this.data);
	}
	B.RVennPie.prototype = {
		vennpie: function(data){
		    this.scale=this.r/7;
		    var arcs = [];
		    var a = 0  ;
		    k = 3.1415926 * 2 / data.total;
		    arcs[0] = { 
		        label : "gene",
		        data: data.gene.total,
		        proportion: data.gene.total/data.total,
		        startAngle: 0,
		        endAngle: data.gene.total * k,
		        outerRadius: 4 * this.scale,
		        innerRadius: 0 * this.scale
		    };
		    arcs[1] = { 
		        label: "intergenic",
		        data: data.intergenic.total,
		        proportion : data.intergenic.total/data.total,
		        startAngle: data.gene.total*k,
		        endAngle: 2 * 3.1415926 ,
		        outerRadius: 4*this.scale,
		        innerRadius: 0*this.scale
		    };

		    arcs[2] = {
		        label : "exon",
		        data: d = data.gene.exon,
		        proportion: data.gene.exon/data.total,
		        startAngle: 0,
		        endAngle: d * k,
		        outerRadius: 6* this.scale,
		        innerRadius: 5* this.scale
		    };
		   arcs[3] = {
		        label : "intron",
		        data: d = data.gene.intron,
		        proportion: d/data.total,
		        startAngle: (data.gene.exon-data.gene.intron_and_exon)*k,
		        endAngle: (data.gene.exon-data.gene.intron_and_exon+data.gene.intron)*k,
		        outerRadius: 4 * this.scale,
		        innerRadius: 5 * this.scale
		    };
		    arcs[4] = {
		        label : "intron and exon",
		        data : d = data.gene.intron_and_exon,
		        proportion: d/data.total,
		        startAngle: (data.gene.exon - data.gene.intron_and_exon) * k,
		        endAngle: (data.gene.exon)*k,
		        outerRadius: 6 * this.scale,
		        innerRadius: 7 * this.scale

		    }

		    arcs[5] = {
		        label : "upstream",
		        data : d = data.intergenic.up,
		        proportion : d/data.total,
		        startAngle : data.gene.total * k,
		        endAngle: (data.gene.total + data.intergenic.up) * k,
		        outerRadius: 6 * this.scale,
		        innerRadius: 5 * this.scale
		    };
		    arcs[6] = {
		        label : "downstream",
		        data : d = data.intergenic.down,
		        proportion : d/data.total,
		        startAngle : (data.gene.total + data.intergenic.up - data.intergenic.up_and_down) * k ,
		        endAngle : (data.gene.total + data.intergenic.up - data.intergenic.up_and_down + data.intergenic.down) * k ,
		        outerRadius: 5 * this.scale,
		        innerRadius: 4 * this.scale
		    };
		    arcs[7] = {
		        label: "not near gene",
		        data : d = data.intergenic.total - data.intergenic.up - data.intergenic.down + data.intergenic.up_and_down,
		        proportion: d/data.total,
		        startAngle: 2 * 3.1415926 - d * k,
		        endAngle: 2 * 3.1415926,
		        outerRadius: 6 * this.scale,
		        innerRadius: 5 * this.scale
		    };
		    arcs[8]= {
		        label: "5'UTR",
		        data : d = data.gene.utr5,
		        proportion: d/data.total,
		        startAngle: 0,
		        endAngle: d * k,
		        outerRadius : 6 * this.scale,
		        innerRadius : 5 * this.scale,
		    };

		    arcs[9]= {
		        label: "3'UTR",
		        data : d = data.gene.utr3,
		        proportion: d/data.total,
		        startAngle: (data.gene.utr5-data.gene.utr3_and_utr5) *k,
		        endAngle: (data.gene.utr5-data.gene.utr3_and_utr5+data.gene.utr3) *k,
		        outerRadius : 5 * this.scale,
		        innerRadius : 4 * this.scale,
		    };
		    arcs[10] = {
		        label: "ONLY CDS",
		        data : d = data.gene.total - data.gene.utr3 - data.gene.utr5 + data.gene.utr3_and_utr5,
		        proportion: d/data.total,
		        startAngle: (data.gene.utr5-data.gene.utr3_and_utr5+data.gene.utr3) *k,
		        endAngle: data.gene.total *k,
		        outerRadius : 6 * this.scale,
		        innerRadius : 5 * this.scale,
		    };
		    return arcs
		},
		table: function(el,pie) {
		    var table = el.append("table"),
		        thead = table.append("thead"),
		        tbody = table.append("tbody");
		    columns = ["category","number","proportion"];
		    // append the header row
		    tdata=[]
		    pie.forEach ( function(i) {tdata.push([i.label,i.data,i.proportion])})
		    console.log(tdata);
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

		figure:function(el,pie){
		var self=this;
		    color = d3.scale.category10();     
		 var arc = d3.svg.arc() ;
		var vis_size= 2*this.r+2*this.padding
		var svg= el
		        .append("svg:svg")              
		            .attr("width", vis_size*1.618)           
		            .attr("height",vis_size);
		var  vis=svg.append("svg:g")                
		            .attr("transform", "translate(" + this.r + "," + this.r + ")")    
		var legend_text=[];
		for ( i in pie) { legend_text.push(pie[i].label); }
		var legend=svg.selectAll(".legend").data(legend_text).enter().
		            append("g").attr("class","legend")
		              .attr("transform",function(d,i) { return "translate("+ vis_size + ","+(i*20+40) +")"})
		        legend.append("circle")
		              .attr("r",3)
		              .attr("fill",function(d,i) {console.log(color(i));return color(i);})
		        legend.append("text").attr("dx",10).attr("dy",5)     
		              .text(function(d,i) {return d})
		console.log(pie);
		var arcs = vis.selectAll("g.slice")     
		        .data(pie)                          
		        .enter()                            
		        .append("svg:g")                
		        .attr("class", "slice");
		    console.log(arcs);
		    console.log(vis);
		    vis.forEach(function(d) {console.log(d)});
		    arcs.append("svg:path")
		         .attr("fill", function(d, i) { console.log(i);return color(i); } ) 
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

		header: function(el){
		        el.html("<h2>"+this.data.title+"</h2>");
		    },
		render1: function(el){
		    this.header(el.append("div").attr("class","header"));
		    pie1=this.pie.slice(0,8)
		    this.figure(el.append("div").attr("class","figure"),pie1);
		    this.table(el.append("div").attr("class","table"),pie1);
		    },
		render2: function(el){
		    this.header(el.append("div").attr("class","header"));
		    pie2=this.pie.slice(0,2).concat(this.pie.slice(8,11)).concat(this.pie.slice(5,8))
		    this.figure(el.append("div").attr("class","figure"),pie2);
		    this.table(el.append("div").attr("class","table"),pie2);
		    }
	}
	
	
}(bam2x))