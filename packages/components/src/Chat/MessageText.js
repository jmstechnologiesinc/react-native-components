import React, { useMemo } from 'react';

import { Linking, StyleSheet } from 'react-native';

import { Text } from '@jmstechnologiesinc/react-native-paper';

/**
 * MessageTextProps de la librería: { currentMessage, color, linkStyle, onPressLink }.
 *
 * Detecta URLs, emails y teléfonos y los hace pulsables con Linking. La librería usa un
 * parser propio + libphonenumber-js; aquí basta una regex y no añade dependencias.
 */

// Un solo paso: el orden importa (el email antes que la URL, para no partirlo por el punto).
const PATTERN = /(\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b)|((?:https?:\/\/|www\.)[^\s]+)|(\+?\d[\d\s().-]{7,}\d)/gi;

const linkFor = (token) => {
    if (token.includes('@') && !token.startsWith('http')) {
        return `mailto:${token}`;
    }
    if (/^\+?\d[\d\s().-]+$/.test(token)) {
        return `tel:${token.replace(/[\s().-]/g, '')}`;
    }
    return token.startsWith('http') ? token : `https://${token}`;
};

const parse = (text) => {
    const parts = [];
    let lastIndex = 0;

    // matchAll no muta el lastIndex de la regex entre llamadas, a diferencia de exec en bucle.
    for (const match of text.matchAll(PATTERN)) {
        if (match.index > lastIndex) {
            parts.push({ text: text.slice(lastIndex, match.index) });
        }
        parts.push({ text: match[0], link: linkFor(match[0]) });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex) });
    }

    return parts;
};

const MessageText = ({ currentMessage, color, linkStyle, onPressLink }) => {
    const parts = useMemo(() => parse(currentMessage.text ?? ''), [currentMessage.text]);

    return (
        <Text variant="bodyMedium" style={{ color }}>
            {parts.map((part, index) =>
                part.link ? (
                    <Text
                        key={`${part.text}-${index}`}
                        variant="bodyMedium"
                        style={[styles.link, linkStyle]}
                        onPress={() =>
                            onPressLink ? onPressLink(part.link) : Linking.openURL(part.link).catch(() => {})
                        }
                    >
                        {part.text}
                    </Text>
                ) : (
                    part.text
                )
            )}
        </Text>
    );
};

const styles = StyleSheet.create({
    link: {
        textDecorationLine: 'underline',
    },
});

export default MessageText;
