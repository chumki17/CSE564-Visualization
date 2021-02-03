
function readColName(colName){
    plotHistogram();

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    function changeBinSize(){
    var val = slider.value;
    return val;
    }; 


    function plotHistogram(){

        d3.selectAll("svg").remove();

        var dataMap =[];
        
        d3.csv("WWC17.csv", function(dataset) {
            dataMap = dataset.map(function(d){
                return parseInt(d[colName]); })


        var color = "steelblue";
        var padding = 10;
        var formatCount = d3.format(",.0f");
        
        var margin = {top: 20, right: 30, bottom: 30, left: 30},
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        
        var max = d3.max(dataMap);
        var min = d3.min(dataMap);
        
        var x = d3.scale.linear()
            .domain([min, max])
            .range([0, width]);

        var data = d3.layout.histogram()
            .bins(x.ticks(changeBinSize()))
            (dataMap);

    
        var yMax = d3.max(data, function(d){return d.length});
        var yMin = d3.min(data, function(d){return d.length});
        var colorScale = d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
                
        var y = d3.scale.linear()
                            .domain([0, yMax])
                            .range([height, 0]);
                    
                
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
                    .attr("transform", "translate(" + (margin.left+300) + "," + margin.top + ")");
                
        var bar = svg.selectAll(".bar")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "bar");
            
                    svg.append("text")             
                    .attr("transform",
                        "translate(" + (width/2) + " ," + 
                                        (height + margin.top +10) + ")")
                    .style("text-anchor", "middle")
                    .text(colName);
            
                    svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left-2)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Value");     
            
        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                
                    svg.call(tip);
                            
                    bar.append("rect")
                        .attr("x", 1)
                        .attr("width", (x(data[0].dx) - x(0))- padding)
                        .attr("height", function(d) { return height - y(d.y); })
                        .attr("fill", function(d) { return colorScale(d.y) })
                        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
                        
                        .on("mouseover", function(d){
                         d3.select(this)
                        .attr("width", (x(data[0].dx) - x(0)) -padding +5)
                        .attr("height",function(d) { return height - y(d.y)+5; })
                        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + (y(d.y)-5) + ")"; })
                        .attr("fill", "red");
                        tip.html( "<strong> <span style='color:red'>" + formatCount(d.y) + "</span></strong>");
                        tip.show();
                    })
                    
                        .on("mouseout", function(d){
                            d3.select(this)
                            .attr(0)
                            .attr("width", (x(data[0].dx) - x(0)) - padding)
                            .attr("height",function(d) { return height - y(d.y); })
                            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + (y(d.y)) + ")"; })
                            .attr("fill", function(d) { return colorScale(d.y) });
                            tip.hide();
                        });
            
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
        })

    };
slider.oninput = function() {
    output.innerHTML = this.value;
    changeBinSize();
    plotHistogram();
  }    
};

