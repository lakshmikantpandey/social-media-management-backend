import moment from "moment-timezone"

export default (date= new Date(), tz = 'Asia/Kolkata') => {
    return moment(date).tz(tz);
}