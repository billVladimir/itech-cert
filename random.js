const crypto = require("crypto");

/**
 * Convert seeds to decimal number
 *
 * @param  {...string} params Public seed and client seed/seeds
 * @returns Number
 */
const hexToDecimal = (...params) => {
    const hash = crypto
        .createHash("sha512")
        .update(params.join(""))
        .digest("hex");
    return parseInt(hash.substr(0, 13), 16);
};

/**
 * Get decimal mod max + min
 *
 * @param {number} min Min number
 * @param {number} max Max number
 * @param  {...string} params Public seed and client seed/seeds
 * @returns
 */
const getRandomNumber = (min, max, ...params) => {
    const decimal = hexToDecimal(...params);
    const randomNum = (decimal % (max + 1 - min)) + min;
    return randomNum;
};

/**
 * Get decimal mod max + min
 *
 * @param {number} min Min number
 * @param {number} max Max number
 * @param  {...string} params Public seed and client seed/seeds
 * @returns
 */
const getRandomXForCrash = (...params) => {
    const decimal = hexToDecimal(...params);
    const x = Math.max(
        1,
        Math.floor(96 / (1 - decimal / Math.pow(2, 52))) / 100
    );
    return x;
};

module.exports = {
    getRandomNumber,
    getRandomXForCrash
}