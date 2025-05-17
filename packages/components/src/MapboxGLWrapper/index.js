import MapboxGLWrapper, {MapboxGLWrapperCamera, MapboxGLWrapperUserLocation} from "./MapboxGLWrapper";
import MapboxGLWrapperSingleIconMarker from "./MapboxGLWrapperSingleIconMarker";
import MapboxGLWrapperLocationTooltip from "./MapboxGLWrapperLocationTooltip";
import MapboxGLWrapperDrawTurnByTurnRoute from "./MapboxGLWrapperDrawTurnByTurnRoute";
import MapboxGLWrapperResetToInitialPositionIcon from "./MapboxGLWrapperResetToInitialPositionIcon";
import MapboxGLWrapperDriverRouteMonitoring from "./MapboxGLWrapperDriverRouteMonitoring";
import MapboxGLWrapperBoundingBoxCamera from "./MapboxGLWrapperBoundingBoxCamera";
import MapboxGLWrapperHeatMap from "./MapboxGLWrapperHeatMap";

export default Object.assign(
    MapboxGLWrapper,
    {
        Camera: MapboxGLWrapperCamera,
        BoundingBoxCamera: MapboxGLWrapperBoundingBoxCamera,
        FolowUserLocation: MapboxGLWrapperUserLocation,
        SingleIconMarker: MapboxGLWrapperSingleIconMarker,
        LocationTooltip: MapboxGLWrapperLocationTooltip,
        DrawTurnByTurnRoute: MapboxGLWrapperDrawTurnByTurnRoute,
        ResetToInitialPositionIcon: MapboxGLWrapperResetToInitialPositionIcon,
        DriverRouteMonitoring: MapboxGLWrapperDriverRouteMonitoring,
        HeatMap: MapboxGLWrapperHeatMap
    }
)