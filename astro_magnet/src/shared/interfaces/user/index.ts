/**
 * User interface
 */
export interface User {
    /**
     * Id of the user
     */
    id: string;

    /**
     * Email of the user
     */
    email: string;

    /**
     * Name of the user
     * @optional It will be entered once the user makes changes to the profile
     */
    name?: string;

    /**
     * Type of sex
     * @optional It will be entered once the user makes changes to the profile
     */
    sex?: User.SexType;

    /**
     * Profile picture of the user
     * @optional It will be entered once the user makes changes to the profile
     */
    profilePicture?: string;

    /**
     * List of object containing required information
     */
    friendList: Friend[];

    /**
     * Date of birth of the user
     * @optional It will be entered once the user makes changes to the profile
     */
    dateAndTimeOfBirth?: Date;

    /**
     * Place of Birth
     * @optional It will be entered once the user makes changes to the profile
     */
    placeOfBirth?: string;

    /**
     * Type of sex that the user is interested into
     */
    interestedType?: User.SexType;

    /**
     * Messages list of user.
     * List which display's the friend's whith whom they are currently
     * messaging
     */
    messagingFriendList: Friend[];

}


export interface Friend {

    /**
     * Email of the friend address
     */
    email: string;

    /**
     * Name of the friend
     */
    name: string;

    /**
     * Profile Picture of the friend
     */
    profilePicture: string;

    /**
     * email of the user who sent the last message
     */
    lastMessageSentBy: string;

    /**
     * Date of the last sent message
     */
    lastMessageSentDate: Date;

    /**
     * Id of the chatroom being useds
     */
    chatroomId: string;

}

export namespace User {
    /**
     * Enum for the type of sex of the user
     */
    export enum SexType {
        Male = "Male",
        Female = "Female",
        Other = "Other"
    }

    /**
     * Get all the array of sex types from the enum
     * @returns Array of sex type
     */
    export function GetSexTypesArray(): string[] {
        return Object.keys(SexType)
    }

    /**
     * Given the string of the sex, return the enum value
     * @param sex String of the sex
     * @returns enum value of the sex type
     */
    export function getSexType(sex: String): User.SexType {
        if(sex == SexType.Male) {
            return User.SexType.Male
        } else if (sex == SexType.Female) {
            return User.SexType.Female
        } else if (sex == SexType.Other) {
            return User.SexType.Other
        } else {
            throw new Error("Sex type not allowed")
        }
    }
}