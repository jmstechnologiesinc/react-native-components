import 'react-native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';

import HLTabs from './HLTabs';

describe('<HLTabsWrapper />', () => {
    it('given an empty options, it returns nothing.', async () => {
        const options = [];
        const { queryByTestId } = render(<HLTabs options={options} />);

        expect(queryByTestId('filterButton')).toBeFalsy();
    });

    it('given Delivery, Pickup, Taxi, renders 3 buttons', async () => {
        const options = [
            { title: 'Delivery', value: 'delivery' },
            { title: 'Pickup', value: 'pickup' },
            { title: 'Taxi', value: 'taxi' },
        ];

        const { getByText, findAllByRole } = render(<HLTabs options={options} />);

        const Delivery = getByText(/Delivery/i);
        const Pickup = getByText(/Pickup/i);
        const Taxi = getByText(/Taxi/i);

        expect(Delivery).toBeDefined();
        expect(Pickup).toBeDefined();
        expect(Taxi).toBeDefined();

        const buttonLenght = await findAllByRole('button');
        expect(buttonLenght).toHaveLength(3);
    });

    it('clicking 1 time in a button, onSelect is called 1', async () => {
        const options = [
            { title: 'Delivery', value: 'delivery' },
            { title: 'Pickup', value: 'pickup' },
        ];

        const onSelect = jest.fn();

        const { getByText } = render(<HLTabs options={options} onSelect={onSelect} />);

        fireEvent.press(getByText(/Pickup/i));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect.mock.calls[0][0]).toBe('pickup');
    });

    it('clicking many times in the same button, onSelect is called 1', async () => {
        const options = [
            { title: 'Delivery', value: 'delivery' },
            { title: 'Pickup', value: 'pickup' },
        ];

        const onSelect = jest.fn();

        const { getByText } = render(<HLTabs options={options} onSelect={onSelect} />);

        fireEvent.press(getByText(/Pickup/i));
        fireEvent.press(getByText(/Pickup/i));
        fireEvent.press(getByText(/Pickup/i));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect.mock.calls[0][0]).toBe('pickup');
    });

    it('clicking in a button, it passes the correct value to the callback', async () => {
        const options = [{ title: 'Delivery', value: 'delivery' }];
        const onSelect = jest.fn();

        const { getByText } = render(<HLTabs options={options} onSelect={onSelect} />);
        fireEvent.press(getByText(/Delivery/i));
        expect(onSelect.mock.calls[0][0]).toBe('delivery');
    });
});
