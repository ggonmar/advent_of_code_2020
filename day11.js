try { input = document.getElementsByTagName("pre")[0].innerText; }
catch (e) {
    input = getLiteralInput();
}
input = input.split('\n').filter(e => e.length).map(e => e.trim());

class Spot {
    constructor(x, y, icon) {
        this.x = x;
        this.y = y;
        this.icon = icon;
        if (icon == ".") {
            this.seat = false;
            this.occupied = false;
        }
        else if (icon == "L") {
            this.seat = true;
            this.occupied = false;
        }
        else if (icon == "#") {
            this.seat = true;
            this.occupied = true;
        }
    }

    takeSpot() {
        this.occupied = true;
        this.icon = "#";
    }
    leaveSpot() {
        this.occupied = false;
        this.icon = "L";
    }
    countAdjacentOccupied(seatMap) {
        let taken = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0)
                    continue;
                else if (this.x + i < 0 || this.x + i > seatMap.length - 1 || this.y + j < 0 || this.y + j > seatMap[0].length - 1)
                    continue;
                else if (seatMap[this.y + j][this.x + i].occupied)
                    taken++;
            }
        }
        return taken;
    }
    printSurrounding(seatMap) {
        let str = `${this.x},${this.y}:\n`;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0)
                    str += "*";
                else if (this.x + i < 0 || this.x + i > seatMap.length - 1 || this.y + j < 0 || this.y + j > seatMap[0].length - 1)
                    str += '|'
                else
                    str += seatMap[this.x + i][this.y + j].icon;
            }
            str += '\n';
        }
        return str;
    }

    countOnAllDirections(seatMap, debug=false) {
        let count = 0;
        let str = `${this.x},${this.y}:`;
        //viewSeatMap(seatMap);
        //TOP
        str+="\n\tTop: ";
        for (let i = 1; i <= this.x; i++) {
            let elem=seatMap[this.x-i][this.y];
            if(analyzeElem(elem)) break;
        }
        //BOTTOM
        str+="\n\tBottom: ";
        for (let i = 1; i<= seatMap.length-this.x-1; i++) {
            let elem = seatMap[this.x+i][this.y]
            if(analyzeElem(elem)) break;
        }
        //LEFT
        str+="\n\tLeft: ";
        for (let j = 1; j <= this.y; j++) {
            let elem=seatMap[this.x][this.y-j]; 
            if(analyzeElem(elem)) break;
        }
        //RIGHT
        str+="\n\tRight: ";
        for (let j = 1; j < seatMap[0].length-this.y; j++) {
            let elem = seatMap[this.x][this.y+j];
            if(analyzeElem(elem)) break;
        }
        //TOP-LEFT
        str+="\n\tTop Left: ";
        for (let i = 1; i <= Math.min(this.x, this.y); i++) {
            let elem =seatMap[this.x-i][this.y-i]; 
            if(analyzeElem(elem)) break;
        }

        //BOTTOM-RIGHT
        str+="\n\tBottom Right: ";
        for (let i = 1; i < Math.min(seatMap.length-this.x, seatMap[0].length-this.y); i++) {
            let elem = seatMap[this.x+i][this.y+i];
            if(analyzeElem(elem)) break;
        }

        //TOP-RIGHT
        str+="\n\tTop Right: ";
        for (let i = 1; i <= Math.min(this.x, seatMap[0].length-this.y-1); i++) {
            let elem = seatMap[this.x-i][this.y+i];
            if(analyzeElem(elem)) break;
        }

        //BOTTOM-LEFT
        str+="\n\tBottom Left: ";
        for (let i = 1; i <= Math.min(seatMap.length-this.x-1, this.y); i++) {
            let elem = seatMap[this.x+i][this.y-i];
            if(analyzeElem(elem)) break;
        }
        if(debug) console.log(str);
        return count;

        function analyzeElem(elem){
            str+=elem.icon;
            if (elem.seat) {
                if (elem.occupied)
                    count++;
                return true;
            }
            return false;
        }
    }

}

