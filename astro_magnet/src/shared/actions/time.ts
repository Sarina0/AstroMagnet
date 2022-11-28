export const getAge = (date: Date) => {
    const birthYear = date.getFullYear();
    const curYear= new Date().getFullYear();
    return curYear - birthYear;
}