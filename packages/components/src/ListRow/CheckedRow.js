import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';
import ListRow from './ListRow';

const checkIcon = <List.Icon icon="check" />;

/**
 * One option of a choice that is shown, not asked (a read-only form in the partner console): its title and
 * description, and when `checked` a trailing check, announced «<title>, <description>, selected» (the catalogue's
 * `selected`). Nothing to press. Put the rows inside a `View role="list"`.
 *
 * @param {{title: string, description?: string, checked?: boolean, titleNumberOfLines?: number,
 *     descriptionNumberOfLines?: number, testID?: string}} props
 */
const CheckedRow = ({ title, description, checked = false, titleNumberOfLines, descriptionNumberOfLines, testID }) => (
    <ListRow
        title={title}
        description={description}
        titleNumberOfLines={titleNumberOfLines}
        descriptionNumberOfLines={descriptionNumberOfLines}
        trailing={checked ? checkIcon : null}
        accessibilityLabel={
            checked ? [title, description, localized('selected')].filter(Boolean).join(', ') : undefined
        }
        inset={false}
        testID={testID}
    />
);

export default CheckedRow;
