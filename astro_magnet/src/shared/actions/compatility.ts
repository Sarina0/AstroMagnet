import type { User } from "@app/shared/interfaces/user";

const toRad = (Value:any) => {
    return (Value * Math.PI) / 180;
};

/**
 * find compatibility percentage of two users
 * @param user1 - first user
 * @param user2 - second user
 * @returns {number} - compatibility percentage of two users
 */
export const getCompatibility = (user1: User, user2: User) => {
    if (user1 && user2) {
        let lat1 = user1.lat!;
        let lng1 = user1.lng!;
        let lat2 = user2.lat!;
        let lng2 = user2.lng!;

        let R = 6371; // km
        let dLat = toRad(lat2 - lat1!);
        let dLon = toRad(lng2 - lng1!);
        lat1 = toRad(lat1);
        lat2 = toRad(lat2);

        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = Math.floor(R * c);
        return Math.floor(100 - (d * 100) / 20000);
    }
    return 0;
}