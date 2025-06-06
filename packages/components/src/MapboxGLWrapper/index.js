import MapboxGLWrapper, {MapboxGLWrapperCamera, MapboxGLWrapperUserLocation} from "./MapboxGLWrapper";

import MapboxGLWrapperBusinessIconMarker from "./MapboxGLWrapperBusinessIconMarker";
import  MapboxGLWrapperVehicleIconMarker from './MapboxGLWrapperVehicleIconMarker'
import MapboxGLWrapperLocationTooltip from "./MapboxGLWrapperLocationTooltip";
import MapboxGLWrapperDrawTurnByTurnRoute from "./MapboxGLWrapperDrawTurnByTurnRoute";
import MapboxGLWrapperResetToInitialPositionIcon from "./MapboxGLWrapperResetToInitialPositionIcon";
import MapboxGLWrapperDriverRouteMonitoring from "./MapboxGLWrapperDriverRouteMonitoring";
import MapboxGLWrapperBoundingBoxCamera from "./MapboxGLWrapperBoundingBoxCamera";
import MapboxGLWrapperHeatMap from "./MapboxGLWrapperHeatMap";
import MapboxGLWrapperPointAnnotationMaterialIcon from "./MapboxGLWrapperPointAnnotationMaterialIcon";

export default Object.assign(
    MapboxGLWrapper,
    {
        Camera: MapboxGLWrapperCamera,
        BoundingBoxCamera: MapboxGLWrapperBoundingBoxCamera,
        FolowUserLocation: MapboxGLWrapperUserLocation,
        VehicleIconMarker: MapboxGLWrapperVehicleIconMarker,
        BusinessIconMarker: MapboxGLWrapperBusinessIconMarker,
        PointAnnotationMaterialIcon: MapboxGLWrapperPointAnnotationMaterialIcon,
        LocationTooltip: MapboxGLWrapperLocationTooltip,
        DrawTurnByTurnRoute: MapboxGLWrapperDrawTurnByTurnRoute,
        ResetToInitialPositionIcon: MapboxGLWrapperResetToInitialPositionIcon,
        DriverRouteMonitoring: MapboxGLWrapperDriverRouteMonitoring,
        HeatMap: MapboxGLWrapperHeatMap
    }
)