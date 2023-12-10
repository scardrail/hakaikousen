export const sensibilitiesResult = function(sensibility) {
    let sensibilitiesCSV = `Attacking;Normal;Fire;Water;Electric;Grass;Ice;Fighting;Poison;Ground;Flying;Psychic;Bug;Rock;Ghost;Dragon;Dark;Steel;Fairy
Normal;1;1;1;1;1;1;2;1;1;1;1;1;1;0;1;1;1;1
Fire;1;0.5;2;1;0.5;0.5;1;1;2;1;1;0.5;2;1;1;1;0.5;0.5
Water;1;0.5;0.5;2;2;0.5;1;1;1;1;1;1;1;1;1;1;0.5;1
Electric;1;1;1;0.5;1;1;1;1;2;0.5;1;1;1;1;1;1;0.5;1
Grass;1;2;0.5;0.5;0.5;2;1;2;0.5;2;1;2;1;1;1;1;1;1
Ice;1;2;1;1;1;0.5;2;1;1;1;1;1;2;1;1;1;2;1
Fighting;1;1;1;1;1;1;1;1;1;2;2;0.5;0.5;1;1;0.5;1;2
Poison;1;1;1;1;0.5;1;0.5;0.5;2;1;2;0.5;1;1;1;1;1;0.5
Ground;1;1;2;0;2;2;1;0.5;1;1;1;1;0.5;1;1;1;1;1
Flying;1;1;1;2;0.5;2;0.5;1;0;1;1;0.5;2;1;1;1;1;1
Psychic;1;1;1;1;1;1;0.5;1;1;1;0.5;2;1;2;1;2;1;1
Bug;1;2;1;1;0.5;1;0.5;1;0.5;2;1;1;2;1;1;1;1;1
Rock;0.5;0.5;2;1;2;1;2;0.5;2;0.5;1;1;1;1;1;1;2;1
Ghost;0;1;1;1;1;1;0;0.5;1;1;1;0.5;1;2;1;2;1;1
Dragon;1;0.5;0.5;0.5;0.5;2;1;1;1;1;1;1;1;1;2;1;1;2
Dark;1;1;1;1;1;1;2;1;1;1;0;2;1;0.5;1;0.5;1;2
Steel;0.5;2;1;1;0.5;0.5;2;0;2;0.5;0.5;0.5;0.5;1;0.5;1;0.5;0.5
Fairy;1;1;1;1;1;1;0.5;2;1;1;1;0.5;1;1;0;0.5;2;1`
    // Split the CSV into rows
    let rows = sensibilitiesCSV.split('\n');
    // Use the first row for the keys
    let headers = rows[0].split(';');

    let sensibilities = {};

    for (let i = 1; i < rows.length; i++) {
    let values = rows[i].split(';');
    let name = values[0];
    let object = {};
    
    for (let j = 1; j < headers.length; j++) {
        object[headers[j]] = values[j];
    }
    sensibilities[name] = object;
    }

    return sensibilities[sensibility];
}