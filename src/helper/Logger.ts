import pino from 'pino';

const log = pino({
  browser: { asObject: false }, level: 'debug',
});
export default log;
