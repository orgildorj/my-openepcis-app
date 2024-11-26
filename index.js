const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

const app = express();
app.use(express.json());

// Create and connect to the SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

const speedBumpSchema = require("./speedBumpSchema.json");

const speedBumpEvent = {
    type: "ObjectEvent",
    eventTime: "2024-04-05T13:20:00Z",
    bizLocation: {
        id: "urn:epc:id:sgln:0614141.00777.0",
        latitude: 40.7128,
        longitude: -74.006,
    },
    speedBumpMaterial: "asphalt",
    dimensions: {
        height: 0.1,
        width: 1.5,
    },
    bizStep: "installation",
};

const validate = ajv.compile(speedBumpSchema);
const valid = validate(speedBumpEvent);

console.log(valid);

app.post("/validate", (req, res) => {
    const eventData = req.body;

    const valid = validate(eventData);
    if (valid) {
        res.status(200).send({ message: "EPCIS event is valid!" });
    } else {
        res.status(400).send({
            message: "Validation errors",
            errors: validate.errors,
        });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
