import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";


/**
 * User profile type
 * @property {string?} id - User id
 * @property {string} email - user email
 * @property {string?} name - user name
 * @property {SexType|null} sex - user's sex
 * @property {string?} profilePicture - user's profile picture
 * @property {Friend[]} friendList - user's friend list
 * @property {Date | null} dateAndTimeOfBirth - user's date and time of birth
 * @property {string?} placeOfBirth - user's place of birth
 * @property {SexType?} interestedType - user's interested sex type
 * @property {Friend[]} messagingFriendList - user's messaging friend list
 */
export interface User {
    id?: string;
    email: string;
    name?: string;
    sex: User.SexType | null;
    profilePicture?: string;
    friendList: Friend[];
    dateAndTimeOfBirth: Date | null;
    placeOfBirth?: string;
    interestedType: (User.SexType)[];
    messagingFriendList: Friend[];
    liked: string[];
    disliked: string[];
    lat?: number,
    lng?: number,
    createdAt: FirebaseFirestoreTypes.Timestamp;
}

/**
 * user's friend type
 * @property {string} email of friend
 * @property {string} name name of friend
 * @property {string} profilePicture of friend
 * @property {string} lastMessageSentBy friend
 * @property {Date} lastMessageSentDate - last message sent date
 * @property {string} chatroomId of friend and user
 */
export interface Friend {
    email: string;
    name: string;
    chatRoomId: string;
}

export namespace User {
    /**
     * all user sex types
     */
    export const sexes = ["male", "female", "other"] as const;

    /**
     * user sex type
     */
    export type SexType = typeof sexes[number];
}