import ActionSheet from 'react-native-actions-sheet';

// The container `OptionPickerActionSheet` opens: a native action sheet, driven
// through its ref (`show()` / `hide()`). `OptionSheet.web.js` is the web twin
// with the same ref surface, because this module reaches
// `react-native-gesture-handler`, which cannot load on the web.
export default ActionSheet;
