/**
 * get user first name from full name
 * @param name - name of user
 * @returns {string} - first name of user
 */
export function getFirstName(name: string) {
    return name.split(" ")[0];
}