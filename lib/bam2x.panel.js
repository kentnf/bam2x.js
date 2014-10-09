/*BAM2X PANEL
 *Version: 0.1
 *Author: zhuxp
 *Copyright: GPL
 */
var bam2x = bam2x || {};
(function(B){

	B.panel = B.factory.default_model();
	B.panel.prototype = {
		/*
		 * el is d3.select("svg")
		 */
		validate:function() {
			var required = ["el","height","width","x","y"];
			var optional = ["border","modules"]
			for(i in required) {
				if (!this[required[i]]) {
					return false;
				}
			}
			return true;
		},
		render:function() {
			var self=this;
			self.panel=self.el.append("g").attr("transform","translate("+self.x+","+self.y+")").attr("id",self.id ||"panel").attr("height",self.height).attr("width",self.width);
			if (self.border) {	
			 self.panel.append("g").attr("class","border").append("rect").attr("x",0).attr("y",0).attr("height",self.height).attr("width",self.width).attr("stroke",self.color || "grey").attr("stroke-width",self.border)
			.attr('fill','white').attr('fill-opacity',0.0).attr("rx",self.rx || 0).attr("ry", self.ry || 0)
			
			}
			if (self.modules)
			{
			   self.modules.forEach(function(d)
			   {
				d.el=self.panel;
				d.render();
			   }
		    
			)
		    }	
			
		}
				
	}
	
}(bam2x));



