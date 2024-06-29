const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectUrl: {
        type: String,
        required: true,
    },
    visitHistory: [{
        timestamps: {
            type: Date,
            default: Date.now,
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true }
); 

const URL = mongoose.model('URL', urlSchema);
module.exports = URL;
