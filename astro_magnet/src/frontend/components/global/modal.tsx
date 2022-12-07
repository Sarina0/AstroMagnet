import {Text, Modal, Box, Image} from "native-base";
import Images from "@app/theme/images";

interface Props {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalDialog(props: Props) {
    return (
        <Modal 
            isOpen={props.isOpen}
            onClose={props.onClose}
            size="lg"
            backgroundColor="rgba(0,0,0,0.5)"
        >
            <Modal.Content 
                backgroundColor="rgba(53,50,204, 0.8)"
                borderRadius="lg"
                justifyContent="center"
                alignItems="center"
            >
                <Modal.CloseButton
                    _icon={{
                        color: "onSecondary",
                        size: '4'
                    }}
                />
                <Modal.Body>
                    <Box  width="100%" padding={5}>
                        <Text
                            textAlign="center"
                            color="onSecondary"
                            fontSize={24}
                        >
                            {props.message}
                        </Text>
                        <Image
                            source={Images.logo}
                            alt="logo"
                            width="150"
                            height="150"
                            resizeMode="contain"
                            alignSelf="center"
                        />
                    </Box>
                </Modal.Body>
            </Modal.Content>xx
        </Modal>
    )
}