import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import React from 'react';
import { View } from 'react-native';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import ScreenWrapperContainer from './ScreenWrapperContainer';
import ScreenWrapperSection from './ScreenWrapperSection';

export default {
  title: 'packages/ScreenWrapper',
};

export const Container = () => (
  <ScreenWrapper style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
      <ScreenWrapperContainer>
        <View style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer, flex: 1}}>Container</View>
      </ScreenWrapperContainer>
  </ScreenWrapper>
)

export const Section = () => (
  <ScreenWrapper style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
      <ScreenWrapperSection>
        <View style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer, flex: 1}}>Container</View>
      </ScreenWrapperSection>
  </ScreenWrapper>
)

export const SectionTitle = () => (
  <ScreenWrapper style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
      <ScreenWrapperSection withPaddingHorizontal title="The Title">
        <View style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer, flex: 1}}>Container</View>
      </ScreenWrapperSection>
  </ScreenWrapper>
)

export const SectionHorizontal = () => (
  <ScreenWrapper style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
      <ScreenWrapperSection withPaddingHorizontal>
        <View style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer, flex: 1}}>Container</View>
      </ScreenWrapperSection>
  </ScreenWrapper>
)

