import moment from "moment-timezone"
import config from "../config";

export default (date= new Date(), tz = config.tz) => {
    return moment(date).tz(tz);
};

export const momentTzUTC = (date= new Date(), tz = config.tz) => {
    return moment(date).tz(tz);
}