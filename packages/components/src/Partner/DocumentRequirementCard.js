import React from 'react';
import { View } from 'react-native';

import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { Avatar, Button, Card, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import DocumentCovers from './DocumentCovers';
import { requirementTitle, ruleText } from './viewModel';

/**
 * Contract request #117: one requirement of the partner as the server states it (a `getMyStatus` checklist item), in
 * a Paper `Card` composed the way Paper composes one, with no style of its own:
 * - the title is the composed rule's name for the partner's market, else the catalogue's (`requirementTitle`);
 * - `subtitle` is what the host names it by besides its title (its vehicle, in the host's words);
 * - the content is `covers`, the photos the partner has taken and not sent yet, in order (the front, then the back),
 *   each with the `label` a screen reader names it by (one is the cover, more a carousel: DocumentCovers), then
 *   `note` (what to do now, announced by a screen reader when it changes) and the rule's plain explanation for the
 *   market. The photos sit in the Card.Content, not beside it: Card.Content takes its top padding from a Card.Cover or
 *   Card.Title just above it, so one carousel between them would leave the text against the photos;
 * - `actions` are `{ label, onPress, isDisabled?, mode?, loading?, testID? }`, Paper `Button`s straight inside
 *   `Card.Actions`, which keeps a `mode` given (a Paper Button mode) and gives the rest its own (the first outlined,
 *   the next contained); `loading` is the Button's progress indicator. Actions that do not fit on one line wrap.
 * Without `actions` (the console showing what the partner sees) the card only reads.
 *
 * @param {{item: object, subtitle?: ?string, covers?: Array<{uri: string, label: string}>, note?: ?string,
 *     actions?: Array<{label: string, onPress: () => void, isDisabled?: boolean, mode?: string, loading?: boolean,
 *     testID?: string}>, testID?: string}} props
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
    const hasCovers = covers.length > 0;
    let explanationSpacing;
    if (note) explanationSpacing = { marginTop: spacing.x2 };
    else if (hasCovers) explanationSpacing = { marginTop: spacing.x4 };
    return (
        <Card testID={testID}>
            <Card.Title
                title={requirementTitle(item)}
                subtitle={subtitle || undefined}
                titleNumberOfLines={2}
                subtitleNumberOfLines={2}
                left={(props) => <Avatar.Icon {...props} icon={MATERIAL_ICONS.document} />}
            />
            {hasCovers || note || explanation ? (
                <Card.Content>
                    {hasCovers ? <DocumentCovers covers={covers} testID={testID} /> : null}
                    {/* A polite live region (Android's, and `aria-live` on the web) announces the next step. It stays
                        mounted, empty without a note: a region that appears together with its text is not announced
                        on the web. */}
                    <View aria-live="polite">
                        {/* After the photos, the space Card.Content puts after a cover; between texts, the note's. */}
                        {note ? (
                            <Text
                                variant="bodyMedium"
                                style={hasCovers ? { marginTop: spacing.x4 } : undefined}
                                testID={`${testID}-note`}
                            >
                                {note}
                            </Text>
                        ) : null}
                    </View>
                    {explanation ? (
                        <Text variant="bodyMedium" style={explanationSpacing} testID={`${testID}-explanation`}>
                            {explanation}
                        </Text>
                    ) : null}
                </Card.Content>
            ) : null}
            {actions.length > 0 ? (
                // Card.Actions lays its buttons in one row that does not wrap, so a long label pushed the others out
                // of the card; its own alignment and padding stay. Card.Actions tells its buttons apart by position (the
                // first is outlined), and so does the key: a label changes as photos are taken, and keyed by it the
                // button would remount.
                <Card.Actions style={{ flexWrap: 'wrap', rowGap: spacing.x2 }}>
                    {actions.map(({ label, onPress, isDisabled, mode, loading, testID: actionTestID }, index) => (
                        <Button
                            key={String(index)}
                            mode={mode}
                            onPress={onPress}
                            disabled={isDisabled}
                            loading={loading}
                            testID={actionTestID}
                        >
                            {label}
                        </Button>
                    ))}
                </Card.Actions>
            ) : null}
        </Card>
    );
};

export default DocumentRequirementCard;
