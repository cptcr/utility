const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    User: { type: String }
});

module.exports = mongoose.model("whitelist", Schema);