import React, { useState } from 'react';
import { ImageBackground } from 'react-native';

import FastImage from 'react-native-fast-image';

//import { TNActivityIndicator } from '../../Core/truly-native';
//import { iconSet } from '../../DynamicAppStyles';

const Fast2ImageKit = ({ 
    src, 
    showActivityIndicator = false, 
    showImageBackground = false, 
    ...rest 
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const renderFastImage = (
        <>
            <FastImage
                style={{ width: '100%', height: '100%' }}
                {...rest}
                source={src}
                onLoadStart={() => {
                    setIsLoading(false);
                }}
            />
            {showActivityIndicator && isLoading && <TNActivityIndicator />}
        </>
    );

    return showImageBackground ? (
        <ImageBackground source={iconSet.imgDeafult} style={styles.ImageBackground}>
            {renderFastImage}
        </ImageBackground>
    ) : (
        renderFastImage
    );
};

export default Fast2ImageKit;
