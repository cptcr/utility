const { model, Schema } = require("mongoose");

let schema = new Schema({
    User: String,
    Message: String,
    Reason: String,
    Guild: String,
    Target: String,
});

module.exports = model("report_user", schema);