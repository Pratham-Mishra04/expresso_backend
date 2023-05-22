"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.default.Schema({
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
chatSchema.index({ createdAt: -1 });
chatSchema.virtual('messages', {
    ref: 'Message',
    foreignField: 'chat',
    localField: '_id',
});
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.default = Chat;
//# sourceMappingURL=chatModel.js.map