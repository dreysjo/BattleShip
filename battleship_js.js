var model = {
    boardSize: 0,
    numShips: 0,
    shipLength: 0,
    shipsSunk: [0, 0],

    ship1: [],
    ship2: [],
    initialShip: function() {
        this.ship1 = []
        this.ship2 = []
        for (var i = 0; i < this.numShips; i++) {
            this.ship1.push({ locations: Array(this.shipLength).fill(0), hits: Array(this.shipLength).fill("") })
            this.ship2.push({ locations: Array(this.shipLength).fill(0), hits: Array(this.shipLength).fill("") })
        }
    },
    setupBoard: function(playerboard, player) {
        for (var i = 0; i < this.boardSize; i++) {
            var row = playerboard.insertRow(i)
            for (var j = 0; j < this.boardSize; j++) {
                var col = row.insertCell(j)
                col.setAttribute("id", i + '' + j + "" + player)
                col.setAttribute("onclick", 'controller.processGuess(this.id,"' + player + '")')
            }
        }
    },

    resetBoard: function() {
        this.initialShip()
        this.shipsSunk = [0, 0]
        var board1 = document.getElementById("table-p1")
        var board2 = document.getElementById("table-p2")
        for (var i = 0; i < this.boardSize; i++) {
            board1.deleteRow(0)
            board2.deleteRow(0)
        }
        this.setupBoard(board1, '1')
        this.setupBoard(board2, '2')
        this.generateShipLocations('1')
        this.generateShipLocations('2')
    },

    fire: function(guess, player) {
        if (player === "1") {
            var ships = this.ship1;
        } else {
            var ships = this.ship2;
        }
        console.log("serang" + "" + guess)
        for (var i = 0; i < this.numShips; i++) {
            var ship = ships[i];
            var index = ship.locations.indexOf(guess);


            // here's an improvement! Check to see if the ship
            // has already been hit, message the user, and return true.
            if (ship.hits[index] === "hit") {
                console.log("masuk siniiiiiiiii")
                console.log(ship)
                    // view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                console.log("KENAAAAAAAAAAAAAAAAAAAAAAA")
                    // view.displayMessage("HIT!");

                if (this.isSunk(ship)) {
                    // view.displayMessage(;"You sank my battleship!")
                    tahuGelep.addScore()
                    console.log("TENGGELEM SIJI")
                    this.shipsSunk[parseInt(player) - 1]++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        tahuGelep.changeTurn()
        console.log("NOEL BILANG MELESET")
            // view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function(player) {
        if (player === "1") {
            var ships = this.ship1;
        } else {
            var ships = this.ship2;
        }
        if (this.numShips >= this.boardSize) {
            console.log("KAPAL KELEWATAN")
                // how to break da cycle
        } else {
            var locations;
            for (var i = 0; i < this.numShips; i++) {
                do {
                    locations = this.generateShip(player);
                    console.log(locations)
                } while (this.collision(locations));
                ships[i].locations = locations;
            }
        }
        console.log("Ships array: ");
        console.log(ships)
    },

    generateShip: function(player) {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i) + "" + player);
            } else {
                newShipLocations.push((row + i) + "" + col + "" + player);
            }
        }
        return newShipLocations;
    },

    collision: function(locations, player) {
        if (player === "1") {
            var ships = this.ship1;
        } else {
            var ships = this.ship2;
        }

        for (var i = 0; i < this.numShips; i++) {
            var ship = ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

var tahuGelep = {
    score: [0, 0],
    turn: 0,
    round: 0,
    playerName: ["", ""],
    maxSet: 0,
    trackSet: 0,
    countPlayerWins: [0, 0],


    changeTurn: function() {
        this.turn = (this.turn + 1) % 2
        this.trackSet++
    },

    addScore: function() {
        this.score[this.turn] += (4 - model.shipLength) * 10
    },

}

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },

    multipleDisplayScore: function() {
        document.getElementById("score-p1").innerHTML = "Score-P1: " + tahuGelep.score[0]
        document.getElementById("score-p2").innerHTML = "Score-P2: " + tahuGelep.score[1]
        document.getElementById("set").innerHTML = "SET " + tahuGelep.round + "-" + tahuGelep.trackSet
    },

    announceWinner: function() {
        document.getElementById("announce").innerHTML = tahuGelep.playerName[tahuGelep.turn] + " WINS!!"
        document.getElementById("announce").style.display = "block"
    }

};

var controller = {
    guesses: 0,

    processGuess: function(guess, player) {
        console.log(tahuGelep.turn + "" + player)
        if (tahuGelep.turn + 1 != player) {
            var location = guess;
            if (location) {
                this.guesses++;
                var hit = model.fire(location, player);
                view.multipleDisplayScore()
                if (hit && model.shipsSunk[parseInt(player) - 1] === model.numShips) {
                    tahuGelep.round++;
                    tahuGelep.countPlayerWins[tahuGelep.turn]++
                        tahuGelep.trackSet = 0
                    view.multipleDisplayScore()
                    model.resetBoard()
                        // view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
                    // console.log("SUSI TENGGELAMKAN")
                    if ((tahuGelep.countPlayerWins[0] > tahuGelep.maxSet / 2) || (tahuGelep.countPlayerWins[1] > tahuGelep.maxSet / 2)) {
                        view.announceWinner()
                    }
                }
            }

        }

    },

    getUserData: function() {
        model.boardSize = parseInt(document.getElementById("boardSizeInput").value)
        model.numShips = parseInt(document.getElementById("numShipInput").value)
        model.shipLength = parseInt(document.getElementById("shipTypeInput").value)
        tahuGelep.maxSet = parseInt(document.getElementById("setInput").value)
        tahuGelep.playerName[0] = document.getElementById("player1").value
        tahuGelep.playerName[1] = document.getElementById("player2").value
        model.initialShip()
        var board1 = document.getElementById("table-p1")
        model.setupBoard(board1, "1")
        var board2 = document.getElementById("table-p2")
        model.setupBoard(board2, "2")
        model.generateShipLocations("1")
        model.generateShipLocations("2")
    }
}


// helper function to parse a guess from the user

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

