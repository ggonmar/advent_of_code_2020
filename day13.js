try {
    input = document.getElementsByTagName("pre")[0].innerText;
} catch (e) {
    input = getLiteralInput();
}

//input = input.split("\n").filter(e => e.length);

function day13(input) {
    let timestamp = parseInt(input.split('\n')[0]);
    let buses = input.split('\n')[1].split(',').filter(e => e != "x").map(e => parseInt(e)).sort((a, b) => a - b);
    let bestCandidate = {bus: 0, waitTime: Math.max(...buses) + 1};
    for (let bus of buses) {
        let loopsOfThisBus = Math.floor(timestamp / bus);

        let timeLeftForThisBus = (loopsOfThisBus + 1) * bus - timestamp;
        if (timeLeftForThisBus < bestCandidate.waitTime)
            bestCandidate = {bus: bus, waitTime: timeLeftForThisBus}
    }

    console.log(`Best candidate is bus ${bestCandidate.bus}. I'll have to wait ${bestCandidate.waitTime} minutes.`)
    let response = bestCandidate.bus * bestCandidate.waitTime;
    console.log(response);
    return response;
}

function day13_2(input, start = 0) {
    let buses = input.split('\n')[1].split(',').map(e => e != 'x' ? parseInt(e) : e);
    let found = false;
    let t = start;
    let patchlock = 100;
    while (!found && patchlock > 0) {
        let valid = true;
        for (let i = 0; i < buses.length; i++) {
            if(buses[i]=='x') continue
            let loopsForThisBus =Math.floor(t / buses[i]);
            let timeLeftForThisBus = (loopsForThisBus + 1) * buses[i] - t;
            if ( buses[i] != timeLeftForThisBus) {
                valid = false;
                break;
            }
        }
        if (valid)
            found = true;
        else {
            t++;
        }
        patchlock--;
    }
    console.log(t);
}

day13(input);

//day13_2(input);
day13_2(`asqw
7,13,x,x,59,x,31,19`,1068770)

function getLiteralInput() {
    return `1002578
19,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,751,x,29,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,x,x,x,x,x,23,x,x,x,x,x,x,x,431,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,17`;
}