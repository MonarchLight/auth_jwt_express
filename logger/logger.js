"use strict";

import { createLogger, transports, format } from "winston";

const customFormat = format.combine(format.timestamp(), format.printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`;
}));

export const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/warn.log", level: "warn" }),
        new transports.File({ filename: "logs/info.log", level: "info" }),
    ],
});

// LOW_priority (error high)
// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.verbose('verbose');
// logger.debug('debug');
// logger.silly('silly');