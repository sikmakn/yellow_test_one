import Jog from '../models/jog';

export async function create(jog: JogCreate) {
    const newJog = new Jog(jog);
    return await newJog.save();
}

export async function getMany(username: string, from?: Date, to?: Date) {
    const searchObj: any = {username};
    if (from || to) {
        searchObj.date = {};
        if (from) searchObj.date.$gte = from;
        if (to) searchObj.date.$lte = to;
    }
    return Jog.find(searchObj);
}

export async function findStatistic(startDate: Date, endDate: Date) {
    return Jog.aggregate([
        {
            $match: {
                date: {$gte: startDate, $lte: endDate},
            }
        },
        {
            $group: {
                _id: {$week: '$date'},
                totalDistance: {$sum: '$distance'},
                avgTime: {$avg: '$time'},
                avgSpeed: {$avg: {$divide: ['$distance', '$time']}},
            }
        },
    ]);
}

export function update(_id: string, jog: JogUpdate) {
    return Jog.findOneAndUpdate({_id}, {$set: jog}, {new: true});
}

export function findById(_id: string) {
    return Jog.findById(_id);
}

export function removeById(_id: string) {
    return Jog.findByIdAndRemove(_id);
}