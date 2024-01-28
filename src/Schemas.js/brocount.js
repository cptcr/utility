const {model, Schema} = require("mongoose");

let schema = new Schema({
    User: String,
    Count: Number,
});

module.exports = model("brocount", schema);