function composeSeatMap(lines) {
    return [...lines].map((line, i) => {
        let iconsInLine = line.split("");
        return iconsInLine.map((icon, j) => {
            return new Spot(i, j, icon);
        })
    });
}
function viewSeatMap(seatMap, print = true) {
    let printedMap = seatMap.map(lines => {
        return lines.map(seat => seat.icon).join('');
    }).join('\n');
    if (print) console.log(printedMap);
    return printedMap;
}

function revisitSeatMap_part1(seatMap) {
    let newSeatMap = seatMap.map(e => e.map(x => new Spot(x.x, x.y, x.icon)))
    for (let i = 0; i < seatMap.length; i++) {
        for (let j = 0; j < seatMap[0].length; j++) {
            let s = seatMap[i][j];
            //console.log(s.printSurrounding(seatMap));
            if (s.seat && !s.occupied && s.countAdjacentOccupied(seatMap) == 0)
                newSeatMap[i][j].takeSpot();
            if (s.seat && s.occupied && s.seat && s.countAdjacentOccupied(seatMap) >= 4)
                newSeatMap[i][j].leaveSpot();
        }
    }
    return newSeatMap;
}

function revisitSeatMap_part2(seatMap) {
    let newSeatMap = seatMap.map(e => e.map(x => new Spot(x.x, x.y, x.icon)))
    for (let i = 0; i < seatMap.length; i++) {
        for (let j = 0; j < seatMap[0].length; j++) {
            let s = seatMap[i][j];
            //console.log(s.printSurrounding(seatMap));
            //console.log(`${s.x}.${s.y}`);
            if (s.seat && !s.occupied && s.countOnAllDirections(seatMap) == 0)
                newSeatMap[i][j].takeSpot();
            if (s.seat && s.occupied && s.countOnAllDirections(seatMap) >= 5)
                newSeatMap[i][j].leaveSpot();
        }
    }
    return newSeatMap;
}

function countOccupiedSeats(seatMap) {
    return seatMap
        .reduce((t, e) => {
            return t + e.filter(x => x.occupied).length
        }, 0);
}
function day11(input) {
    let seatMap = composeSeatMap(input);
    current = viewSeatMap(seatMap);
    let count = 0;
    do {
        current = viewSeatMap(seatMap, false);
        seatMap = revisitSeatMap_part1(seatMap);
        next = viewSeatMap(seatMap);
        count++;
    } while (current != next)

    console.log(count);

    let response = countOccupiedSeats(seatMap);
    console.log(response);
    return response;
}


function day11_2(input) {
    let seatMap = composeSeatMap(input);
    current = viewSeatMap(seatMap);
    let count = 0;
    do {
        current = viewSeatMap(seatMap, false);
        seatMap = revisitSeatMap_part2(seatMap);
        next = viewSeatMap(seatMap);
        count++;
    } while (current != next)

    console.log(count);

    let response = countOccupiedSeats(seatMap);
    console.log(response);
    return response;
}

//day11(input);
day11_2(input);

