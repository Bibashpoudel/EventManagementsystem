import crypto from 'crypto'

// First we get our unique key to encrypt our object
var  password =  '4589654Bibash7$$&&@@';

// We then get our unique Initialization Vector
var iv = Buffer.from('20');
const ivs = crypto.randomBytes(16);

// To be used as salt in encryption and decryption
var ivstring = iv.toString('hex');


// Function to find SHA1 Hash of password key
function sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

//Function to get secret key for encryption and decryption using the password
function password_derive_bytes(password, salt, iterations, len) {
    var  key = Buffer.from(password + salt);
   
    for (var  i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        var  hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (var  counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
   
    
    return Buffer.alloc(len, key);
}

// Function to encode the object
async function encode(reciveddata) {
   
    var  key = password_derive_bytes(password, '', 100, 32);
    // Initialize Cipher Object to encrypt using AES-256 Algorithm 
    
    var cipher = crypto.createCipheriv('aes-256-cbc',key,ivs);
    var  part1 = cipher.update(reciveddata, 'utf8');
    var  part2 = cipher.final();
    var  encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
}

// Function to decode the object
async function decode(reciveddata) {
    var  key = password_derive_bytes(password, '', 100, 32);
    // Initialize decipher Object to decrypt using AES-256 Algorithm
    var  decipher = crypto.createDecipheriv('aes-256-cbc', key, ivs);
    var  decrypted = decipher.update(reciveddata, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}

export {
    encode, decode
}