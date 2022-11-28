import {User} from "../interfaces/user";

const sexes = ["male", "female", "other"];

export const validateUser = (
    user: Partial<User>, 
    validateEmail?: boolean,
    onError?: (message: string)=> void
) => {

    //guard against empty fields
    if (isEmptyFieldExist(user)) {
        onError && onError("please fill in all fields");
        return false;
    }

    //guard against invalid email
    if ( validateEmail && !isEmailValid(user.email!)) {
        onError && onError("invalid email");
        return false;
    }

    //guard against invalid name
    if (!isNameValid(user.name!)) {
        onError && onError("invalid name");
        return false;
    }

    //guard against invalid age
    if (!isAgeValid(user.dateAndTimeOfBirth!)) {
        onError && onError("invalid age, you must be 18 years old or older");
        return false;
    }

    //guard against invalid sex
    if (!isSexValid(user.sex!)) {
        onError && onError("invalid sex");
    }

    //guard against invalid interests
    if (!isInterestedTypeValid(user.interestedType!)) {
        onError && onError("invalid interested");
        return false;
    }
    return true;
}

/**
 * check if user has empty fields
 * @param user - user date to check
 * @returns {boolean} - true if user has empty fields false otherwise
 */
export const isEmptyFieldExist = (user: Partial<User>) => {
    return (!user.name||
        !user.dateAndTimeOfBirth||
        !user.placeOfBirth||
        !user.sex||
        !user.interestedType);
} 

/**
 * check if user name is valid
 * valid name is a string with length between 2 to 50
 * @param name - name to check
 * @returns {boolean} - true if name is valid false otherwise
 */
export const isNameValid = (name: string) => {
    if (name.length < 3 || name.length > 30) {
        return false;
    }

    return true;
}

/**
 * check if user email is valide
 * @param email - email to check
 * @returns {boolean} - true if email is valid false otherwise
 */
export const isEmailValid = (email: string) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

/**
 * check if user is old enough(18 years old up)
 * @param dateofbirth - date of birth to check
 * @returns {boolean} - true if user is old enough false otherwise
 */
export const isAgeValid = (dateofbirth: Date) => {
    const age = new Date().getFullYear() - dateofbirth.getFullYear();
    return age >= 18;
}

/**
 * validate user sex
 * @param sex - user sex to check
 * @returns {boolean} - true if sex is valid false otherwise
 */
export const isSexValid = (sex: string) => {
    return sexes.includes(sex);
}

/**
 * validate user interested type
 * @param interestedType - interested type to check
 * @returns {boolean} - true if interested type is valid false otherwise
 */
export const isInterestedTypeValid = (interestedType: string[]) => { 
    return interestedType.every((sex)=>{
        return sexes.includes(sex);
    })
}