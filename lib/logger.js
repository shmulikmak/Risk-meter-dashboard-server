
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');
const { isError } = require('lodash');
const { basename, dirname, relative } = require('path');
const config = require('../config/config');

const { createLogger, transports, format } = winston;

const ROOT_DIR = dirname(require.main.filename);
const logError = getLogger('error');
const logInfo = getLogger('info');
const logWarning = getLogger('warn');
const logDebug = getLogger('debug');

/**
 * Log error
 *
 * @param  {string | Error} message
 * @param  {Error} err
 */
function error(message, err = null, req = null) {
    const metadata = getLogMetadata(message, err, req);
    logError.error(metadata.message, metadata);
}

/**
 * Log warning
 *
 * @param  {string | Error} message
 * @param  {Error} err
 */
function warn(message, err = null, req = null) {
    const metadata = getLogMetadata(message, err, req);
    logWarning.warn(metadata.message, metadata);
}

/**
 * Log info
 *
 * @param {string} message
 * @param  {...any} args
 */
function info(message, ...args) {
    logInfo.info(message, { ...args });
}

/**
 * Log debug
 *
 * @param  {String} message
 */
function debug(message, ...args) {
    if (config.logger.debug) {
        logDebug.debug(message, args);
    }
}

const stream = {
    write: (log) => {
        debug(log);
    }
};

/**
 * Get winston logger by level
 *
 * @param {'error' | 'warn' | 'info' | 'debug'} level The logger level
 * @returns {winston.Logger} The winston logger
 */
function getLogger(level) {
    const loggerFormat = format(formatter);
    const consoleFormat = level === 'debug' || level === 'info'
        ? format.combine(
            format.colorize(),
            format.splat(),
            format.printf(log => {
                const meta = Object.values(log.meta || {});
                return `${log.level.padEnd(25)} [${getTimeStamp()}]: ${log.message}${meta.length ? ` ${JSON.stringify(meta)}` : ''}`;
            })
        )
        : loggerFormat({ colorize: true, showLevel: true });


    const logger = createLogger({
        transports: [
            new transports.Console({
                handleExceptions: true,
                level,
                format: format.combine(
                    format.colorize(),
                    consoleFormat
                )
            })
        ]
    });

    // Add file transport to error and warn level
    if (level === 'error' || level === 'warn') {
        // Add file transport
        logger.add(new DailyRotateFile({
            filename: `${level}-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            level,
            dirname: 'logs',
            handleExceptions: true,
            maxFiles: 20,
            maxSize: '5m',
            format: loggerFormat()
        }));
    }

    return logger;
}

/**
 * Parse log metadata
 *
 * @param  {string | Error} message
 * @param  {Error | any} err
 *
 * @returns {{message: string, error?: string, from?: string, mongooseErrors: string, url?: string, method?: string, user?: string, ip?: string, body?: string, query?: string }}
 */
function getLogMetadata(message, err, req) {
    const metadata = {};
    metadata.message = message;

    if (isError(message)) {
        err = message;
        metadata.message = err.message;
    }

    // Get error properties
    if (err && (isError(err) || err.errors)) {
        const stackInfo = getStackInfo(1);
        metadata.error = err.stack;
        metadata.from = `${stackInfo.relativePath}:${stackInfo.line}:${stackInfo.pos}`;

        if (err.errors) {
            metadata.mongooseErrors = JSON.stringify(err.errors, null, 4);
        }
    }

    // Get url and username from the request
    if (req) {
        metadata.url = req.originalUrl;
        metadata.method = req.method;
        metadata.body = req.body;
        metadata.query = req.query;

        // Get request ip
        if (req.clientIp) {
            metadata.ip = req.clientIp;
        }

        // Get request user id
        if (req.user) {
            metadata.user = req.user ? req.user.id : '';
        }
    }

    return metadata;
}

/**
 * Logger formatter
 *
 * @param  {any} log
 * @param  {any} options
 */
function formatter(log, { showLevel, colorize }) {
    let message = `${showLevel ? `${log.level} ` : ''}[${getTimeStamp()}] =>\n`;

    message += `Message: ${log.message}\n`;
    message += log.from ? `From: ${log.from}\n` : '';
    message += log.url ? `Url: ${log.url}\n` : '';
    message += log.user ? `User: ${log.user}\n` : '';
    message += log.mongooseErrors ? `Mongoose Errors: ${log.mongooseErrors}\n` : '';
    message += log.error ? `${log.error}\n` : '\n';

    log[Symbol.for('message')] = message;

    return log;
}

/**
 * Get current time stamp
 */
function getTimeStamp() {
    return moment().format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stackIndex) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    const stacklist = new Error().stack.split('\n').slice(3);

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    return sp && sp.length === 5 ? {
        method: sp[1],
        path: sp[2],
        relativePath: relative(ROOT_DIR, sp[2]),
        line: sp[3],
        pos: sp[4],
        file: basename(sp[2]),
        stack: stacklist.join('\n')
    } : {};
}

module.exports = {
    error,
    info,
    warn,
    debug,
    stream
};
