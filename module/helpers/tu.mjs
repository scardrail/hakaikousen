export const uniqTableResult = function(margin, disability) {
    let uniqTableCSV = `"Marge";100;95;90;85;80;75;70;65;60;55;50;45;40;35;30;25;20;15
-10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10
-9;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10
-8;9;9;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10;10
-7;9;9;9;9;10;10;10;10;10;10;10;10;10;10;10;10;10;10
-6;8;8;9;9;9;9;10;10;10;10;10;10;10;10;10;10;10;10
-5;8;8;8;8;9;9;9;9;10;10;10;10;10;10;10;10;10;10
-4;7;7;8;8;8;8;9;9;9;9;10;10;10;10;10;10;10;10
-3;7;7;7;7;8;8;8;8;9;9;9;9;10;10;10;10;10;10
-2;6;6;7;7;7;7;8;8;8;8;9;9;9;9;10;10;10;10
-1;6;6;6;6;7;7;7;7;8;8;8;8;9;9;9;9;10;10
0;6;6;6;6;6;6;7;7;7;7;8;8;8;8;9;9;9;9
1;6;6;6;6;6;6;6;6;7;7;7;7;8;8;8;8;9;9
2;5;5;6;6;6;6;6;6;6;6;7;7;7;7;8;8;8;8
3;5;5;5;5;6;6;6;6;6;6;6;6;7;7;7;7;8;8
4;4;4;5;5;5;5;6;6;6;6;6;6;6;6;7;7;7;7
5;4;4;4;4;5;5;5;5;6;6;6;6;6;6;6;6;7;7
6;3;3;4;4;4;4;5;5;5;5;6;6;6;6;6;6;6;6
7;3;3;3;3;4;4;4;4;5;5;5;5;6;6;6;6;6;6
8;2;2;3;3;3;3;4;4;4;4;5;5;5;5;6;6;6;6
9;2;2;2;2;3;3;3;3;4;4;4;4;5;5;5;5;6;6
10;1;1;2;2;2;2;3;3;3;3;4;4;4;4;5;5;5;5
11;1;1;1;1;2;2;2;2;3;3;3;3;4;4;4;4;5;5
12;1;1;1;1;1;1;2;2;2;2;3;3;3;3;4;4;4;4
13;1;1;1;1;1;1;1;1;2;2;2;2;3;3;3;3;4;4
14;1;1;1;1;1;1;1;1;1;1;2;2;2;2;3;3;3;3
15;1;1;1;1;1;1;1;1;1;1;1;1;2;2;2;2;3;3
16;1;1;1;1;1;1;1;1;1;1;1;1;1;1;2;2;2;2
17;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;2;2
18;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1
19;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1`
    // Split the CSV into rows
    let rows = uniqTableCSV.split('\n');
    // Use the first row for the keys
    let headers = rows[0].split(';');

    let uniqTable = {};

    for (let i = 1; i < rows.length; i++) {
    let values = rows[i].split(';');
    let name = values[0];
    let object = {};
    
    for (let j = 1; j < headers.length; j++) {
        object[headers[j]] = values[j];
    }
    uniqTable[name] = object;
    }
    // console.log(uniqTable);
    
    //adjust values to making it fitting values of the table
    disability = Math.ceil(disability);
    margin = Math.ceil(margin);

    if (disability > 100) {disability = 100}
    else if (disability < 15) {disability = 15}
    if (margin > 19) {margin = 19}
    else if (margin < -10) {margin = -10}

    // console.log(uniqTable[margin][disability]);
    return uniqTable[margin][disability];
}