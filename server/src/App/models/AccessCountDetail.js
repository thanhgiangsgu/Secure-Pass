const mongoose = require('mongoose');

const accessCountDetailSchema = new mongoose.Schema({
  message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  accessedSuccess: { type: Number },
  accessedFailure: { type: Number },
});

const AccessCountDetail = mongoose.model('AccessCountDetail', accessCountDetailSchema);

module.exports = AccessCountDetail;