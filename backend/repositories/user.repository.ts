import User from '../db/models/user';

export async function isExist(username: string) {
    return !!await User.findOne({username});
}

export function findByUsername(username:string) {
    return User.findOne({username})
}

export async function create(username: string, password: string, salt: string) {
    const user = new User({password, salt, username});
    return await user.save()
}