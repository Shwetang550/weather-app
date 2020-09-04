const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Course', courseSchema);