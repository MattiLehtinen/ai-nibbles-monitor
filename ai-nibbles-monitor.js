var socket = io("http://localhost:3000/");

var snakeA = [];
var snakeB = [];

var squareSize = 20;

socket.on('connect', function () {
    console.log("Connection");
    socket.emit('stream_latest');
    socket.on('positions', function (snakes) {
        console.log(snakes);
        snakeA = snakes[0].body;
        snakeB = snakes[1].body;
        refreshSnakes();
    });

});


var data = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];
//snakeA = [[5,0],[6,0],[6,1],[6,2],[7,2]];
snakeA = [[5,0]];
refresh();

function refresh() {

    var svg = d3.select("#gameSvg");

    var rowG = svg.selectAll("g")
        .data(data);

    var gameLevelRect = rowG.enter()
        .append("g")
        .selectAll(".gameLevelRect")
        .data( function(d,i) {return d;});

        gameLevelRect.enter()
            .append("rect")
            .attr("class", "gameLevelRect")
            .attr("x", function(d, i, j) { return i*squareSize; })
            .attr("y", function(d, i, j) { return j*squareSize; })
            .attr("width", squareSize+0.5)
            .attr("height", squareSize+0.5)
            .attr("style", function(d, i, j) {
                var blue = (d == 0) ? 0 : 255;
                return "fill:rgb(0,0, " + blue + ");";
            });
        gameLevelRect.exit().remove();

    rowG.exit().remove();

    refreshSnakes();
}

function refreshSnakes() {
    var svg = d3.select("#gameSvg");
    refreshSnake("snakeA", snakeA, "rgb(255,0,0)", svg);
    refreshSnake("snakeB", snakeB, "rgb(0,255,0)", svg);
}

function refreshSnake(snakeClass, snake, colorFill, svg) {
    var rect = svg.selectAll("." + snakeClass)
        .data(snake);

    // UPDATE
    rect.attr("x", function(d) { return d[0]*squareSize;})
        .attr("y", function(d) { return d[1]*squareSize;})

    // ENTER
    rect.enter()
        .append("rect")
        .attr("class", snakeClass)
        .attr("x", function(d) { return d[0]*squareSize;})
        .attr("y", function(d) { return d[1]*squareSize;})
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("style", "fill:" + colorFill + ";");

    // EXIT
    rect.exit().remove();
}