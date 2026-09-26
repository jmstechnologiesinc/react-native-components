import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

// The web twin of `OptionSheet.js`: the same imperative surface (`show()` /
// `hide()` on the ref), rendered as a Paper modal instead of a native action
// sheet. The native-only props of the action sheet are accepted and ignored so
// the caller stays one file.
const OptionSheet = forwardRef(({ containerStyle, children }, ref) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({ show: () => setVisible(true), hide: () => setVisible(false) }), []);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                contentContainerStyle={[
                    containerStyle,
                    {
                        height: undefined,
                        maxHeight: '80%',
                        backgroundColor: theme.colors.surface,
                        margin: theme.spacing.x6,
                        borderRadius: theme.roundness * 4,
                    },
                ]}
            >
                {children}
            </Modal>
        </Portal>
    );
});

export default OptionSheet;
