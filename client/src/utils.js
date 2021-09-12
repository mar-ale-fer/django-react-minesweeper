/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @return {function}
 */

 export const catchErrors = fn => {
    return function(...args) {
        return fn( ...args).catch((err) => {
            console.error(err);
        })
    }
}