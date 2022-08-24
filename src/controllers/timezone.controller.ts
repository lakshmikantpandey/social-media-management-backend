import { IRequest, IResponse } from '../interfaces';
import Controller from './base.controller';

import moment from "moment-timezone";

class TimezoneController extends Controller {
	getTimezones(req: IRequest, res: IResponse<any>) {
		// return moment.tz.names();
		res.json({
			message: "OK",
			data: moment.tz.names()
		});
	}
}

export default new TimezoneController();