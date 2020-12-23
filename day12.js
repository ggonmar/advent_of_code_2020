try {
    max = 1450;
    //loadResources();
    input = document.getElementsByTagName("pre")[0].innerText;
} catch (e) {
    input = getLiteralInput(false);
}
input = input.split("\n").filter(e => e.length);

class Action {
    constructor(code, number) {
        this.action = code;
        this.amount = number;
    }

}

class Vector{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    moveNorth(y)
    {
        this.y+=y;
        return this;
    }
    moveSouth(y)
    {
        this.y-=y;
        return this;
    }
    moveWest(x)
    {
        this.x-=x;
        return this;
    }
    moveEast(x)
    {
        this.x+=x;
        return this;
    }
    rotateLeft(x){
        let ang = -x * (Math.PI/180);
        var cos = Math.cos(ang);
        var sin = Math.sin(ang);
        let newVector= new Vector(Math.round(10000*(this.x * cos - this.y * sin))/10000,
            Math.round(10000*(this.x * sin + this.y * cos))/10000);
        this.x=newVector.x;
        this.y=newVector.y;
        return this;
    }
    rotateRight(x)
    {
        return this.rotateLeft(-x);
    }

    add(adder){
        this.x += adder.x;
        this.y += adder.y;
    }

    moveInDirection(wayPoint, amount){
        this.add(wayPoint.times(amount));
    }

    times(e){
        return new Vector(this.x * e, this.y * e);
    }

    copy(){
        return new Vector(this.x, this.y);
    }

}
function processInput(input) {
    return input.map(e => {
        let letter = e.substr(0, 1);
        let value = parseInt(e.substr(1));
        return new Action(letter, value);
    })
}

function day12(input) {
    let actions = processInput(input);
    console.log(`Movements: ${actions.length}`)
    let n = 0;
    let e = 0;

    from = [500, max - 30];
    to = [500, max - 30];
    let pointingTo = 90;  // 0 is north. 90 is east. 180 is south. 270 is west.

    for (let action of actions) {
        if (action.action === "F") {
            if (pointingTo == 0)
                action.action = "N";
            if (pointingTo == 90)
                action.action = "E";
            if (pointingTo == 180)
                action.action = "S";
            if (pointingTo == 270)
                action.action = "W";
//            console.log(`Moving Forward: direction ${action.action}`);
        }
        if (action.action === "N") {
            n += action.amount;
            to[0] += action.amount;
        } else if (action.action === "S") {
            n -= action.amount;
            to[0] -= action.amount;
        } else if (action.action === "E") {
            e += action.amount;
            to[1] += action.amount;
        } else if (action.action === "W") {
            e -= action.amount;
            to[1] -= action.amount;
        } else if (action.action === "L") {
            pointingTo -= action.amount;
            pointingTo = pointingTo % 360;
            if (pointingTo < 0) pointingTo += 360;
            // console.log(`ROTATING LEFT ${action.amount}.\tNow (${n},${e}... ${pointingTo})`);
        } else if (action.action === "R") {
            pointingTo += action.amount;
            pointingTo = pointingTo % 360;
            // console.log(`ROTATING RIGHT ${action.amount}.\tNow (${n},${e}... ${pointingTo})`);
        }

//        console.log(`Moving from ${from.join(',')} to ${to.join(',')}`);
       // $('#navigation').line(from[0], from[1], to[0], to[1]);
        from = to.slice();

    }

    console.log(`E: ${e}, N: ${n}`);

    let response = Math.abs(n) + Math.abs(e);
    console.log(response);
    return response;
}

function day12_2(input) {
    let actions = processInput(input);
    console.log(`Waypoint moves: ${actions.length}`);
    let wayPoint=new Vector(10,1);
    let boatPosition=new Vector(0,0);
    let graphPosition=new Vector(500, max-30);
    let nextPosition =new Vector(500, max-30);

    for (let action of actions) {
        if (action.action === "F") {
            boatPosition.moveInDirection(wayPoint, action.amount);
            nextPosition=boatPosition.copy();
        }
        if (action.action === "N") {
            wayPoint.moveNorth(action.amount);
        } else if (action.action === "S") {
            wayPoint.moveSouth(action.amount);
        } else if (action.action === "E") {
            wayPoint.moveEast(action.amount);
        } else if (action.action === "W") {
            wayPoint.moveWest(action.amount);
        }
        else if (action.action === "R") {
            wayPoint.rotateRight(action.amount);
        }
        else if (action.action === "L") {
            wayPoint.rotateLeft(action.amount);
        }

//        console.log(`Moving from ${from.join(',')} to ${to.join(',')}`);
        $('#navigation').line(graphPosition.x, graphPosition.x, nextPosition.x, nextPosition.y);
        graphPosition = nextPosition.copy();
    }
    console.log(`E: ${boatPosition.x}, N: ${boatPosition.y}`);

    let response = Math.abs(boatPositionNorth) + Math.abs(boatPositionEast);
    console.log(response);
    return response;
}

//day12(input);
day12_2(input);

