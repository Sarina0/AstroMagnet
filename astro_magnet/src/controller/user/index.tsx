import firestore from '@react-native-firebase/firestore';
import Messages from "../../theme/messages";

/**
 * User controller
 */
export abstract class UserController {

    constructor() {
        throw new Error("Controller cannot be initialized")
    }

    /**
     * upload image to firebase storage
     * @returns returns user info
     */
    static async updateUser(userId, data): any {
        const _user = await firestore()
            .collection('Users')
            .doc(userId)
            .update({
                ...data,
            });

        if (_user && _user._docs.length > 0) {
            return {
                status: true,
                user: _user.docs[0]
            };
        } else {
            const error = Messages.NetworkError;
            return {
                status: false,
                error
            };
        }
    }

    /**
     * get all users
     * @returns returns user array
     */
    static async getAllUsers(): any {
        const result = await firestore()
            .collection('Users')
            .get()

        return {
            status: true,
            users: result._docs
        };
    }

    /**
     * like user
     * @returns
     */
    static async likeUser(currentUserId, userId): any {
        const _user = await firestore()
            .collection('Users')
            .doc(currentUserId)
            .update({
                like: firestore.FieldValue.arrayUnion(userId),
            });
    }

    /**
     * like user
     * @returns
     */
    static async dislikeUser(currentUserId, userId): any {
        const _user = await firestore()
            .collection('Users')
            .doc(currentUserId)
            .update({
                dislike: firestore.FieldValue.arrayUnion(userId),
            });
    }
}
