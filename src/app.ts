import express, { Application } from 'express';
import cors from 'cors';

const ENV: any = process.env;
const app: Application = express();

app.use(express.json());
app.use(cors());

// router

// end

app.get('/', (req, res) => {
	res.send('VBA');
});

// not found handler
app.get('*', (req, res) => {
	res.json({
		message: 'Not Found',
	});
});

export default app;