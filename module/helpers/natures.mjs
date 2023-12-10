export const naturesResult = function(nature) {
    let naturesCSV = `Nature;FOR;END;CON;VOL;DEX;favTaste;detTaste
bold;-1;1;0;0;0;spicy;sour
quirky;0;0;0;0;0;none;none
brave;1;0;0;0;-1;sour;sweet
calm;-1;0;0;1;0;bitter;sour
quiet;0;0;1;0;-1;dry;sweet
docile;0;0;0;0;0;none;none
mild;0;-1;1;0;0;dry;spicy
rash;0;0;1;-1;0;dry;bitter
gentle;0;-1;0;1;0;bitter;spicy
hardy;0;0;0;0;0;none;none
jolly;0;0;-1;0;1;sweet;dry
lax;0;1;0;-1;0;spicy;bitter
impish;0;1;-1;0;0;spicy;dry
sassy;0;0;0;1;-1;bitter;sweet
naughty;1;0;0;-1;0;sour;bitter
modest;-1;0;1;0;0;dry;sour
naive;0;0;0;-1;1;sweet;bitter
hasty;0;-1;0;0;1;sweet;spicy
careful;0;0;-1;1;0;bitter;dry
bashful;0;0;0;0;0;none;none
relaxed;0;1;0;0;-1;spicy;sweet
adamant;1;0;-1;0;0;sour;dry
serious;0;0;0;0;0;none;none
lonely;1;-1;0;0;0;sour;spicy
timid;-1;0;0;0;1;sweet;sour
none;0;0;0;0;0;none;none`
    // Split the CSV into rows
    let rows = naturesCSV.split('\n');
    // Use the first row for the keys
    let headers = rows[0].split(';');

    let natures = {};

    for (let i = 1; i < rows.length; i++) {
    let values = rows[i].split(';');
    let name = values[0];
    let object = {};
    
    for (let j = 1; j < headers.length; j++) {
        object[headers[j]] = values[j];
    }
    natures[name] = object;
    }

    return natures[nature];
}