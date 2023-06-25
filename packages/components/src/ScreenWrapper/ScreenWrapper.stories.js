import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import React from 'react';
import { View } from 'react-native';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import ScreenWrapperContainer from './ScreenWrapperContainer';
import ScreenWrapperSection from './ScreenWrapperSection';

export default {
  title: 'packages/ScreenWrapper',
};

export const Container = () => (
  <ScreenWrapper >
      <ScreenWrapperContainer style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
        <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Container</View>
      </ScreenWrapperContainer>
  </ScreenWrapper>
)

export const ContainerSection = () => (
  <ScreenWrapper >
      <ScreenWrapperContainer style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
        <ScreenWrapperSection style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
            <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
         </ScreenWrapperSection>
         <ScreenWrapperSection style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
            <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
         </ScreenWrapperSection>
      </ScreenWrapperContainer>
  </ScreenWrapper>
)

export const SectionTitle = () => (
  <ScreenWrapper>
      <ScreenWrapperContainer style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
        <ScreenWrapperSection title="The Title" style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
          <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
        </ScreenWrapperSection>
      </ScreenWrapperContainer>

      <ScreenWrapperContainer style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>
        <ScreenWrapperSection title="The Title" style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
          <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
        </ScreenWrapperSection>
        <ScreenWrapperSection title="The Title" style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
          <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
        </ScreenWrapperSection>
        <ScreenWrapperSection title="The Title" style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
          <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
        </ScreenWrapperSection>
      </ScreenWrapperContainer>
  </ScreenWrapper>
)

export const Section = () => (
  <ScreenWrapper >
      <ScreenWrapperSection style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
        <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Section</View>
      </ScreenWrapperSection>
  </ScreenWrapper>
)

export const SectionHorizontal = () => (
  <ScreenWrapper>
          <ScreenWrapperContainer style={{backgroundColor: MD3LightTheme.colors.primaryContainer}}>

      <ScreenWrapperSection withPaddingHorizontal style={{backgroundColor: MD3LightTheme.colors.onPrimaryContainer}}>
        <View style={{backgroundColor: 'red', flex: 1, color: 'yellow'}}>Container</View>
      </ScreenWrapperSection>
      </ScreenWrapperContainer>
  </ScreenWrapper>
)

