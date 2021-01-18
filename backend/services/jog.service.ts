import Jog from '../db/models/jog';

interface JogCreate {
    username: string;
    date: Date;
    distance: number;
    time: number;
}

interface JogUpdate {
    date: Date;
    distance: number;
    time: number;
}

interface JogStatistic {
    week: number;
    avgTime: number;
    avgSpeed: number;
    totalDistance: number;
}

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

export async function getStatistic(from: Date, to: Date) {
    const jogsStatistic: JogStatistic[] = [];
    let startDate = from;
    for (let year = from.getFullYear(), yearNumber = 0; year <= to.getFullYear(); year++, yearNumber++) {
        const startOfYear = new Date(year, 1, 1);
        if (startDate > startOfYear) startDate = startOfYear;

        const endOfYear = new Date(year, 11, 31);
        let endDate = to < endOfYear ? to : endOfYear;

        const statistic = await findStatistic(startDate, endDate);
        jogsStatistic.push(...statistic.map(({_id, ...another}) => ({...another, week: _id + yearNumber * 54})));
    }
    const firstWeekCount = jogsStatistic[0].week - 1;
    return jogsStatistic.map(({week, ...another}) => ({
        ...another,
        week: week - firstWeekCount
    })).sort((st1, st2) => st1.week - st2.week);

    function findStatistic(startDate: Date, endDate: Date) {
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