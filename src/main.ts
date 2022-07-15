import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from './app';

const startServer = () => {
	const server = http.createServer(app);
	const port = process.env.APP_PORT || 3002;
	const host = process.env.HOST || 'localhost';
	const env = process.env.NODE_ENV || 'development';
	try {
		server.listen(port, () => {
			console.log(`Server running at http://${host}:${port} in ${env} mode`);
		});
	} catch (err) {
		console.log(err);
	}
};

startServer();
