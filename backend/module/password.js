import bcrypt from 'bcrypt';


const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};

export const verifyPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error('Error verifying password:', err);
        throw err;
    }
};
