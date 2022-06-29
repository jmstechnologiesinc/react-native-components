export declare const getAndroidSelectionControlColor: ({ disabled, checked, customColor, customUncheckedColor, }: {
    checked: boolean;
    disabled?: boolean | undefined;
    customColor?: string | undefined;
    customUncheckedColor?: string | undefined;
}) => {
    rippleColor: string;
    selectionControlColor: string;
};
export declare const getSelectionControlIOSColor: ({ disabled, customColor, }: {
    disabled?: boolean | undefined;
    customColor?: string | undefined;
}) => {
    checkedColor: string;
    rippleColor: string;
};
