const mongoose = require('mongoose');

const indexSchema = new mongoose.Schema({
    username: { //single-field + unique
        type: String,
        required: true,
        unique: true
    },
    email:{ //unique index
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    tags: [String], //multikey index
    description: String, // text index
    location:{
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // longitude,latitude
        },
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
},
    { timestamps: true }
);

//indexing

indexSchema.index({ firstName: 1, lastName: 1 }); //compound index

indexSchema.index({ tags: 1 }); //multikey index

indexSchema.index({ description: "text" }); //text index

indexSchema.index({ location: "2dsphere" }); //geospatial index

indexSchema.index({ status: 1 }, { partialFilterExpression: { status: "active" }}); //partial index

module.exports = mongoose.model("Index",indexSchema);