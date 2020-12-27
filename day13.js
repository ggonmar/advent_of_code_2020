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

function day13_2(input, start = 0, safelock=1000, silent=true) {
//    let buses = input.split('\n')[1].split(',').map(e => e != 'x' ? parseInt(e) : e);
    let buses = input.split('\n')[1].split(',')
                    .map((e,i)=> {return {index:i, v:e=='x'?'x':parseInt(e)}})
                    .filter(e=> e.v!='x')
                    .sort((a,b)=> b.v - a.v);

    let found = false;
    let t = start;
    t = Math.floor(t/buses[0].v)*buses[0].v-buses[0].index;
    let count=0;
    while (!found && safelock > 0) {
        str=`t=${t} (looped ${count} times.)`+
            `\n\t - Bus ${buses[0].v}: Passing at t+0 (t=${t}, t/${buses[0].v}=${t/buses[0].v})`;
        let valid = true;
        let leapUntilNextBus=0;
        for (let i = 0; i < buses.length; i++) {
            minutesUntilThisBusPassesAgain=Math.floor(t / buses[i].v)*buses[i].v+buses[i].v-t;
            minutesUntilThisBusPassesAgain=minutesUntilThisBusPassesAgain%buses[i].v;
            
            if ( minutesUntilThisBusPassesAgain != buses[i].index) {
                str+=`\n\t - Bus ${buses[i].v} NOT OK: Expected passing at t+${buses[i].index}, but actually at t+${minutesUntilThisBusPassesAgain}. `+
                `(Next passing at ${t+minutesUntilThisBusPassesAgain})`;
                valid = false;
                leapUntilNextBus = Math.max(minutesUntilThisBusPassesAgain - buses[i].index - buses[0].v, buses[0].v);
                break;
            }
            else
            {
                str+=`\n\t - Bus ${buses[i].v} OK: Expected passing at t+${buses[i].index}, actually at t+${minutesUntilThisBusPassesAgain}. `+
                `(Next passing at ${t+minutesUntilThisBusPassesAgain})`;
            }
        }
        if (valid){
            if(!silent) console.log(`ALL GOOD: `+ str);
            found = true;
        }
        else {
            t+=leapUntilNextBus;
            if(!silent) console.log(`REJECTED: `+ str);
            safelock--;
            count++;
        }
    }
    if(found){
        console.log(`ANSWER FOUND: ${t}`);
        return {answer:true, value:t};
    }
    else
    {
        let next=t;
        console.log(`Safelock expired before reaching answer :(. Next number to start from would be ${next}`);
        return {answer:false, value:next};
    }    
}

function day13_2fast(input){

}

day13(input);
//day13_2(input);
console.assert(day13_2(`Something\n7,13,x,x,59,x,31,19`,1068770).value == 1068781  )

console.assert(day13_2(`Something\n17,x,13,19`,      3400      ).value ==  3417    )
console.assert(day13_2(`Something\n67,7,59,61`,      754000    ).value ==754018    )
console.assert(day13_2(`Something\n67,x,7,59,61`,    779000    ).value ==779210    )
console.assert(day13_2(`Something\n67,7,x,59,61`,    1261400   ).value ==1261476   )
console.assert(day13_2(`Something\n1789,37,47,1889`, 1202161400).value ==1202161486)

function getLiteralInput() {
    return `1002578
19,x,x,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,751,x,29,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,x,x,x,x,x,23,x,x,x,x,x,x,x,431,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,17`;
}