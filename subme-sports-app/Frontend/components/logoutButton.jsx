import { useAuth } from "@clerk/clerk-expo";
import { Button } from "react-native-paper";
import { SUBME_COLOR } from "../constants/constants";

//Logout function
export const LogoutButton = () => {
    const { signOut } = useAuth();
  
    const doLogout = () => {
      signOut();
    };
  
    return (
        <Button onPress={doLogout} textColor ='white' style={{backgroundColor:SUBME_COLOR.DARK_BLUE}}>Sign Out</Button>
    );
  };