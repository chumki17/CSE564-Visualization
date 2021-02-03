function screePlot(num){

    var functionName;
    if(num=='1')
        functionName="/plotOriginalPCA";
    if(num=='2')
        functionName="/plotRandomPCA";
    if(num=='3')
        functionName="/plotStratifiedPCA";

     $.post(functionName, function(data){
            d3.selectAll("svg").remove();
            var dataArray=[];
            dataArray = JSON.parse(data);
            
            var pca75, value;
            for(i=0;i<dataArray.length;i++)
            {
                if(dataArray[i][2]>=75){
                    value =dataArray[i][2];
                    pca75=dataArray[i][0];
                    break;
                }
            }	

            var margin = {top: 20, right: 20, bottom:250, left: 40},
            width = 800 - margin.left - margin.right,
            height = 700- margin.top - margin.bottom;

            var color = "steelblue";

            var colorScale = d3.scale.linear()
            .domain([0, d3.max(dataArray, function(d) { return d[1] ; })])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

            var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

            var y = d3.scale.linear().range([height, 0]);   //range([0,height]

            var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

            var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(20);

            var svg = d3.select("body").append("svg")
            .attr("width", (width+300) + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" +(300+margin.left) + "," + margin.top + ")");

            x.domain(dataArray.map(function(d) {return d[0]; }));
            y.domain([0, d3.max(dataArray, function(d) { return d[2]; })]);

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

            svg.selectAll(".bar")
            .data(dataArray)
            .enter().append("rect")
            .style("fill", function(d) { return colorScale(d[1]) })
            .attr("x", function(d) { return x(d[0]) ; })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d[1]) ;  })
            .attr("height", function(d) {return height -  y(d[1]); });  

                svg.append("text")             
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                                    (height + margin.top +70) + ")")
                .style("text-anchor", "middle")
                .text("PCA");

                svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left-2)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Percentage");     


                svg.append("path")
                .datum(dataArray)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.svg.line()
                    .x(function(d) { return x(d[0]) })
                    .y(function(d) { return y(d[2]) })
                    .interpolate("linear")
                    );
                
                    svg.append("line")
                    .attr("x1", x(pca75))
                    .attr("y1", y(100))
                    .attr("x2", x(pca75))
                    .attr("y2", y(0))
                    .style("stroke", "rgb(6,120,155)");

                    svg.append("line")
                    .attr("x1", x(0))
                    .attr("y1", y(value))
                    .attr("x2", x("PC17"))
                    .attr("y2", y(value))
                    .style("stroke", "rgb(6,120,155)");

            });
};