import AsyncStorage from "@react-native-async-storage/async-storage";

const SHOULD_SHOW_PRIVACY_POLICY_FLOW = 'SHOULD_SHOW_PRIVACY_POLICY_FLOW';


export const getShouldShowPrivacyPolicy = () =>
        new Promise(async (resolve, reject) => {
            let privacyPolicyStatus;
            try {
                privacyPolicyStatus = await AsyncStorage.getItem( SHOULD_SHOW_PRIVACY_POLICY_FLOW);
                resolve(privacyPolicyStatus);
            } catch (e) {
                reject(privacyPolicyStatus);
            }
        });

  export const setShouldShowPrivacyPolicy = () =>
        new Promise(async (resolve, reject) => {
            let privacyPolicyStatus;
            try {
                privacyPolicyStatus = await AsyncStorage.setItem( SHOULD_SHOW_PRIVACY_POLICY_FLOW, 'true');
                resolve(privacyPolicyStatus);
            } catch (e) {
                reject(privacyPolicyStatus);
            }
        });