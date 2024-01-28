const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    Count: Number,
    ID: String,
})

module.exports = mongoose.model("registercount", schema)