import React, { useState } from 'react';

import { View , Animated} from 'react-native';

import {List, Paragraph, Banner} from '@jmsstudiosinc/react-native-paper';

import * as JMSList from "../../List/src";
import PhotoGallery from '../../PhotoGallery/src/PhotoGallery';
import ToggleButtonList from '../../ToggleButton/src/ToggleButtonList';

const VendorView = ({
    title, 
    photos, 
    description, 
    formattedAddress, 
    formattedPud, 
    pud,
    selectedPud,
    banner=null,
    coverTranslateY, 
    coverScale,
    onPressPudFilter
}) => {
    const [isBannerVisible, setIsBannerVisible] = useState(!!banner);

    return (
        <>
            {banner && (
                <Banner 
                    visible={isBannerVisible} 
                    actions={[{label: "Close", onPress: () => setIsBannerVisible(!isBannerVisible)}]}
                    style={{marginBottom: isBannerVisible ? 16 : 0}}>
                    {banner}
                </Banner>
            )}
            {(coverTranslateY && coverScale) ? <Animated.View
                    style={[
                        {
                            maxHeight: 200,
                        },
                        {
                            transform: [
                                {
                                    translateY: coverTranslateY,
                                },
                            ],
                        },
                    ]}
                >
                <Animated.View
                    style={[
                            {
                                transform: [
                                    {
                                        scale: coverScale,
                                    },
                                ],
                            },
                        ]}
                        >
                        <PhotoGallery photos={photos} />
                    </Animated.View>
                </Animated.View>
            : <PhotoGallery photos={photos} />}
            

            <List.Section>
                <JMSList.Item
                    overline={formattedPud}
                    title={title}
                    description={formattedAddress}
                    titleVariant={"headlineSmall"}  />
            </List.Section>
       
            {description && (
                <View style={{ marginHorizontal: 16, marginBottom: 32}}>
                    <Paragraph>{description}</Paragraph>
                </View>
            )}
     
            {pud && <ToggleButtonList
                title="Available Shopping Mode"
                data={pud} 
                selectedIndex={selectedPud}
                onPress={onPressPudFilter} />}
        </>
    )
}

export default VendorView;