function getLiteralInput(dummy = false) {
    if (dummy) return `F10
N3
F7
R90
F11`;

/*    return `W5
N3
W4
F2
N3
R180
E2
S4
E5
N4
E2
L90
F81
E5
R180
E2
F88
L90
N4
E1
F90
S3
W3
R90
F80
E4
F28
R180
S1
F80
E4
F18
S5
W4
F13
R90
S3
W5
N2
F76
L90
N4
F49
L180
E5
R90
F51
E4
L180
F86
S5
L180
F3
E5
W1
R90
F54
N4
E5
R90
E4
N3
W1
E4
R180
W2
F2
S5
W4
E3
R90
F49
R90
W5
N3
F47
E1
L90
E2
F86
E3
R90
F100
F84
N2
F12
L90
N4
W5
F40
N5
F68
W3
R90
W4
N1
F63
W5
S3
F52
R180
W1
W4
L90
N4
R90
S4
L90
F77
R90
E5
F20
N3
W5
R90
E5
R180
F63
S1
W1
W5
F12
E5
L90
N4
F83
W4
F92
W2
F41
E3
S5
R90
S5
W2
N1
F4
N1
F50
L180
F73
N2
L90
E2
S5
F19
L90
E1
N4
L90
S2
L90
F90
L90
N3
E1
F32
E1
F66
R180
E1
S2
F72
R90
S2
E1
N3
F24
W4
F32
W5
S3
E2
F52
W5
F54
E4
F97
N1
R90
W3
R180
E2
S3
R90
N1
N3
F76
R90
F43
E3
N4
L90
E4
F32
E4
S3
F46
R90
N4
E5
L90
F33
W1
W1
N1
E3
S1
R90
W3
L90
F59
W3
S1
F7
W3
F85
R90
F61
E5
S5
F25
F8
L90
N3
F80
W4
F89
N3
E5
N5
L90
F50
F19
L90
N2
R90
F8
W5
S5
L90
F63
S5
S2
F44
N1
W1
L90
R90
W2
F24
W3
S4
R90
F69
E5
F77
W4
F38
R180
W3
S5
N2
F91
F44
N2
W2
R90
W5
F48
W3
R90
F74
E4
S3
R90
E3
L90
F81
W1
F69
W2
N3
R90
E1
R90
L90
E5
S4
E2
S5
F58
N3
F50
L90
N1
L90
N4
L180
W2
L90
F61
L90
S5
E1
S4
W1
S3
E4
F62
S2
L270
F97
R90
S5
L180
F66
E1
R90
E3
L180
F98
R90
F37
R90
F18
N3
R90
E2
S3
L90
S4
F82
W3
F72
N1
E4
F67
L90
W1
S2
F94
R90
F62
N4
W2
S5
R180
F41
W5
F9
W2
F34
L90
N3
R90
F1
N4
E4
R90
F39
S5
W5
N5
R180
F32
W5
F97
R90
N4
W3
R90
N4
W2
N5
W5
R90
S4
L90
F99
N2
R90
E4
N5
E1
F67
R180
W3
S2
E2
F95
E1
S1
W5
S3
E2
F64
L90
F29
S3
F33
F46
S2
R90
N4
E1
F11
F50
L90
E2
F72
L180
N2
E4
N1
E3
S1
F37
W1
R90
N3
L90
W3
F62
R90
F88
W1
S4
E3
L90
S4
R90
E4
S2
F81
W5
F82
L90
F19
R90
R270
E4
F27
R90
N1
W3
R90
W1
S4
L90
W1
F24
L180
R90
S1
E3
S4
L90
E3
F71
R180
S1
F33
S1
F49
S1
R180
E4
L180
F44
R90
W2
F26
R90
L180
L180
F31
S3
E4
R90
W1
L90
W1
N5
F25
N3
L180
F4
N3
S5
E4
R90
S2
L90
F28
E4
N3
L90
S1
R90
N4
W1
N2
R180
E4
L90
S5
R180
S5
F14
E3
F38
S2
F1
E1
F46
R270
F69
L180
N1
R90
W5
N4
F22
R90
N1
L180
F16
N2
E1
N4
F68
L90
E2
F6
E2
F2
E4
R90
W4
E2
R90
S1
W1
S5
F87
S5
F9
W5
F91
L90
S2
R270
F73
L90
F17
L90
E4
W1
R90
F40
E5
F7
R180
R90
R180
E5
F89
R180
W2
L180
F31
E2
S1
W2
F11
L180
E1
F55
E5
S4
L90
S5
W4
R180
F23
E3
R90
F12
E3
F3
S3
W3
L90
W2
N5
E2
F77
E4
S3
F11
W4
F23
E1
R90
F61
E3
L90
S3
N5
W2
R180
W2
S2
N5
E1
S2
L90
W3
R90
F89
R270
N3
L90
R90
W4
S2
W4
L90
S1
E4
E4
S3
R270
F47
L90
E1
F10
L180
W4
R90
N2
F97
L180
F82
N5
L90
S1
E3
F14
R90
F23
N2
F34
L270
E2
F77
E5
L90
S3
R270
F12
N1
E3
R90
E2
F4
W3
E3
F33
S4
R180
S5
R90
E1
R270
F53
N4
L90
N1
W2
S5
E2
R180
W2
S3
L90
N4
W3
N3
F84
E5
N3
L90
F48
W4
F18
L90
W3
S4
E2
S4
F64
N1
F96
S3
E5
N4
W2
F22
W5
L90
F23
E2
N1
F92
F16
L180
E4
N1
F75
L90
W4
L270
W3
S4
L90
F29
W4
S2
F47
R90
N3
L90
S3
W3
N1
F45
N2
L90
E4
N1
L90
E3
R90
N3
F86
W1
N5
W3
S5
L90
S4
W2
F44`;
*/
}

