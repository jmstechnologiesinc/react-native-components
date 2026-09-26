// C-35 — THE PORTABLE ENTRY: what loads on the web with no stubs.
//
// The barrel (`index.js`) reaches maps, geolocation, permissions, the image
// picker, action and bottom sheets, gesture and animation libraries and the
// real-time client, none of which a web bundle can load. A web host — the
// partner console, the presentational views it borrows from the app (canon
// §17.6) — imports `lib/portable` instead and gets only what runs on
// react-native-web. `__tests__/portableEntry.test.js` walks this file's import
// graph the way a web bundler does (`.web.js` first) and fails if a native-only
// module becomes reachable.
//
// On the web the host configures the library at runtime with
// `configureComponents` (see `Config.web.js`) and registers the partner
// catalogue with `registerFlatCatalog`.
import * as List from './List/List';
import * as Tabs from './Tabs/Tabs';
import * as ActionGroup from './ActionGroup/ActionGroup';
import * as PartnerViewModel from './Partner/viewModel';
import FormPersonInfo from './Form/FormPersonInfo';
import FormVehicleInfo from './Form/FormVehicleInfo';
import FormBusinessInfo from './Form/FormBusinessInfo';
import FormEmailPassword from './Form/FormEmailPassword';
import SecretInputText from './Form/SecretInputText';
import StripeFormAccountBank from './StripeForm/StripeFormAccountBank';

// The forms the web needs (canon §17.4, §17.6). `Form.PhoneNumber` stays in
// the barrel because its phone-input library imports this package's barrel
// back; the others are not used by any partner view.
const Form = Object.freeze({
    PersonInfo: FormPersonInfo,
    VehicleInfo: FormVehicleInfo,
    BusinessInfo: FormBusinessInfo,
    EmailPassword: FormEmailPassword,
    SecretInputText,
});

const StripeForm = Object.freeze({
    AccountBank: StripeFormAccountBank,
});

export { List, Tabs, ActionGroup, Form, StripeForm, PartnerViewModel };

export { default as styles } from './styles';
export { LAYOUT_MODE } from './consts';
export { configureComponents } from './Config';

export { default as ScreenWrapper } from './ScreenWrapper';
export { default as ChipList } from './ChipList/ChipList';
export { default as SegmentedButtonGroup } from './SegmentedButtonGroup/SegmentedButtonGroup';
export { default as SideNav } from './SideNav/SideNav';
export { default as TouchableRippleWrapper } from './TouchableRippleWrapper/TouchableRippleWrapper';
export { default as TNActivityIndicator } from './truly-native/TNActivityIndicator';
export { default as TNEmptyStateView } from './truly-native/TNEmptyStateView';
// Paper only: the app's «add» text button.
export { default as ButtonWrapper } from './ButtonWrapper/ButtonWrapper';
// The photos of a gallery, display only. `ImagePicker` itself (picker,
// permissions, draggable list) stays native: the host injects it.
export { default as PhotoGalleryDisplay } from './ImagePicker/PhotoGalleryDisplay';

export { localized, setI18nConfig, registerFlatCatalog, currentLocale } from './Localization/Localization';
export { merge } from './Localization/catalog';
export { formatDateTime, formatTime, formatRelativeTime } from './Localization/format';

export { orderViewModel, fromDescriptor, statusLabel } from './Order/viewModel';

// K-22
export { default as StatusChip, SlaChip } from './Partner/StatusChip';
export { default as DocumentViewer, ZOOM } from './DocumentViewer/DocumentViewer';
export { default as DecisionDialog } from './DecisionDialog/DecisionDialog';
// The web keyboard contract of a modal surface (focus in, Tab trap, Esc,
// focus back to the opener); DecisionDialog uses it, and a host's own sheets
// and dialogs share it. A no-op off the web.
export { useModalFocus } from './useModalFocus';
export { default as Timeline } from './Timeline/Timeline';
export { STATUS_TONES, toneColors } from './tones';
