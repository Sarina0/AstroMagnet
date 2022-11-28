import {ReactNode} from "react";
import { SafeAreaView } from  "react-native-safe-area-context";

/**
 * SafeArea component to wrap around screen in navigation stack
 * @returns 
 */
export default function SafeArea({ children }: {children: ReactNode}) {
    return (
        <SafeAreaView style={{flex: 1}}>
            {children}
        </SafeAreaView>
    );
}