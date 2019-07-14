const mongoose = require('mongoose');

const { Schema } = mongoose;

const RidkDataSchema = Schema({
    severity: {
        type: String,
        trim: true,
        index: true,
        required: 'severity field is required'
    },
    type: {
        type: String,
        trim: true,
        index: true,
        required: 'type field is required'
    },
    sourceType: {
        type: String,
        trim: true,
        index: true,
        required: 'sourceType field is required'
    },
    networkType: {
        type: String,
        trim: true,
        index: true,
        required: 'networkType field is required'
    },
    date: {
        type: Date,
        required: 'date field is required'
    },
});

const RidkData = mongoose.model('Data', RidkDataSchema);

module.exports = {
    RidkData
};
