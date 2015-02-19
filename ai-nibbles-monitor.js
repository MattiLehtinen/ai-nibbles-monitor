var socket = io("http://localhost:3000/");

var snakeA = [];
var snakeB = [];

var squareSize = 5;
var gameDiv = d3.select("#game");
var levelG = null;
var snakeAG = null;
var snakeBG = null;
var map = null;

socket.on('connect', function () {
    console.log("Connection");
    socket.emit('stream_latest');

    socket.on('start', function(data) {
        console.log("start");
        console.log(data);
        var level = data.level;
        map = level.map;

        var mainSvg = gameDiv.append("svg")
            .attr("id", "gameSvg")
            .attr("width", level.width * squareSize)
            .attr("height", level.height * squareSize);
        levelG = mainSvg.append("g").attr("id", "level");
        snakeAG = mainSvg.append("g").attr("id", "snakeA");
        snakeBG = mainSvg.append("g").attr("id", "snakeB");
        refresh();
    });

    socket.on('positions', function (snakes) {
        console.log(snakes);
        snakeA = snakes[0].body;
        snakeB = snakes[1].body;
        refreshSnakes();
    });

});

/*
var map = [
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
snakeB = [[5,0],[6,0],[6,1],[6,2],[7,2]];
snakeA = [[50,50]];
*/



function refresh() {


    var rowG = levelG.selectAll("g")
        .data(map);

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
    refreshSnake("snakeA", snakeA, "rgb(255,0,0)", snakeAG);
    refreshSnake("snakeB", snakeB, "rgb(0,255,0)", snakeBG);
}

function refreshSnake(snakeClass, snake, colorFill, element) {
    var rect = element.selectAll("." + snakeClass)
        .data(snake);

    // UPDATE
    rect.attr("x", function(d) { return d[0]*squareSize;})
        .attr("y", function(d) { return d[1]*squareSize;});

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