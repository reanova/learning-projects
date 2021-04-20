const { genSalt, hash, compare } = require("bcryptjs");

// module.exports.hash = (password) => {
//     genSalt().then(salt => {
//         return hash
//     }
// };

// genSalt().then((salt) => {
//     return hash("monkey", salt);
// });

module.exports.compare = compare;

module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));
