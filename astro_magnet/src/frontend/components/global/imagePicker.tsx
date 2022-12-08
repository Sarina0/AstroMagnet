import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Box, Text, Icon } from "native-base";
import { ViewStyle, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import Image from "@app/frontend/components/global/image";

interface Props {
    label?: string;
    value:  string | null | undefined;
    onChange: (value: string | null | undefined) => void;
    fallback?: string;
    style?: ViewStyle
    labelStyle?: ViewStyle
    mode: "avatar" | "image"
}

/**
 * image picker for selecting an image from the device
 * @prop {string | undefined} label - label of the image picker
 * @prop {string | null | undefined} value - uri of the selected image
 * @prop {(value: string | null | undefined) => void} onChange - function to call when the image changes
 * @prop {string | undefined} fallback - uri of the fallback image when no image is selected(value is null or undefined)
 * @prop {ViewStyle | undefined} style - extra style for the image picker container
 * @prop {ViewStyle | undefined} labelStyle - extra style for the label
 * @prop {"avatar" | "image"} mode - mode of the image picker (2 options: "avatar" or "image")
 * @returns 
 */
export default function ImagePickerComponent(props: Props) {

  /**
   * get selected image uri
   * @returns {string} - image uri
   */
  function getImageSrc(): string {

    //if image is selected
    if (props.value) {

      //return image uri
      return props.value;
    }

    //if no image is selected return fallback uri
    return props.fallback ?? 'https://via.placeholder.com/150';
  }

  /**
   * open the picker
   */
  async function pickImage(): Promise<void> {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        props.onChange(result.assets[0].uri);
    }
  };

  const {width} = Dimensions.get('window');

  return (
    <>
        {props.label && 
            <Text
                color="onSecondary"
                my={2}
                fontSize="lg"
                fontWeight="bold"
                style={props.labelStyle}
            >
                {props.label}
            </Text>}
        <Box 
            flex={1}
            justifyContent="center"
            alignItems="center"
            style={props.style}
            width={width/2.25}
            height={width/2.25}
        >
            <Pressable
                position="absolute"
                alignItems="center"
                justifyContent="center"
                top={-8} right={-12}
                zIndex={100} bg="tertiary"
                height={7} width={7}
                p={2} rounded="full"
                onPress={pickImage}
            >
                <Icon
                    as={<MaterialCommunityIcons name="pencil" />}
                    color="onSecondary"
                />
            </Pressable>
            <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                rounded={props.mode === "avatar" ? "full" : "md"}
                bg="secondary"
                overflow="hidden"
                className="w-full h-full"
            >
                <Image
                    source={{ 
                        uri: getImageSrc(),
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable
                    }}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />   
            </Box>
        </Box>
    </>
    
  );
}
