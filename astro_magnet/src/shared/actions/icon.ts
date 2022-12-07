export function getAstroIconName(sign: string) {
    let name="zodiac-"
    switch (sign) {
        case "Aquarius":
            return name+"aquarius";
        case "Pisces":
            return name+"pisces";
        case "Aries":
            return name+"aries";
        case "Taurus":
            return name+"taurus";
        case "Gemini":
            return name+"gemini";
        case "Cancer":
            return name+"cancer";
        case "Leo":
            return name+"leo";
        case "Virgo":
            return name+"virgo";
        case "Libra":
            return name+"libra";
        case "Scorpio":
            return name+"scorpio";
        case "Sagittarius":
            return name+"sagittarius";
        case "Capricorn":
            return name+"capricorn";
        default:
            return name+"aquarius";
    }
}