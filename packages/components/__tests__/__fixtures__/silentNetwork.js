/**
 * A network that never answers, for the suites that mount `Form.BusinessInfo`.
 *
 * Its store address is `AutoCompleteInput`, whose places library asks Google for
 * suggestions over `XMLHttpRequest` once the field holds text. React Native
 * provides `XMLHttpRequest` at runtime and Jest's environment does not, so the
 * debounced request threw as soon as a suite flushed its timers. These suites
 * assert on the form, never on Google's answer: while they run, the request goes
 * to a stand-in that is never answered, so nothing reaches the network and
 * nothing waits for a reply.
 */
class SilentXMLHttpRequest {
    open() {}

    setRequestHeader() {}

    send() {}

    abort() {}
}

/** Installs the stand-in for the calling suite and puts back what was there after it. */
export const installSilentNetwork = () => {
    let previous;
    beforeAll(() => {
        previous = global.XMLHttpRequest;
        global.XMLHttpRequest = SilentXMLHttpRequest;
    });
    afterAll(() => {
        global.XMLHttpRequest = previous;
    });
};
