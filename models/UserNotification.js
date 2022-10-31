const mongoose = require("mongoose")

const userNoficationSchema = new mongoose.Schema({
    request: {
        type: mongoose.Types.ObjectId,
        ref: 'Request'
        // required: true
    },
    rider: {
        type: mongoose.Types.ObjectId,
        ref: 'Rider'
    },
    requestedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model("Nofication", userNoficationSchema);

