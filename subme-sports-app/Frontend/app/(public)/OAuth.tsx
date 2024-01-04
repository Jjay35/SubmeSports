import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity } from "react-native";
import { UseOAuthFlowParams, useOAuth, useSignIn} from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { SUBME_COLOR } from "../../constants/constants";

WebBrowser.maybeCompleteAuthSession();


export const useWamUpBrowser = () => {
    React.useEffect(() => {

      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  };


export function OAuthButtons(OAuthStrategy : UseOAuthFlowParams) {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWamUpBrowser();

  const OAuthStrat = OAuthStrategy.strategy.toString();
  let OAuthDisplayText = ""
  let OauthIcon = ""

  if(OAuthStrat == "oauth_google"){
    OAuthDisplayText = "Google";
    OauthIcon = "google"
  }else if(OAuthStrat == "oauth_facebook"){
    OAuthDisplayText = "Facebook";
    OauthIcon = "facebook"
  }else if(OAuthStrat == "oauth_apple"){
    OAuthDisplayText = "Apple";
    OauthIcon = "apple"
  }

  const { startOAuthFlow } = useOAuth(OAuthStrategy);

  const onPress = React.useCallback(async () => {
    const router = useRouter();

    
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {

        await setActive({ session: createdSessionId });


      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <>
     <IconButton
      mode="contained" size={30}
      containerColor={SUBME_COLOR.DARK_BLUE} 
      iconColor="white" icon={OauthIcon} onPress={onPress}/>
    </>
   
   
  );
}





