import mongoose, { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document {
    body: string;
    sentBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    chat: mongoose.Schema.Types.ObjectId;
}

const messageSchema: Schema = new mongoose.Schema({
    body: String,
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
});

messageSchema.index({ createdAt: -1 });

const Message = mongoose.model<MessageDocument>('Message', messageSchema);

export default Message;
