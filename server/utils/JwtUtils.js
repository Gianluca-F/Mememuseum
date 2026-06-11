import Jwt from 'jsonwebtoken';

export function issueToken(userId, userName) {
    return Jwt.sign({ id: userId, userName: userName }, process.env.TOKEN_SECRET, { expiresIn: `${2 * 60 * 60}s` });
}

export function isTokenValid(token, callback) {
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
}