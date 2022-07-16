import moment from 'moment';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
	format: combine(timestamp(), prettyPrint()),
	defaultMeta: { service: 'vba' },
	transports: [
		new transports.File({
			filename: `./logs/${moment().format('YYYY-MM-DD')}_Error.log`,
			level: 'error',
		}),
	],
});