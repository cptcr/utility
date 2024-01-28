const { model, Schema } = require("mongoose");

const schema = new Schema({
    UserID: String,
    Tier: String,
    Email: String,
    Password: String
})

module.exports = model("preregister", schema);