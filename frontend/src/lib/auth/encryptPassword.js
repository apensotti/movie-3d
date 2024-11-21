const bcrypt = require('bcrypt');

const password = "Dodgetheblock@2";
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
    .then(hash => {
        console.log('Hashed password:', hash);
        return bcrypt.compare(password, hash);
    })
    .then(isMatch => {
        console.log('Verification:', isMatch);
    })
    .catch(err => {
        console.error('Error:', err);
    });