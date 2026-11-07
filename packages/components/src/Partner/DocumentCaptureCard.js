import React, { useRef } from 'react';

import ImagePickerAvatar from '../ImagePicker/ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DocumentRequirementCard from './DocumentRequirementCard';

/**
 * How every document photo is taken (react-native-image-picker options), whatever the document: the highest
 * resolution any of them needs, at full quality, as JPEG.
 * - 5,120 px on the long side at most. A barcode on an ID-1 card (the AAMVA driver's licence PDF417) reads at
 *   ISO/IEC 15415's 5 px per module over AAMVA's minimum module of 0.170 mm: 3,597 px for a card filling 70% of the
 *   frame; an A4 or Letter page at 300 ppi needs 5,011 px. The highest applies. The picker resizes only when both
 *   bounds are set, and never enlarges.
 * - quality 1: no standard backs a lower one, and ICAO asks for no visible compression artefacts.
 * - `compatible`: iOS hands a JPEG instead of a HEIC, which the server does not take (JPEG and PNG only);
 *   `conversionQuality` 1: Android converts a HEIC to JPEG at full quality.
 */
const DOCUMENT_CAPTURE_OPTIONS = Object.freeze({
    maxWidth: 5120,
    maxHeight: 5120,
    quality: 1,
    assetRepresentationMode: 'compatible',
    conversionQuality: 1,
});

/**
 * Contract request #117: a document requirement's card with the way to send it, as the server says one version of it
 * is taken (`item.capture`, K-32): one photo, or the front and then the back (§9.8.1 step 1). Photos only (owner,
 * 2026-11-04): the card offers no PDF. Taking a photo sends nothing (owner, 2026-11-04): the pages taken show as the
 * card's covers (both sides in a carousel, owner 2026-11-04), and «Send to review» sends them once every page is
 * there. The card only sends (owner, 2026-11-04): it says nothing of where the requirement stands, which its versions
 * and its row in the lists say. The photo sheet is the library's picker, opened by the card's own button
 * (`variant="sheet"`). Native: the picker.
 *
 * Controlled: the host owns `pages` (the picker's assets, in order) and gets each change through
 * `onPagesChange(pages)`. «Send to review» calls `onSend()`; the card never clears the pages itself, so a send that
 * fails keeps them, and the host clears them once its send succeeds. While `isSending`, every action is disabled and
 * «Send to review» shows its progress.
 *
 * @param {{item: object, subtitle?: ?string, pages?: Array<object>, onPagesChange: (pages: Array<object>) => void,
 *     onSend: () => void, isSending?: boolean, testID?: string}} props
 */
const DocumentCaptureCard = ({
    item,
    subtitle,
    pages = [],
    onPagesChange,
    onSend,
    isSending = false,
    testID = 'document-requirement',
}) => {
    const pickerRef = useRef();
    const pageCount = item.capture?.pages === 2 ? 2 : 1;
    const twoSided = pageCount === 2;
    const complete = pages.length === pageCount;

    // A photo taken once every page is there starts the document again: that is how a wrong one is replaced.
    const take = (photo) => onPagesChange(pages.length < pageCount ? [...pages, photo] : [photo]);

    // What a screen reader names each photo: the front and the back of a two-sided document, else the document.
    const covers = pages.map((page, index) => {
        let label = localized('global.document');
        if (twoSided) label = localized(index === 0 ? 'documentFront' : 'documentBack');
        return { uri: page.uri, label };
    });

    // Once every page is there the photo button starts the document again, so it says so.
    let takeLabel = localized('add');
    if (complete) takeLabel = localized('documentRetake');
    else if (twoSided) takeLabel = localized(pages.length === 1 ? 'documentAddBack' : 'documentAddFront');

    // What to do now: the back, or — every page there and nothing sending — that the photos are not sent yet.
    let note = null;
    if (complete && !isSending) note = localized('documentNotSent');
    else if (twoSided && pages.length === 1) note = localized('documentAddBackPrompt');

    // The way to take a photo stays, a text button; the main action, sending, is last and the only one with a border
    // (owner, 2026-11-04); it waits, disabled, until every page is taken.
    const actions = [
        {
            label: takeLabel,
            onPress: () => pickerRef.current?.show(),
            isDisabled: isSending,
            mode: 'text',
            testID: `${testID}-add`,
        },
        {
            label: localized('sendToReview'),
            onPress: onSend,
            mode: 'outlined',
            isDisabled: isSending || !complete,
            loading: isSending,
            testID: `${testID}-send`,
        },
    ];

    return (
        <>
            <DocumentRequirementCard
                item={item}
                subtitle={subtitle}
                covers={covers}
                note={note}
                actions={actions}
                testID={testID}
            />
            <ImagePickerAvatar
                ref={pickerRef}
                variant="sheet"
                onChange={take}
                captureOptions={DOCUMENT_CAPTURE_OPTIONS}
            />
        </>
    );
};

export default DocumentCaptureCard;
