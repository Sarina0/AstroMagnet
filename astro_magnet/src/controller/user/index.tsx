import { User } from '@app/shared/interfaces/user';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Messages from "../../theme/messages";

type NWResult<T> = {
    status: boolean,
    data: T
}

type firebasedoc = FirebaseFirestoreTypes.DocumentData;

/**
 * User controller
 */
export default class UserController {

    constructor() {
        throw new Error("UserController is a static class");
    }

    /**
     * update user profile in firestore
     * @param {string} userId - current logged in user id
     * @param {Partial<User>} data - new data to be updated
     * @param {(message: string)=>void} onError - error callback(handle network error)
     */
    static async updateUser(
        userId: string, 
        data: Partial<User>,
        onError?: (message: string) => void
    ): Promise<NWResult<string>> {
        await firestore()
            .collection('users')
            .doc(userId)
            .update({
                ...data,
            }).catch((error) => {
                console.log("[LOG] error update user:", error)
                onError && onError(error.message)
            })

        return {
            status: true,
            data: "User updated successfully"
        }
    }

    /**
     * get all users
     * @param {string} currentUserId - current logged in user id
     * @param {(message: string)=>void} onError - error callback(handle network error)
     * @returns returns firebasedoc of users
     */
    static async getAllUsers(
        onError?: (message: string) => void
    ): Promise<NWResult<firebasedoc[]>> {
        let result: firebasedoc[] = []
        await firestore()
            .collection('users')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    result.push(documentSnapshot)
                });
            }).catch((error) => {
                console.log("[LOG] error get all user:", error)
                onError && onError(error.message)
            })

        return {
            status: true,
            data: result
        };
    }

    /**
     * like user
     * @param {string} currentUserId - current logged in user id
     * @param {string} userId - user id to be liked
     * @param {(message: string)=>void} onError - error callback(handle network error)
     * @returns
     */
    static async likeUser(
        currentUserId: string, 
        userId: string, 
        onError?: (message: string) => void
    ): Promise<void> {
        await firestore()
            .collection('users')
            .doc(currentUserId)
            .update({
                liked: firestore.FieldValue.arrayUnion(userId),
            }).catch((error)=> {
                console.log("[LOG] error liking user:", error)
                onError && onError(error.message)
            })
    }

    /**
     * like user
     * @param {string} currentUserId - current logged in user id
     * @param {string} userId - user id to be unliked
     * @param {(message: string)=>void} onError - error callback(handle network error)
     * @returns
     */
    static async dislikeUser(
        currentUserId: string,
        userId: string,
        onError?: (message: string) => void
    ): Promise<void> {
        await firestore()
            .collection('users')
            .doc(currentUserId)
            .update({
                disliked: firestore.FieldValue.arrayUnion(userId),
            }).catch((error) => {
                console.log("[LOG] error dislike user:", error)
                onError && onError(error.message)
            })
    }
}
