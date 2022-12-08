import {extendTheme} from 'native-base';

/**
 * custom theme for nativebase
 */
const theme = extendTheme({
    colors: {
        primary: "#9A48D0",
        secondary: "#63458A",
        onSecondary: "#FEE1FF",
        tertiary: "#B288C0",
        secondaryOpaque: "rgba(99, 69, 138, 0.5)",
    }
});

export default theme;