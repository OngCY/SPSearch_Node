const log4js = require("log4js");

log4js.configure({
  appenders: { tap: { type: "file", filename: "../logs/tap.log" } },
  categories: { default: { appenders: ["tap"], level: "info" } }
});
 
const logger = log4js.getLogger("tap");
/*
logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");
*/

module.exports = logger;