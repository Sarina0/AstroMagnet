import { StyleSheet, ImageBackground, SafeAreaView, View } from 'react-native'
import { ReactNode } from 'react'

interface Props {
    /**
     * This will be generate automatically as long as you put
     * Some tags in between the Background Tag
     */
    children: ReactNode
}

/**
 * Set the background image of the application
 */
const Background = (props: Props) => {
    const { children } = props;

    return (
        <View style={ styles.container }>
            <ImageBackground 
                source={require('../../../../assets/background.png')} 
                style={ styles.image }
                resizeMode="cover">
                    <SafeAreaView
                        style={{ flex: 1 }}
                    >
                        { children }
                    </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

export default Background

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    image: {
        zIndex: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
})