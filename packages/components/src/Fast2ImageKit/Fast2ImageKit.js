import React, { useState } from 'react';
import { Image, ImageBackground } from 'react-native';
import { TNActivityIndicator } from '../truly-native';

const Fast2ImageKit = ({ src, showActivityIndicator = false, showImageBackground = false, ...rest }) => {
    const [isLoading, setIsLoading] = useState(true);

    const renderFastImage = (
        <>
            <Image
                style={{ width: '100%', height: '100%' }}
                {...rest}
                source={src}
                onLoadStart={() => {
                    setIsLoading(false);
                }}
            />
            {showActivityIndicator && isLoading ? <TNActivityIndicator /> : null}
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
