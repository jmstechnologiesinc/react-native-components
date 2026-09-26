import React from 'react';

import { Card, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * An MD3 outlined card with a title row over its content: Paper `Card mode="outlined"` with `Card.Title`
 * (`titleMedium`, `subtitle` in `bodySmall`, `trailing` on the right — a chip, say) and `Card.Content`.
 * The card is not pressable. It keeps a 16dp gap under itself so cards stack in a pane (`style` overrides).
 *
 * On the web the fork's `Card` wraps its content in a press target that is disabled without `onPress`,
 * which react-native-web renders `aria-disabled="true"` (see PROJECT.md, Paper fork web a11y items).
 *
 * @param {{title: string, subtitle?: string, trailing?: React.ReactNode, children?: React.ReactNode,
 *     style?: any, testID?: string}} props
 */
const SectionCard = ({ title, subtitle, trailing, children, style, testID }) => {
    const { spacing } = useTheme();
    return (
        <Card mode="outlined" style={[{ marginBottom: spacing.x4 }, style]} testID={testID}>
            <Card.Title
                title={title}
                titleVariant="titleMedium"
                titleNumberOfLines={2}
                subtitle={subtitle}
                subtitleVariant="bodySmall"
                right={trailing ? () => trailing : undefined}
                rightStyle={trailing ? { marginRight: spacing.x4 } : undefined}
            />
            {children ? <Card.Content>{children}</Card.Content> : null}
        </Card>
    );
};

export default SectionCard;
