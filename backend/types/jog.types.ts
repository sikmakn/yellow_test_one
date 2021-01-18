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
