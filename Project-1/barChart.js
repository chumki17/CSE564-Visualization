
function readCol(colName){

    d3.selectAll("svg").remove();

    var obj ={}; var dataArray=[];

        d3.csv("WWC17.csv", function(data) {
            data.forEach(function(d) {
                if(obj[d[colName]]== undefined){
                    obj[d[colName]]=1;
                }
                else{
                    obj[d[colName]]+=1;
                } 
            // console.log(obj)
            });

        for(let key in obj)
        {
            tempObj={};
            tempObj["colName"]=key;
            tempObj["Value"]=obj[key];
            dataArray.push(tempObj);
        }
        console.log(tempObj)
    var margin = {top: 20, right: 20, bottom: 250, left: 40},
        width = 800 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    var color = "steelblue";

    var colorScale = d3.scale.linear()
        .domain([0, d3.max(dataArray, function(d) { return d.Value; })])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
    
    var y = d3.scale.linear().range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);
    
    var svg = d3.select("body").append("svg")
        .attr("width", (width+500) + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" +(300+margin.left) + "," + margin.top + ")");
        
    x.domain(dataArray.map(function(d) { return d.colName; }));
    y.domain([0, d3.max(dataArray, function(d) { return d.Value; })]);
    
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
        
    
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
    
    svg.call(tip);
    
    svg.selectAll(".bar")
        .data(dataArray)
        .enter().append("rect")
        .style("fill", function(d) { return colorScale(d.Value) })
        .attr("x", function(d) { return x(d.colName); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.Value); })
        .attr("height", function(d) {return height - y(d.Value); })  
        
        .on("mouseover", function(d){
            d3.select(this).style("fill", "red")
            .attr("x", function(d) { return x(d.colName); })
            .attr("width", x.rangeBand()+5)
            .attr("y", function(d) { return y(d.Value)-5; })
            .attr("height", function(d) {return (height - y(d.Value)+5); }) 
            tip.html( "<strong> <span style='color:red'>" + d.Value + "</span></strong>");
            tip.show(); 
            })
        
        .on("mouseout", function(d){
            d3.select(this).style("fill", function(d) { return colorScale(d.Value) })
            .attr("x", function(d) { return x(d.colName); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.Value); })
            .attr("height", function(d) {return (height - y(d.Value)); })
            tip.hide();  
            });

            svg.append("text")             
            .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top +70) + ")")
            .style("text-anchor", "middle")
            .text(colName);
    
            svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left-2)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");  

    });
  
};