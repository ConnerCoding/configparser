const fs = require("fs");

function parseFile(data) {
    let index = 0;

    // The character being looked at
    let char = data[index];

    const result = {};

    // Possible states: default(transition state), key, value, comment
    let state = "default";

    let keyName = "";
    let value = "";

    while (index < data.length) {
        // Skip over whitespace
        if (char === "\t" || char === " ") {
            index++;
            char = data[index];
            continue;
        }

        if (state === "default") {
            if (char === "#") {
                state = "comment";
            } else {
                state = "key";
                // Move back so we don't skip the first letter
                index--;
            }
        } else if (state === "key") {
            if (char !== "\n" && char !== "=") {
                keyName += char;
            } else if (char === "\n") {
                // If key has no value, we skip
                keyName = "";
                state = "default";
            } else {
                state = "value";
            }
        } else if (state === "value") {
            if (char !== "\n") {
                value += char;
            } else {
                // End of line
                result[keyName] = value;
                keyName = "";
                value = "";
                state = "default";
            }
        } else if (state === "comment") {
            // Pass over comment
            while (data[index] !== "\n") {
                index++;
            }
            state = "default";
        }
        index++;
        char = data[index];
    }
    return result;
}

const data = fs.readFileSync("./data.dat", "utf8");

const output = parseFile(data);

function getValue(key) {
    let value = output[key];
    if (value === "yes" || value === "on" || value === "true") {
        value = true;
    } else if (value === "no" || value === "off" || value === "false") {
        value = false;
    } else if (!isNaN(parseFloat(value))) {
        value = parseFloat(value);
    }
    return value;
}

// Lookup value using key name
const value = getValue("server_id");
console.log(value);