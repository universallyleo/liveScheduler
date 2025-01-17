import { type Venue, type Show } from "./types";
import { add, differenceInMinutes, type NearestMinutes } from "date-fns";
import { RawEvent } from "./RawEvent";
import {
    blocksOfMinutes,
    coloniseTimeString,
    // compareInterval,
    indexOfNextTimeFromSorted,
    // sortedIndices,
    toTimeObj,
    toTimeString,
} from "$lib/utils";
// import { sortBy, zip } from "es-toolkit";
// import { toTimeObj } from "$lib/utils";

// export type TimeBlockType = "blank" | "item";

// export interface TimeBlockInfo {
//     idx: number;
//     type: TimeBlockType;
//     length: number;
// }

// function timeRangeBoundaryToTBInfo(
//     startIdx: number,
//     endIdx: number,
//     type: TimeBlockType
// ): TimeBlockInfo {
//     return { idx: startIdx, type: type, length: endIdx - startIdx };
// }

export interface TimeRanges {
    timeMarkings: string[]; // all time markings used
    markingInterval: NearestMinutes; // time difference between adjacent time marking
    displayedBlockDuration: NearestMinutes; // num of minutes in one displayed-time-block
}

export type TimeBlockType = "item" | "rest";

export interface TimeBlockIdxInfo {
    startIdx: number;
    endIdx: number;
    type: TimeBlockType;
    typeIdx: number;
}

export function markingsPerDisplayedBlock(tr: TimeRanges): number {
    return Math.floor(tr.displayedBlockDuration / tr.markingInterval);
}

export class StageEvent extends RawEvent {
    venue: Venue;
    shows: Array<Show>;
    color: string;
    _timeRangeInfo: TimeRanges;
    _timeIndices: number[][];
    _itmWithRestsIdx: TimeBlockIdxInfo[];
    _endTime: string;

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
        this._itmWithRestsIdx = [];
        this._endTime = this.shows[this.shows.length - 1].endTime;
        this._timeRangeInfo = {
            timeMarkings: blocksOfMinutes(start, this._endTime),
            markingInterval: 5,
            displayedBlockDuration: 30,
        };
    }

    set endTime(t: string) {
        this._endTime = t;
    }
    get endTime(): string {
        //const et = toTimeObj(this.shows[this.shows.length-1].endTime, true);
        return this._endTime;
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

    itemTimeIndices(timeMarkings?: string[]): number[][] {
        const marks = timeMarkings ?? this._timeRangeInfo.timeMarkings;
        this._timeIndices = this.shows.map((item) =>
            [item.startTime, item.endTime].map((time) =>
                marks.indexOf(coloniseTimeString(time))
            )
        );
        return this._timeIndices;
    }

    itemsWithRestsTimeIndice(timeInfo?: TimeRanges) {
        const ti = timeInfo ?? this._timeRangeInfo;
        const itemBoundaries =
            timeInfo || this._timeIndices.length == 0
                ? this.itemTimeIndices(ti.timeMarkings)
                : this._timeIndices;
        let ends = 0;
        const itmWithRestIdx: TimeBlockIdxInfo[] = []; // entry is null for empty block; otherwise, corresponding item index

        const numMarkings = markingsPerDisplayedBlock(ti);
        // compute the position of cells containing show item
        // including space between them
        let restIdx = 0;
        for (let i = 0; i < itemBoundaries.length; i++) {
            const [s, t] = itemBoundaries[i];
            if (s > ends) {
                // there is rest block before show item
                // console.group(
                //     `i=${i} (${this.shows[i].name}); [s,t]=[${s},${t}]; ends=${ends}`
                // );
                // first get to next duration boundary
                let pad = ends % numMarkings;
                if (pad > 0) {
                    const newend =
                        s > ends + numMarkings - pad
                            ? ends + numMarkings - pad
                            : s;
                    itmWithRestIdx.push({
                        startIdx: ends,
                        endIdx: newend,
                        type: "rest",
                        typeIdx: restIdx,
                    });
                    ends = newend;
                    restIdx += s == newend ? 0 : 1;
                    // console.log("padded start,  ends=", ends);
                } else {
                    restIdx++; // add restIdx since no pad means previous item ends on boundary
                }
                // fill in blocks of rest durations
                const numDisplayBlocks = ((s - ends) / numMarkings) >> 0; // integer division
                // equivalent to the following, but much faster:
                // const numDisplayBlocks = Math.floor((s - ends) / numMarkings);
                for (let j = 0; j < numDisplayBlocks; j++) {
                    itmWithRestIdx.push({
                        startIdx: ends,
                        endIdx: ends + numMarkings,
                        type: "rest",
                        typeIdx: restIdx,
                    });
                    ends += numMarkings;
                    restIdx++;
                }
                // console.log("rest durations added: ", numDisplayBlocks);
                // pad tailing ends (if there is any)
                pad = s - ends;
                if (pad > 0) {
                    itmWithRestIdx.push({
                        startIdx: ends,
                        endIdx: s,
                        type: "rest",
                        typeIdx: restIdx,
                    });
                    ends += pad;
                    // console.log("padded end, ends=", ends);
                }
            }
            itmWithRestIdx.push({
                startIdx: s,
                endIdx: t,
                type: "item",
                typeIdx: i,
            });
            ends = t;
            // increasing duration count for rest items if current show item passes over next duration mark
            const [is, it] = [s, t].map((x) => (x / numMarkings) >> 0);
            restIdx += it > is ? 1 : 0;
            // console.log("ends: ", ends);
            // console.groupEnd();
        }
        // showsWithRest.push(null);
        this._itmWithRestsIdx = itmWithRestIdx;
        return itmWithRestIdx;
    }
}
