import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes'
import { errorHandlerMiddleware } from './middlewares';

const ENV: any = process.env;
const app: Application = express();

app.use(express.json());
app.use(cors());

// views render
app.set('view engine', 'pug');

// router
app.get('/', (req, res) => {
	// res.send('Social Media Management');
	res.json({
		msg: 'Social Media Management'
	})
});

routes.map(route => {
	app.use(ENV.API_V1, route);
});

// not found handler
app.get('*', (req, res) => {
	res.json({
		message: 'Not Found',
	});
});

// error handler
app.use(errorHandlerMiddleware);

export default app;