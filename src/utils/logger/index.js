import winston from 'winston';
import winstonPapertrail from 'winston-papertrail';

import config from '../../config';

let logger;

if (config.env == 'test' || config.env == 'local' || config.env == 'development') {
	logger = console;
} else {
	const papertrailTransport = new winston.transports.Papertrail({
		host: config.logger.host,
		port: config.logger.port,
	});

	logger = new winston.Logger({
		transports: [papertrailTransport],
	});
}

export default logger;
