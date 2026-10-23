import React from 'react';
import { Linking, View } from 'react-native';

import { List } from '@jmstechnologiesinc/react-native-paper';

import ListRow from '../ListRow/ListRow';
import { ruleClauseRows } from './viewModel';

const openIcon = <List.Icon icon="open-in-new" />;

/**
 * Request #105: a requirement's composed rule as the server sent it, one `ListRow` (a Paper `List.Item`) per clause:
 * the clause is the title, its value the description, read whole. A row that cites a norm or a market practice
 * opens it (a new tab on the web). The rows are the view model's (`ruleClauseRows`), so a screen shows a rule
 * without wording any of it; a rule the server did not send (null) renders nothing.
 *
 * @param {{rule: ?object, accessibilityLabel: string, layerName?: (layer: string) => string, testID?: string}} props
 *     `accessibilityLabel` names the list (the requirement it belongs to); each row's testID is `<testID>-<key>`
 */
const RuleClauseList = ({ rule, accessibilityLabel, layerName, testID = 'rule-clauses' }) => {
    const rows = ruleClauseRows(rule, { layerName });
    if (rows.length === 0) return null;
    return (
        <View role="list" aria-label={accessibilityLabel} testID={testID}>
            {rows.map(({ key, title, description, url }) => (
                <ListRow
                    key={key}
                    title={title}
                    description={description}
                    descriptionNumberOfLines={0}
                    onPress={url ? () => Linking.openURL(url) : undefined}
                    accessibilityLabel={url ? `${title}: ${description}` : undefined}
                    trailing={url ? openIcon : null}
                    inset={false}
                    testID={`${testID}-${key}`}
                />
            ))}
        </View>
    );
};

export default RuleClauseList;
