import * as jogRepository from '../db/repositories/jog.repository';

export async function create(jog: JogCreate) {
    return jogRepository.create(jog);
}

export async function getMany(username: string, from?: Date, to?: Date) {
    return jogRepository.getMany(username, from, to);
}

export async function getStatistic(from: Date, to: Date) {
    const jogsStatistic: JogStatistic[] = [];
    for (let year = from.getFullYear(), yearNumber = 0; year <= to.getFullYear(); year++, yearNumber++) {
        const startDate = calculateStartDate(year, from);
        const endDate = calculateEndDate(year, to);

        const statisticByYear = await jogRepository.findStatistic(startDate, endDate);
        jogsStatistic
            .push(...statisticByYear.map(({_id, ...another}) =>
                ({...another, week: _id + yearNumber * 54})));
    }
    return recountWeeks()
        .sort((st1, st2) => st1.week - st2.week);


    function calculateStartDate(year: number, from: Date) {
        const startOfYear = new Date(year, 1, 1);
        if (from > startOfYear) return startOfYear;
        return from;
    }

    function calculateEndDate(year: number, to: Date) {
        const endOfYear = new Date(year, 11, 31);
        return to < endOfYear ? to : endOfYear;
    }

    function recountWeeks() {
        const firstWeekCount = jogsStatistic[0].week - 1;
        return jogsStatistic
            .map(({week, ...another}) =>
                ({...another, week: week - firstWeekCount}))
    }
}

export function update(_id: string, jog: JogUpdate) {
    return jogRepository.update(_id, jog);
}

export function findById(_id: string) {
    return jogRepository.findById(_id);
}

export function removeById(_id: string) {
    return jogRepository.removeById(_id);
}