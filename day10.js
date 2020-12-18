try {
    input = document.getElementsByTagName("pre")[0].innerText;
} catch (e) {
    input = getLiteralInput();
}
input = input.split("\n").filter(e => e.length).map(e => parseInt(e));


function day10(input) {
    input.push(0);
    input.push(Math.max(...input) + 3);
    input = input.sort((a, b) => a - b);
    let dif1 = 0;
    let dif3 = 0;
    for (let i = 0; i < input.length - 1; i++) {
        if (input[i + 1] - input[i] === 3) dif3++;
        if (input[i + 1] - input[i] === 1) dif1++;
    }
    console.log(`${dif1} differences of 1\n${dif3} differences of 3`);
    let response = dif1 * dif3;
    console.log(response);
    return response;
}

function day10_2(input) {
    input.push(0);
    input.push(Math.max(...input) + 3);
    input = input.sort((a, b) => a - b);

    let response = 1;


    for (let i = 0; i < input.length; i++) {
        response += checkPath(input.slice(i));
    }

    function checkPath(path) {
        response = 0;
        if(path.length == 3)
            return 1
        for (let i = 0; i < path.length - 2; i++) {
            if (path[i + 2] <= path[i] + 2) {
                response+=checkPath(path.slice(1));
            }
            if (path[i + 3] <= path[i] + 3) {
                response++;
                response+=checkPath(path.slice(2));
            }
        }
        return response;
    }

    console.log(response);
    return response;
}

day10(input);
day10_2(input);

function getLiteralInput() {

    return `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;
    return `178
135
78
181
137
16
74
11
142
109
148
108
151
184
121
58
110
52
169
128
2
119
38
136
25
26
73
157
153
7
19
160
4
80
10
51
1
131
55
86
87
21
46
88
173
71
64
114
120
167
172
145
130
33
20
190
35
79
162
122
98
177
179
68
48
118
125
192
174
99
152
3
89
105
180
191
61
13
90
129
47
138
67
115
44
59
60
95
93
166
154
101
34
113
139
77
94
161
187
45
22
12
163
41
27
132
30
143
168
144
83
100
102
72`;
}