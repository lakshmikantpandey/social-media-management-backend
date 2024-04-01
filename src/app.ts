import express, { Application } from 'express';
import cors from 'cors';
import { attachPaginate } from "knex-paginate";
import routes from './routes'
import { errorHandlerMiddleware } from './middlewares';
import path from 'path';
import callbackRouter from './routes/callback.router';
import timezoneRouter from "./routes/timezone.router";

attachPaginate();

const ENV: any = process.env;
const app: Application = express();

app.use(express.json());
app.use(cors());

// views render
app.set('view engine', 'pug');
// static file link
app.use(express.static(path.join(__dirname, 'public')));

// router
app.get('/', (req, res) => {
	// res.send('Social Media Management');
	res.json({
		msg: 'Social Media Management'
	})
});

// social callbacks
app.use(callbackRouter);
app.use(ENV.API_V1, timezoneRouter);

// open routes
routes.map(route => {
	app.use(ENV.API_V1, route);
});

// not found handler
app.get('*', (req, res) => {
	res.json({
		message: 'Page Not Found',
	});
});

// error handler
app.use(errorHandlerMiddleware);

export default app;