const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
import Mailjet from "node-mailjet";
import { logger } from "../logging";

const mailjetConfig = new Mailjet({
    apiKey: EMAIL_USERNAME,
    apiSecret: EMAIL_PASSWORD
});

interface IToEmail {
    Email: string;
    Name: string;
}

interface IEmailBody {
    to: IToEmail[],
    subject: string,
    html: string
}

class EmailService {
    sendEmail(emailBody: IEmailBody){
        const request = mailjetConfig.post('send', {version: 'v3.1'})
        .request({
            "Messages": [{
                "From": {
                    "Email": "sahadev@techphant.com",
                    "Name": "Social Media Management"
                },
                "To": emailBody.to,
                "Subject": emailBody.subject,
                "TextPart": "",
                "HTMLPart": emailBody.html
            }]
        });
        // check only error
        request.catch ((error) => {
            logger.log(error);
        });
    }
}

export default new EmailService();