export declare type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
export declare const getButtonColors: ({ mode, customButtonColor, customTextColor, disabled, dark, }: {
    mode: ButtonMode;
    customButtonColor?: string | undefined;
    customTextColor?: string | undefined;
    disabled?: boolean | undefined;
    dark?: boolean | undefined;
}) => {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    borderWidth: number;
};
