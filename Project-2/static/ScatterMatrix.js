function scatterMatrix(choice){
	d3.select("svg").remove();
	var functionName;
  	if(choice=="1")
  		functionName="/plotScatterMatrixOriginal";
  	if(choice=='2')
  		functionName="/plotScatterMatrixRandom";
  	if(choice=='3')
  		functionName="/plotScatterMatrixStratified";

  	$.post(functionName,function(data)
	{
		dataArray = JSON.parse(data);
		attributes=['Outstate','Room.Board','Personal'];	

		var margin = {top: 20, right: 20, bottom: 40, left: 40},
	    width = 620 - margin.left - margin.right,
		height = 620 - margin.top - margin.bottom;

		var svg = d3.select("body").append("svg")
            .attr("width", (width+300) + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" +(300+margin.left) + "," + margin.top + ")");


			R1=[0,190,380];
			R2=[180,370,560];
			var isYAxis, isXAxis;

			
			var attrName='';
			for(i=0;i<3;i++)
				for(j=0;j<3;j++)
				{
					attrName="";
					isXAxis=0;
					isYAxis=0;
					if(j==0)
						isYAxis=1;
					if(i==2)
						isXAxis=1;
					if(i==2-j)
						attrName=attributes[i]
					smallerPlot(j,2-i,R1[j],R2[j],R2[i],R1[i],isXAxis,isYAxis,attrName);
				}
	
	
			function smallerPlot(xIndex,yIndex,xR1,xR2,yR1,yR2,isXAxis,isYAxis,attrName)
			{

			var x = d3.scale.linear()
				.range([xR1, xR2])
				.domain([0, d3.max(dataArray, function(d) { return d[xIndex]; })]);
			var y = d3.scale.linear()
				.range([yR1, yR2])
				.domain([0, d3.max(dataArray, function(d) { return d[yIndex]; })]);
			
			var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");
		
			var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");
		
			

				svg.append('g')
					.selectAll("dot")
					.data(dataArray)
					.enter()
					.append("circle")
					  .attr("cx", function (d) {  return x(d[xIndex]); } )
					  .attr("cy", function (d) { return y(d[yIndex]); } )
					  .attr("r", 1.5)
					  .style("fill", "#69b3a2");
				svg.append("text")             
				  .attr("transform",
						"translate(" + (xR1+xR2)/2 + " ," + 
									   (yR1+yR2)/2 + ")")
				  .style("text-anchor", "middle")
				  .text(attrName);



				if(isXAxis)
				  svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," +yR1+ ")")
				  .call(xAxis)
				  .selectAll("text")
				  .style("text-anchor", "end")
				  .attr("dx", "-.8em")
				  .attr("dy", "-.2em")
				  .attr("transform", "rotate(-90)" );
				
				  if(isYAxis)
					svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end");
	
	
				
			}	


	});
}