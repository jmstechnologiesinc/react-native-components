import renderer, { act } from 'react-test-renderer';
import React from 'react';

import { useNow } from '../src/useNow';
import { EMPTY_VALUE, valueText } from '../src/valueText';

describe('useNow', () => {
    afterEach(() => jest.useRealTimers());

    it('refreshes the instant every interval and stops when unmounted', () => {
        jest.useFakeTimers({ now: Date.parse('2026-09-26T12:00:00.000Z') });
        const seen = [];
        const Probe = () => {
            seen.push(useNow(60000));
            return null;
        };
        let tree;
        act(() => {
            tree = renderer.create(<Probe />);
        });
        const first = seen[seen.length - 1];

        act(() => {
            jest.advanceTimersByTime(60000);
        });
        expect(seen[seen.length - 1]).toBe(first + 60000);

        act(() => tree.unmount());
        expect(jest.getTimerCount()).toBe(0);
    });
});

describe('valueText', () => {
    it('shows a served value as given, an absent one as an em dash', () => {
        expect(valueText(undefined)).toBe(EMPTY_VALUE);
        expect(valueText(null)).toBe('—');
        expect(valueText('')).toBe('—');
        expect(valueText([])).toBe('—');
        expect(valueText(['a', null, 2])).toBe('a, —, 2');
        expect(valueText({ a: 1 })).toBe('{"a":1}');
        expect(valueText(0)).toBe('0');
        expect(valueText(false)).toBe('false');
    });
});
