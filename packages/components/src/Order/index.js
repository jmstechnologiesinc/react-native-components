import OrderTransitionButtons from "./OrderTransitionButtons";
import OrderProductList from "./OrderProductList";
import OrderDriverAvatar from "./OrderDriverAvatar";
import OrderMapboxGLMonitoring from "./OrderMapboxGLMonitoring";
import OrderHistoryOrderItem from "./OrderHistoryOrderItem";
import OrderOngoingTrip from "./OrderOngoingTrip";
import OrderFulfillmentInfo from "./OrderFulfillmentInfo";
import OrderTripTelemetry from "./OrderTripTelemetry";
import OrderQuickOverView from "./OrderQuickOverView";
import OrderSectionList from "./OrderSectionList";
export {formatQuickOrderViewDescription} from "./OrderQuickOverView";

export default Object.assign(
    {},
    {
        ProductList: OrderProductList,
        TransitionButtons: OrderTransitionButtons,
        DriverAvatar: OrderDriverAvatar,
        MapboxGLMonitoring: OrderMapboxGLMonitoring,
        HistoryOrderItem: OrderHistoryOrderItem,
        QuickOverView: OrderQuickOverView,
        OngoingTrip: OrderOngoingTrip,
        FulfillmentInfo: OrderFulfillmentInfo,
        TripTelemetry: OrderTripTelemetry,
        SectionList: OrderSectionList,
        
    }
)