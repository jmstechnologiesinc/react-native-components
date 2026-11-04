import React from 'react';

import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { Avatar, Button, Card, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { requirementTitle, ruleText } from './viewModel';

/**
 * Contract request #117: one requirement of the partner as the server states it (a `getMyStatus` checklist item), in
 * a Paper `Card` composed the way Paper composes one, with no style of its own:
 * - the title is the composed rule's name for the partner's market, else the catalogue's (`requirementTitle`);
 * - `subtitle` is what the host says of it (its vehicle and where it stands, in the host's words);
 * - `covers` are the URIs of the photos the partner has taken and not sent yet, in order (the front, then the back);
 * - the content is `note` (what to do now) and the rule's plain explanation for the market;
 * - `actions` are `{ label, onPress, isDisabled?, testID? }`, Paper `Button`s straight inside `Card.Actions`, which
 *   gives them their modes (the first outlined, the next contained).
 * Without `actions` (the console showing what the partner sees) the card only reads.
 *
 * @param {{item: object, subtitle?: ?string, covers?: Array<string>, note?: ?string,
 *     actions?: Array<{label: string, onPress: () => void, isDisabled?: boolean, testID?: string}>, testID?: string}} props
 */
const DocumentRequirementCard = ({
    item,
    subtitle,
    covers = [],
    note,
    actions = [],
    testID = 'document-requirement',
}) => {
    const { spacing } = useTheme();
    const explanation = ruleText(item.explanation);
    return (
        <Card testID={testID}>
            <Card.Title
                title={requirementTitle(item)}
                subtitle={subtitle || undefined}
                titleNumberOfLines={2}
                subtitleNumberOfLines={2}
                left={(props) => <Avatar.Icon {...props} icon={MATERIAL_ICONS.document} />}
            />
            {covers.map((uri, index) => (
                <Card.Cover key={String(index)} source={{ uri }} testID={`${testID}-cover-${index}`} />
            ))}
            {note || explanation ? (
                <Card.Content>
                    {note ? (
                        <Text variant="bodyMedium" testID={`${testID}-note`}>
                            {note}
                        </Text>
                    ) : null}
                    {explanation ? (
                        <Text
                            variant="bodyMedium"
                            style={note ? { marginTop: spacing.x2 } : undefined}
                            testID={`${testID}-explanation`}
                        >
                            {explanation}
                        </Text>
                    ) : null}
                </Card.Content>
            ) : null}
            {actions.length > 0 ? (
                <Card.Actions>
                    {actions.map(({ label, onPress, isDisabled, testID: actionTestID }) => (
                        <Button key={label} onPress={onPress} disabled={isDisabled} testID={actionTestID}>
                            {label}
                        </Button>
                    ))}
                </Card.Actions>
            ) : null}
        </Card>
    );
};

export default DocumentRequirementCard;
