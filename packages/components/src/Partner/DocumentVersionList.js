import React from 'react';
import { View } from 'react-native';

import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

import ListRow from '../ListRow/ListRow';
import { documentVersionRows } from './viewModel';

/**
 * Contract request #117: a document requirement's versions as the server sent them (`checklistItem.versions`, newest
 * first), one `ListRow` (a Paper `List.Item`) each: the version's state is the title, when it was sent and what the
 * server says of it the description. The rows are the view model's (`documentVersionRows`) and open nothing, so they
 * carry no chevron. No versions, no list.
 *
 * @param {{versions: ?Array<object>, accessibilityLabel: string, testID?: string}} props
 *     `accessibilityLabel` names the list (the requirement it belongs to); each row's testID is `<testID>-<versionId>`
 */
const DocumentVersionList = ({ versions, accessibilityLabel, testID = 'document-versions' }) => {
    const rows = documentVersionRows(versions);
    if (rows.length === 0) return null;
    return (
        <View role="list" aria-label={accessibilityLabel} testID={testID}>
            {rows.map(({ key, title, description }) => (
                <ListRow
                    key={key}
                    title={title}
                    description={description || undefined}
                    icon={MATERIAL_ICONS.document}
                    testID={`${testID}-${key}`}
                />
            ))}
        </View>
    );
};

export default DocumentVersionList;
