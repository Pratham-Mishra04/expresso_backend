"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.default.Schema({
    body: String,
    sentBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    chat: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Chat',
    },
});
messageSchema.index({ createdAt: -1 });
const Message = mongoose_1.default.model('Message', messageSchema);
exports.default = Message;
//# sourceMappingURL=messageModel.js.map