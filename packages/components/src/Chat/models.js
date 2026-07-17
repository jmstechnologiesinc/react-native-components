/**
 * Message shape — the same one @kesha-antonov/react-native-chat uses, so data and callbacks
 * stay interchangeable if we can ever go back to the library (today its Reanimated-animated
 * virtualized list breaks Yoga on RN 0.85).
 *
 * Helpers: isSameAuthor groups consecutive messages by the same author (no repeated avatar
 * or name); toReplyMessage builds the compact quote out of a full message.
 *
 * @typedef {Object} User
 * @property {string|number} _id
 * @property {string} [name]
 * @property {string} [avatar] URL
 *
 * @typedef {Object} ReplyMessage Compact quote of the message being replied to.
 * @property {string|number} _id
 * @property {string} text
 * @property {User} user
 *
 * @typedef {Object} IMessage
 * @property {string|number} _id
 * @property {string} text
 * @property {Date|number} createdAt
 * @property {User} user
 * @property {string} [image] URL
 * @property {boolean} [system] System message: centered, no bubble
 * @property {boolean} [pending] Being sent
 * @property {boolean} [sent] Delivered to the server
 * @property {boolean} [received] Seen by the recipient
 * @property {ReplyMessage} [replyMessage]
 */

export const isSameUser = (message, user) => !!message?.user && !!user && message.user._id === user._id;

export const isSameAuthor = (message, other) => !!message && !!other && message.user?._id === other.user?._id;

export const isSameDay = (message, other) => {
    if (!message || !other) {
        return false;
    }
    const a = new Date(message.createdAt);
    const b = new Date(other.createdAt);
    return (
        a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
    );
};

export const toReplyMessage = (message) =>
    message ? { _id: message._id, text: message.text, user: message.user } : undefined;

export const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
