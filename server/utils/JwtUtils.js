import Jwt from 'jsonwebtoken';

export function issueToken(userId, userName) {
    return Jwt.sign({ id: userId, user: userName }, process.env.TOKEN_SECRET, { expiresIn: `${24 * 60 * 60}s` });
}