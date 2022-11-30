import FastImage from "react-native-fast-image";
import type { FastImageProps } from "react-native-fast-image";
import {useState} from "react";
import {Box, Skeleton} from "native-base";

interface Props extends FastImageProps {
    src?: string;
    onLoadError?: (error: string) => void;
}

/**
 * image component that support loading and error handling, using FastImage as base
 * @prop {string} image source
 * @prop {(error: string)} callback function when image failed to load
 * @prop {FastImageProps} - component also supports all FastImage props to override default config
 * @return {JSX.Element} image component
 */
export default function Image(props: Props) {
    const [loading, setLoading] = useState<boolean>(true);

    function onError() {
        props.onLoadError && props.onLoadError("Error loading image, retrying...")
    }

    return (
        <Box
            bg="tertiary"
            width="100%"
            height="100%"
            position="relative"
            style={props.style}
            overflow="hidden"
        >
            {
                loading &&
                <Skeleton
                    startColor="tertiary"
                    endColor="secondary"
                    height="100%"
                    width="100%"
                    position="absolute"
                    zIndex={100}
                />
            }
            <FastImage
                style={props.style}
                source={{uri: props.src}}
                onError={onError}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                {...props}
            />
        </Box>
    )
}

