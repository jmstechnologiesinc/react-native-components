// The web twin of pickPdf (../pickPdf.web.js), required by its own path as the web bundler resolves it (`.web.js`
// first). The suite runs in Node, which has no DOM: the `<input type="file">` is a stand-in on Node's own EventTarget
// that records what the twin set on it and fires the events a browser fires; `File`, `Blob` and `URL.createObjectURL`
// are Node's own, and FileReader (the browser's) is a stand-in that reads the given bytes.
import { Buffer } from 'buffer';

import pickPdf from '../pickPdf.web';

let input;
beforeEach(() => {
    input = Object.assign(new EventTarget(), { files: null, clicked: 0 });
    input.click = () => {
        input.clicked += 1;
    };
    global.document = { createElement: (tag) => (tag === 'input' ? input : null) };
    global.FileReader = class {
        readAsDataURL(blob) {
            blob.arrayBuffer().then((bytes) => {
                this.result = `data:${blob.type};base64,${Buffer.from(bytes).toString('base64')}`;
                this.onload();
            });
        }
    };
});
afterEach(() => {
    delete global.document;
    delete global.FileReader;
});

it('opens the browser file chooser for a PDF, on the same page, and resolves the file shaped like a photo', async () => {
    const picked = pickPdf();
    expect(input).toMatchObject({ type: 'file', accept: 'application/pdf', clicked: 1 });
    input.files = [new File(['%PDF-1.4 test'], 'insurance.pdf', { type: 'application/pdf' })];
    input.dispatchEvent(new Event('change'));
    const asset = await picked;
    expect(asset).toEqual({
        uri: expect.stringMatching(/^blob:/),
        base64: Buffer.from('%PDF-1.4 test').toString('base64'),
        type: 'application/pdf',
        fileName: 'insurance.pdf',
        fileSize: 13,
    });
    URL.revokeObjectURL(asset.uri);
});

it('resolves nothing when the chooser closes without a file', async () => {
    const cancelled = pickPdf();
    input.dispatchEvent(new Event('cancel'));
    await expect(cancelled).resolves.toBeNull();

    const empty = pickPdf();
    input.files = [];
    input.dispatchEvent(new Event('change'));
    await expect(empty).resolves.toBeNull();
});
