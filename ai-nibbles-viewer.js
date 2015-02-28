var socket = io("http://localhost:3000/");

var snakeA = [];
var snakeB = [];

var squareSize = 5;
var gameDiv = d3.select("#game");
var levelG = null;
var snakeAG = null;
var snakeBG = null;
var map = null;
var players = null;

var mainSvg = gameDiv.append("svg")
    .attr("id", "gameSvg");
levelG = mainSvg.append("g").attr("id", "level");
appleG = mainSvg.append("g").attr("id", "apple");
snakeAG = mainSvg.append("g").attr("id", "snakeA");
snakeBG = mainSvg.append("g").attr("id", "snakeB");

socket.on('connect', function () {
    console.log("Connection");

    socket.on('start', function(data) {
        players = data.players;
        console.log("Start. Players 1: " + players[0].name + ' Player 2: ' + players[1].name);
        d3.select("#player1Name").text(players[0].name);
        d3.select("#player2Name").text(players[1].name);
        d3.select("#player1Winner").style("visibility", "hidden");
        d3.select("#player2Winner").style("visibility", "hidden");
        console.log(data);
        var level = data.level;
        map = level.map;
        mainSvg
            .attr("width", level.width * squareSize)
            .attr("height", level.height * squareSize);
        refresh(level);
    });

    socket.on('positions', function (snakes) {
        snakeA = snakes[0].body;
        snakeB = snakes[1].body;
        refreshSnakes();

        if(!snakes[0].alive) {
            console.log(players[1].name + " won! (Player 2)");
            d3.select("#player2Winner").style("visibility", "visible");
        } else if(!snakes[1].alive) {
            console.log(players[0].name + " won! (Player 1)");
            d3.select("#player1Winner").style("visibility", "visible");
        } else if(!snakes[0].alive && !snakes[1].alive) {
            console.log("TIE.");
        }
    });

    socket.on('apple', function(apple) {
        console.log("Apple: " + apple);
        refreshApple(apple);
    });

    socket.on('end', function() {
        console.log("END");
    })

});

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
    refreshSnake("snakeA", snakeA, "rgb(255,255,0)", snakeAG);
    refreshSnake("snakeB", snakeB, "rgb(0,255,255)", snakeBG);
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

function refreshApple(apple) {
    var element = appleG;
    var appleClass = "apple";
    var appleRadius = squareSize/2.0;
    var circle = element.selectAll("." + appleClass)
        .data([0]);

    // UPDATE
    circle.attr("cx", apple[0]*squareSize + appleRadius)
          .attr("cy", apple[1]*squareSize + appleRadius);

    // ENTER
    circle.enter()
        .append("circle")
        .attr("class", appleClass)
        .attr("cx", apple[0]*squareSize + appleRadius)
        .attr("cy", apple[1]*squareSize + appleRadius)
        .attr("r", appleRadius)
        .attr("fill", "red");

    // EXIT
    circle.exit().remove();
}