// const crypto = require('crypto');
// /
// function generateHashedPassword(password) {
//     const salt = crypto.randomBytes(16);  // ✅ Generate 16-byte salt
//     const iterations = 310000;
//     const keylen = 32;
//     const digest = 'sha256';

//     crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
//         if (err) throw err;

//         console.log("🔹 Salt (HEX):", salt.toString('hex'));  // ✅ 32 hex characters (16 bytes)
//         console.log("🔹 Hashed Password (HEX):", derivedKey.toString('hex'));  // ✅ 64 hex characters (32 bytes)
//     });
// }

// // Example usage
// generateHashedPassword("letmein");
