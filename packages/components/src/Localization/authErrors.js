/**
 * Turns a Firebase client-SDK auth error into a message a customer can act on.
 *
 * Only the SDK that runs on the device belongs here. Those errors never reach the backend, so
 * nothing else is in a position to translate them. A callable's failure is the backend's error
 * and arrives with its message already localized -- show `error.message` for those, not this.
 *
 * localized() answers with the key itself when a translation is missing, which is how raw codes
 * such as 'auth/invalid-verification-code' ended up rendered in a dialog. Reading that back as a
 * miss is what lets an unmapped code fall through to the generic message instead. A callable
 * error passed here by mistake ('functions/internal') takes the same fallback rather than
 * printing its envelope.
 */

import { localized } from './Localization';

// Same text the codes with no customer-facing meaning of their own map to, so an unmapped code
// and a deliberately generic one are indistinguishable on screen.
const GENERIC_ERROR_KEY = 'authGenericError';

export const localizedAuthError = (error) => {
    const code = typeof error === 'string' ? error : error?.code;

    if (!code) {
        return localized(GENERIC_ERROR_KEY);
    }

    const message = localized(code);

    return message === code ? localized(GENERIC_ERROR_KEY) : message;
};

export default localizedAuthError;
