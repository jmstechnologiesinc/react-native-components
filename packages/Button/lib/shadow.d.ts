import { Animated } from 'react-native';
export default function shadow(elevation?: number | Animated.Value, isV3?: boolean): {
    shadowColor: string;
    shadowOffset: {
        width: Animated.Value;
        height: Animated.AnimatedInterpolation;
    };
    shadowOpacity: Animated.AnimatedInterpolation;
    shadowRadius: Animated.AnimatedInterpolation;
} | {
    shadowColor: string;
    shadowOpacity: number;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowRadius: number;
} | {
    shadowColor?: undefined;
    shadowOffset?: undefined;
    shadowOpacity?: undefined;
    shadowRadius?: undefined;
};
