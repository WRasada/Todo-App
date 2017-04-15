const bcrypt = require('bcryptjs');
const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

let password = {
  _id: new ObjectID(),
  password: 'MylittleSEcret'
};

// let crypto = SHA256(password + 'secret').toString();
// let cryptov2 = SHA256(password + 'secret').toString();
//
// console.log(JSON.stringify(password));
// console.log(password);
//
// console.log(crypto);
// console.log(cryptov2);
//
let hash = jwt.sign(password, 'asdfdffa');
let hashv2 = jwt.sign({ _id: password._id, password: password.password }, 'asdfdffa').toString();

console.log((hash === hashv2));
console.log(hashv2);

let decoded = jwt.verify(hash, 'asdfdffa');
let decodedv2 = jwt.verify(hashv2, 'asdfdffa');

console.log(decoded);
console.log(decodedv2);
