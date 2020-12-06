import React,{ useRef, useState, useEffect } from "react";
import { AppState,View,Text } from "react-native";

const AppStateManager = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log(appState.current);
    console.log("AppState", appStateVisible);
  };

  return (
      <View>
         <Text>Sam</Text>
      </View>
  )
};

export default AppStateManager;