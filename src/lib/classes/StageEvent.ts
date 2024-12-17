import { type Venue, type Show } from "./types";
import { add, differenceInMinutes } from "date-fns";
import { RawEvent } from "./RawEvent";
import {
    coloniseTimeString,
    indexOfNextTimeFromSorted,
    toTimeObj,
    toTimeString,
} from "$lib/utils";
// import { DateTime } from "luxon";
// import { toTimeObj } from "$lib/utils";

export class StageEvent extends RawEvent {
    venue: Venue;
    shows: Array<Show>;
    color: string;
    _timeIndices: number[][];

    //TODO: change to initialise from RawStage data
    constructor(
        date: string,
        open: string,
        start: string,
        v: Venue,
        shows: Array<Show>,
        color: string
    ) {
        super(date, open, start);
        this.venue = v;
        this.shows = shows;
        this.color = color;
        this._timeIndices = [];
    }

    insertEvent(newShow: Show) {
        const startObj = toTimeObj(newShow.startTime),
            endObj = toTimeObj(newShow.endTime);
        const insertIdx = indexOfNextTimeFromSorted(
            startObj,
            this.shows.map(({ startTime }) => toTimeObj(startTime))
        );
        const newpart = this.shows.slice(insertIdx);
        if (insertIdx < this.shows.length) {
            if (endObj > toTimeObj(this.shows[insertIdx].startTime)) {
                //shift everything
                const shift = differenceInMinutes(
                    endObj,
                    toTimeObj(newpart[0].startTime)
                );
                for (const show of newpart) {
                    const s = toTimeObj(show.startTime),
                        t = toTimeObj(show.endTime);
                    show.startTime = toTimeString(add(s, { minutes: shift }));
                    show.endTime = toTimeString(add(t, { minutes: shift }));
                }
            }
        }
        this.shows = this.shows.slice(0, insertIdx).concat([newShow], newpart);
    }

    get endTime() {
        //const et = toTimeObj(this.shows[this.shows.length-1].endTime, true);
        return this.shows[this.shows.length - 1].endTime;
    }

    itemTimeIndices(timeBlocks: string[]): number[][] {
        this._timeIndices = this.shows.map((item) =>
            [item.startTime, item.endTime].map((time) =>
                timeBlocks.indexOf(coloniseTimeString(time))
            )
        );
        return this._timeIndices;
    }
}
