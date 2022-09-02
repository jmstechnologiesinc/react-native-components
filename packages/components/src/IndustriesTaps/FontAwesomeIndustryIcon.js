import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import {
    faCheeseburger,
    faStore,
    faDog,
    faPrescriptionBottle,
    faSyringe,
    faHeadphones,
    faBaby,
    faUserHardHat,
    faBook,
    faPhoneSlash,
    faTshirt,
    faComputerClassic,
    faLaptopHouse,
    faTreeLarge,
    faSoup,
    faChairOffice,
    faSkiingNordic,
    faLuggageCart,
    faGamepadAlt,
    faChevronCircleLeft,
} from '@fortawesome/pro-duotone-svg-icons';

library.add(
    faCheeseburger,
    faStore,
    faDog,
    faPrescriptionBottle,
    faSyringe,
    faHeadphones,
    faBaby,
    faUserHardHat,
    faBook,
    faPhoneSlash,
    faTshirt,
    faComputerClassic,
    faLaptopHouse,
    faTreeLarge,
    faSoup,
    faSkiingNordic,
    faLuggageCart,
    faChairOffice,
    faGamepadAlt,
    faChevronCircleLeft
);

import styles from './styles';

export const fontAwesomeIndustryIcon = (icon, isSelected) => (
    <FontAwesomeIcon
        icon={['fad', VENDOR_INDUSTRIES_MAPPING[icon].icon]}
        size={30}
        color={isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant}
        style={styles.icon}
    />
);