function getLiteralInput() {
    return `
    LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.L.LLLLL.LLLL.LLLLLLLLL..LLL.LLLLLLLLLLLLLL.LLLLLLLLL.LLL.LLLLLL
LLLLLLLLLL.L.LLLLLLL.LL.LLLLLLL.LLLLLLLL.LLLLLLLLLLLLL.LLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLL.L.LLLLLLLLLLLL.LLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLL
.LLLLLLLLLLLLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLL.LLL.LLLLLLLLLL.LLLLLL.LLLLLLLL.LLLLLL.LLLLL.LLLLLL
LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLL.LLLLL.LL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLL
LLL.LL..L..L.LL.L.L........L.............LLL....LL...L..L.L.....L..L.L.......L..L......LLLL.L.L
LLLLLLLLLLLLLLLLL..LLLL.LLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLL.LLLLLLLLLLLLLLL.LLLLLLL.LLLLL.LLLLL
LLLLLLLLLL.LLLL.LL.LLLL.LLLLLLLLLLLLLLLLLL.L.LLLLLLLLL.LLLL.L.L.LL.LLLLLLLLLLLLL.LL.LLLLLLLLLLL
LLLLLLLLLLLLLLLLL.LLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLLLLLLLLLLL.LL.LLLLLLLLL.LLLLL.
LLLLLLLLLLLLLLLLL..LLL.LLLLLLLLLLLLLLL.LLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLL.LLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLL.LLL.L..LLLLLLLL.LLLL.LLLLLL..LLLLLLLLLLLLLLL.LLLL.LLLLLL
L.LLLLLLLL..LLLLLL.LLLL.LLLLLLLLLLLLLL.LLLLL.LLLLLLLLLLLLLL.LLLLLLLLL.LLLLL.LLLLLLL.LLLL.LLLLLL
.LLLLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLL
LL.L..LL...LL..L..L.L.L.....L..LL...L.LLL......L.L...L.LL...L.L.L.........L.LL....L.LL.LL...LL.
LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLL.LLLLLL.L.LLLLLLLLLLLLLL.LLL..LLLLLL
LLLLL.LLLL.LLLL.LLLLLLLLLLLLLLL.LLLLLL.L.LLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LLLLLLL
LLL.LLLLLL.LLLLLLL.LLLL.LLL.LLL.LLLL.L.LL.LLLLLLLLLLLL.LLLL.LLL.LL.LLLLLLLLLLLLLLLLLLLLL.LL.LLL
LLLLLLLLLL.LLL.LLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLL
...L...L..L.L...L..L......L.......L.L...L...L...L.....L...L...L....L...LL..L..L.............LL.
LLL..LLLLL.LLLLLLLLLLLL.LLLLLLL.LLLLLL.LLLLLLLLLLL.LLL.LLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLL.LLLLL
LLLLLLLLLL.LLL..LLLLLLL.L.LLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLL.LLL.LLLLLLLLLLLLLLLLLLLLLLLL
LLLLLL.L.L.L.LLLLLLLLLL.LLLLLLL.LLLLLL.LLLLL.LLLLLLLLLLLLLL.LLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLL.
LLLLLL.LLL.LLLLLLLLLLLL.LLLLLLL.L.LLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLL.LLL.LLLL.LLLLLLL.LLLL.LLLLL.
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLL.LLL.LLLLL.L.LL.LLLLLL.LLLLLLLL..LLLLLLLLLLL.LLLLLL
LLLLLL.LLL.LLLLLLL.LLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLL..LLLLLLLLL.LL.LLLLLL
LLLLLLLLLLLLLLLLLLLLLL..LLLLLLL.LLLLLL.LLLLL.LL.LLLLLL.LLLLLLLLLLL.LLLLL.L.LLLLLLLLLLLLL.LLLLLL
LLLLLLLLLL.LLLLLLLLLLLL.LLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LL.LLLL.LLLL.LLLLLL
.L......L..L........LL..LLL...LL.L.....L..L.L..LLL..LLL..LL.LL...LLL.......L...LL...........LLL
LLLLLLLLLL.LL.LLLL.LLLL.LLLLLLL.LLLLL.LLLLLL.LLLLLLLLL.LLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLL.LLLLL.LLL.LLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLL..LLLLLL.LLLLLLLLLLLLLLL.LL.L.L.LLLLLLLLLLLLL.LLLLLLL.LLL..LLLLLL
LLLLLL.LLL.LLLLLLL.LLLLLLLLL.LL.LLLLLL.LLLLLLLLLLLLLLL.LLLL.LLLLLL.LLL.LLLL.LLLLLLL.LLLL.LLLLLL
LLLLLLLLLLLLLLLL.L.LLLL.LLLLLL..LLLLLLLLLLLL.LLLLLLL.L.LLLLLLLLLLL.LLLLLLLL.LLLLLLL.LLLL..LLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLLL.LLLLLL.LL.LLLLL.LL.L.LL.LLLLLLLLLLL
LLLLLL.LLL.LLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLL.LLLLLLLLL.LLL.LLLLLLL.LLLLLLLLLLLLLLL..LLLL.LLLLLL
LL.LLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLL.LLLLLLLL.LLLLLLLLLLLLLL.LLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLL.LLL.LLLLLL.LLLL..LLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLL
........LL.L..LLLL..L..LLLL..LLL.........L.L......LL.LL..L........L...L..LL..LLLL.L.L.....L.LL.
LL.LLLLLLL.LLLLLLL.LLLL.LLLL.LL.LLLLLLLLLLLLLLLLLLLLLL.LLLL.LLLLL..LLLLLLLLLLLLLLLL.LLLLL.L..LL
LLLLLLLLL.LLLLLLLL.LLL..LLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLL.LLLLLLLLLL.LLLL.LLLL.LLLLLLLLLLLLLL
LL.LLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLL.LLLLLL.LLLLLLL..LLL.LLLLLLLLLL.LLLL
LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLL.LLL.LLL..LLLLLLL.LLLL.LLLLLL
LLL.LLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLL..LLL.LLLLLLLLLL.LLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLL.L
LLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLL.LLLLLLLL.LLLLLLLLLLL.LLLLLL.LL.LLLL..LLLLLLLLLLLLLLLLLLL
..LL..LLL.....LL......L..L.L.LLL........LL......LLL...L......L.LL..L.LL.LL.L.......LL....LL...L
.LL.LLLLLLLLLLLLLL.L.LL.LLLLLLL.LLL.LL...L.L.LLLLLLLLL.LLLLLLLLLLLLL.LLLLLL.LLLLLLL.LLLL.LLLLLL
L.LLLLLLLLLLLL.LLL.LLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLL.LLLLLLLL.LLL.LLLL.LLL.LLL.LLLL.LLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLL..L.LLLL.LLLLLLLL..LLL.LLLLLLL.LLLLLL
.LLLLLLLLL.LLL.LLL.LLLL.LLL..LLLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLL
L..L...LL...L.LL....L.LL.L..LL.L.........L.........LLLL..L.L..LL...L.L.L....LLL.....L..L.L...LL
.LLLLLLLLL.LLLL.LL.LLLL.LLLLLLLLL.LLLL.LLLLL.LLL.LLLLL.LLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLL
LLLLLLLLLL.L..LLLL.LLLL.LLLLLLL..LLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLLLLLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLLLLL.LLLLL.LLLLLLLLLLLL.LLLLLLLL.LLLLLLL.LL.LLLLL.LL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLL
L.LLLLLLLL.LLLLLLLLLLLL.LLLL.LL..LLLLL.LLLL.LLLLLL.LLLLLLLL.LLL.LLLLLLLLLLLLLLLLL.L.LLLL.LLLLLL
LLLLLLLLLL..LLLLLL.LLLLLLLLLLLL.L.LLLL.LLLLLLLLLLLLLLL.LLLL.LLLLLL..LL.LLLL.LLLLLLL.LLLL.LLLLLL
LLL.LLLLLLLLLLLLLL.LLLLLLLLLLLL.LL.LLL.LLLLL.LLLLL.LLL.LLLL.LLLLLL.LL.LLLL..LLLLLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLLLLLLL.LLLLLLL.LLLLLL.LLLLL.LLLLLLLL..LLLL.LLLLLLLLLLLLLLL.LLLLL.LLLLLL.LLLLLL
L.L...L...L..L..L....L...L..LLL..L....L..LL...LLL.LL.L...L.L..L.LLL..L....L.L...LL..L..L.L..L.L
LLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLL
LLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLL.LLL.L
LLLLLLLLLL.LLLLL.L.LLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLLLLLLL.LLLL.LLLLLLLLL
L..LLLLLLLLL.LLLLL.L.LLLLLL.LLL.LLLLLL.LLLLLLLLLLLLLLL.LLLL.LLLLLL.LL.LLLLLLLLLLLLL.LLLLLLLLLLL
LLLLL.LLLL.LLLL.LL.LLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLL.LL.L.LLL.LLLLLLLLL.LL.LLLL.LLLLLL
....L....L..L.....L....L..LL....L.L..L..LL.LLL...L.....L.LLL.L.LL.....L....L.L........L.LLL....
L.L.LL.LLL.LLLLL.L.LLLL.LLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLL.LLLLLLLL.LLLLLLLLLLL.LL.LLLL.LLLLLL
LLLLLLLLL.LLLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLL.LL.LLLLLL.LLLL.LLLLLL.LLLLLLL.LLLLLLLL.LLLL.LLLLLL
LLLLLLLLL.LL.LLLLLLLLLL.LLLL.LLLL.LLLLLLLLLLLLLLLLLLLL..LLL.L..LLL.LLL.L.LL.LLLLLL..LLLL.LLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLL
LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLL.LLLLLLLLLLLL.LL.LLLLLLL.LLLL.LLLLLL
.....LL.LL.L.....LL.LL..L...L...LLLLL......L.L....LL...LLL...LLLLL..LL..L....L......L.......L.L
LLLLLLLLLL.LLLL.LL.LLLL.L.LLLLL.LLLLLL.LL.LL.LLLLLLLLL.LLLL.LLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLL.LL.LLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLL.L
LLLL.LLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLLL..LLLLLLL.L.LL..LLLLLLLLLLLLL.LLLLL.LLLLLLLLLLLLLL.LLL.LL.LLLLLLLL.LLLL.LLLLLLLLLLLLLL
LLLLLLLLLLLLL.LLLLLLLLL.LLLLLL..LLLLLL.LLLLL.LLLLLLLLLLL.LLLLLLLLLL.LLLLLLL.LLLLLLL.LLLLLLLLLLL
..LLL..L..L...L..L..L.L.....L............L.....L..L....L.LL......L.....L..LLL..L.L..L..........
LLL.LLLLLL.LLLLLLLLLLLL.LL.LLLLLLLLLLL.LLLLLL.LLLLLLL..LLLL.LLLL.L.L.LLLL.LLLLLLLLLLLLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLL.LLLLLL.LL.LL.LLLLLLLLLL.LLL.LL.LLLLLLLLLLLL.LLLLLLLLLLLL.LLLLLL
.LLLLLLLLL.LLLL.LLLLLLLLLLLLL...LL.L.LLLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLL.L.LLLLLL
LLLL.LLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLLL.LLLLL.LLLLL.LLL.LLLL.LLLLLLLLLLLL.LLLLL.LLLLLLLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLLL.LLL.L.LLLLLLLL.LLLLLL..LLLLLLLLLLL
.LLLLLLLLL.LLLLLLL.LLLL.LLLLLL..LLLLLL.LLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLL
.L.....LL......L........L.L....LLL......L...L.LL...L...L..LL................L...L..L...........
LLLLLLLLLL.LLLLLLL.LLLL.LLLL.LL.LLLLLL.LLLL..LLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLL.LL.LLL.LLLLLLL
LLLLLL.LLL.LLLLLL..LLL..LLLLLL..LLLLLL.LLLL..LLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLL..LLLLLLLLLL
LLLLLL..LL.LLLLLLL.LLLL.LLLL.LL.LLL.LL.LLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLLLLLLLLLL.LLLLLL.LLLLLLLLLLLLLLL.LL.L.LLLLLL.L.LLLLLL.LLLLLLLLLLLLLLLL.LL
LLLLLLLLLL.LLLLLL.LLLLLLL.LLLLL.LLLLL.LLLLLL.L.LLLLLLL.LL.LLLLLLLLLLL.LLLLLLLLLLLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLL.LLLL..LLLLLLLLL.LLLLLLLLLLLLL.LLLLLL.LLLLLLL.LL.L.LLLLLL
LLLLL.LLLL.LLLLLLL..LLLLLLLLLLL.LLLLLL.LLL.L.L.LLLLLLLLLLLL.LLLL.L.LLLLLLLL.LLLLLLL.LLLLLLLLLLL
....LLL...LLL.....L.L...LL...L..L....LL...L.L.LLLLL....L......LLLL......L..LLLLL.L.LL...LL..LLL
LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LL.LLL.LLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLL
LLLLLLLLLLLLLLLLLL.LLLLLLLLLLLL.LLLLLL.LLLLL.LLLLLLLLL.LLLL.LLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLL
.LLLLLLLLL.L..LLLLLLLLLLLLLLLLL.LLLLLL.LLLL..LLLLLLLLL.LLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLL
LLLLLLLLLL.LLLLLLL.LLLL.L.L.LLLLLLLLLL.LLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL.LLL.LLLL.LLL.LLLLLL
LLLLLLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLL.LLLLLL.LLLLLLLL..LLLLLL.LLLL.L.LLLL`;
}