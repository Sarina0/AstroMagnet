import moment from "moment";

export const getAge = (date: Date) => {
    const birthYear = date.getFullYear();
    const curYear= new Date().getFullYear();
    return curYear - birthYear;
}

export const formatDateTime = (date: Date): string => {
    if (!date) return "";
    return moment(date).format("YYYY-MMM-DD HH:mm:ss");
}

export const formatChatTime = (date: Date): string => {

    //format date today
    if (moment(date).isSame(new Date(), "day")) {
        return "today " + moment(date).format("HH:mm");
    }

    //format date from yesterday
    if (moment(date).isSame(moment(new Date()).subtract(1, "days"), "day")) {
        return "yesterday " + moment(date).format("HH:mm");
    }

    //format date
    return moment(date).format("YYYY/MM/DD HH:mm:ss");
}

export const getAstrologicalSign = (date: Date): string => {
    if (!date) return "";
    const month = date.getMonth();
    const day = date.getDate();
    let sign = "";
    switch (month) {
        case 0:
            sign = (day < 20) ? "Capricorn" : "Aquarius";
            break;
        case 1:
            sign = (day < 19) ? "Aquarius" : "Pisces";
            break;
        case 2:
            sign = (day < 21) ? "Pisces" : "Aries";
            break;
        case 3:
            sign = (day < 20) ? "Aries" : "Taurus";
            break;
        case 4:
            sign = (day < 21) ? "Taurus" : "Gemini";
            break;
        case 5:
            sign = (day < 21) ? "Gemini" : "Cancer";
            break;
        case 6:
            sign = (day < 23) ? "Cancer" : "Leo";
            break;
        case 7:
            sign = (day < 23) ? "Leo" : "Virgo";
            break;
        case 8:
            sign = (day < 23) ? "Virgo" : "Libra";
            break;
        case 9:
            sign = (day < 23) ? "Libra" : "Scorpio";
            break;
        case 10:
            sign = (day < 22) ? "Scorpio" : "Sagittarius";
            break;
        case 11:
            sign = (day < 22) ? "Sagittarius" : "Capricorn";
            break;
    }
    return sign;
}