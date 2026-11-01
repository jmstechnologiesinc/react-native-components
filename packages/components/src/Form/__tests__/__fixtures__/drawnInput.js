/**
 * How a rendered form input is drawn and whether it takes input, read from the HOST nodes Paper renders (what the
 * user meets), not from the props a form passes: the native input holding `value` (`editable`, its text colour) and
 * the outline Paper draws around it (`text-input-outline`: colour and width). `focus()` sends the native input a
 * focus event, as a tap or a Tab key would.
 */
import { StyleSheet } from 'react-native';
import { act } from 'react-test-renderer';

const OUTLINE = 'text-input-outline';

const outlineOf = (node) =>
    node.findAll((candidate) => typeof candidate.type === 'string' && candidate.props.testID === OUTLINE)[0];

/** @param {import('react-test-renderer').ReactTestRenderer} tree @param {string} value */
export const drawnInput = (tree, value) => {
    const input = tree.root.findAll((node) => node.type === 'TextInput' && node.props.value === value)[0];
    if (!input) {
        throw new Error(`no input holds «${value}»`);
    }
    // The nearest ancestor holding an outline is the input's own Paper field.
    let field = input.parent;
    while (field && !outlineOf(field)) {
        field = field.parent;
    }
    const read = () => {
        const outline = StyleSheet.flatten(outlineOf(field).props.style);
        return {
            editable: input.props.editable,
            textColor: StyleSheet.flatten(input.props.style).color,
            outlineColor: outline.borderColor,
            outlineWidth: outline.borderWidth,
        };
    };
    return {
        ...read(),
        read,
        focus: () => act(() => input.props.onFocus?.({ nativeEvent: {} })),
    };
};
