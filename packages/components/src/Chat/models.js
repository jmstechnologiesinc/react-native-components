/**
 * Forma de los mensajes. Es la misma que usa @kesha-antonov/react-native-chat, para que
 * los datos y los callbacks sean intercambiables si algún día podemos volver a la librería
 * (hoy no: su lista virtualizada animada con Reanimated revienta Yoga en RN 0.85).
 *
 * @typedef {Object} User
 * @property {string|number} _id
 * @property {string} [name]
 * @property {string} [avatar] URL
 *
 * @typedef {Object} ReplyMessage Cita compacta del mensaje al que se responde.
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
 * @property {boolean} [system] Mensaje de sistema, centrado y sin burbuja
 * @property {boolean} [pending] Enviándose
 * @property {boolean} [sent] Entregado al servidor
 * @property {boolean} [received] Recibido por el destinatario
 * @property {ReplyMessage} [replyMessage]
 */

export const isSameUser = (message, user) => !!message?.user && !!user && message.user._id === user._id;

/** Dos mensajes consecutivos del mismo autor se agrupan (sin repetir avatar ni nombre). */
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

/** Cita compacta a partir del mensaje completo. */
export const toReplyMessage = (message) =>
    message ? { _id: message._id, text: message.text, user: message.user } : undefined;

export const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
