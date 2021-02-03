function scatterPlot(choice){
	console.log(choice)
	d3.select("svg").remove();
	var functionName;
  	if(choice=="1")
  		functionName="/plotTop2PCAOriginal";
  	if(choice=='2')
  		functionName="/plotTop2PCARandom";
  	if(choice=='3')
  		functionName="/plotTop2PCAStratified";

	$.post(functionName,function(data)
	{
		dataArray = JSON.parse(data);

		var margin = {top: 20, right: 20, bottom:250, left: 40},
            width = 800 - margin.left - margin.right,
			height = 700- margin.top - margin.bottom;
			
			var svg = d3.select("body").append("svg")
            .attr("width", (width+300) + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
				"translate(" +(300+margin.left) + "," + margin.top + ")");
				
		// var colorScale = d3.scale.linear()
		// 		.domain([0, d3.max(dataArray, function(d) { return d[2] ; })])
		// 		.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

		var x = d3.scale.linear()
		          .range([0, width])
		          .domain([d3.min(dataArray, function(d) { return d[0]; }), d3.max(dataArray, function(d) { return d[0]; })]);
		var y = d3.scale.linear()
		          .range([height, 0])
		          .domain([d3.min(dataArray, function(d) { return d[1]; }), d3.max(dataArray, function(d) { return d[1]; })]);

		  var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

            var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

		svg.append('g')
			.selectAll("dot")
			.data(dataArray)
			.enter()
			.append("circle")
			  .attr("cx", function (d) { return x(d[0]); } )
			  .attr("cy", function (d) { return y(d[1]); } )
			  .attr("r", 5)
			  .style("fill", "#69b3a2");

			  svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)
			  .selectAll("text")
			  .style("text-anchor", "end")
			  .attr("dx", "-.8em")
			  .attr("dy", "-.2em")
			  .attr("transform", "rotate(-90)" );
			
			svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");


		  svg.append("text")             
		  .attr("transform",
		        "translate(" + (width/2) + " ," + 
		                       (height + margin.top + 50) + ")")
		  .style("text-anchor", "middle")
		  .text("PC1");

		  svg.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 0 - margin.left)
		  .attr("x",0 - (height / 2))
		  .attr("dy", "1em")
		  .style("text-anchor", "middle")
		  .text("PC2");    



	});

}