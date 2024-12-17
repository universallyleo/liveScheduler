import {
    format,
    parse,
    eachMinuteOfInterval,
    roundToNearestMinutes,
    type NearestMinutes,
    type RoundingMethod,
} from "date-fns";
import { TimeString } from "./classes/TimeString";

export function coloniseTimeString(time: string): string {
    return time[2] === ":" ? time : `${time.slice(0, 2)}:${time.slice(2)}`;
}

export function toTimeString(dt: Date, short: boolean = false): string {
    const time = format(dt, "HH:mm") ?? "00:00";
    return `${time.slice(0, 2)}${short ? "" : ":"}${time.slice(3, 5)}`;
}
// export function toTimeString(dt: Date): string {
//     return new TimeString(dt).time;
// }

export function toTimeObj(time: string): Date {
    return parse(coloniseTimeString(time), "HH:mm", new Date());
}

// function bindTimeStringToDateObj(date: Date, time: string): Date {
//     const [h, m] = coloniseTimeString(time).split(":");
//     return add(date, {
//         hours: parseInt(h),
//         minutes: parseInt(m),
//     });
// }

// export class TimeString {
//     _time!: Date;
//     _date: Date;
//     constructor(time: string, date?: string | Date) {
//         console.log("TimeString created");
//         console.log(this._date);
//     }
//     set date(date: string | Date) {
//         if (typeof date === "string") {
//             this._date = new Date(`${date}T00:00`);
//             this.date = date;
//         } else {
//             this._date = date;
//             this.date = format(date, "yyyy-MM-dd");
//         }
//     }
//     get time(): string {
//         return toTimeString(this._time);
//     }
//     set time(time: string) {
//         this._time = bindTimeStringToDateObj(this._date, time);
//         this.time = time;
//     }

//     get timeObj(): Date {
//         return this._date;
//     }
//     set timeObj(obj: Date) {
//         this._time = obj;
//     }
// }

export function indexOfNextTimeFromSorted(t: Date, times: Date[]): number {
    for (const [i, time] of times.entries()) {
        if (t > time) {
            return i;
        }
    }
    return times.length;
}

export const sortDate = (a: Date, b: Date) => (a < b ? -1 : a > b ? 1 : 0);

export function maxDateTime(arr: Date[]): Date {
    // console.log("maxDateTime input: ", arr);
    let max = arr[0];
    for (const dt of arr) {
        max = dt > max ? dt : max;
    }
    // console.log("maxDateTime out:", max);
    return max;
}

/**
 * @param  {string} start
 * @param  {string} end
 * @param  {NearestMinutes=5} duration
 * @param  {NearestMinutes=30} roundingTo
 * @returns string[] of time, 5 minutes for each entry, starting with nearest minute according to roundingTo
 */
export function blocksOfMinutes(
    start: string,
    end: string,
    duration: NearestMinutes = 5,
    roundingTo: NearestMinutes = 30
): string[] {
    const _start = new TimeString(start),
        _end = new TimeString(end);
    const round: RoundingMethod[] = ["floor", "ceil"];
    const [adjustedStart, adjustedEnd] = [_start, _end].map((t, i) =>
        roundToNearestMinutes(t.DTO(), {
            nearestTo: roundingTo,
            roundingMethod: round[i],
        })
    );
    return eachMinuteOfInterval(
        { start: adjustedStart, end: adjustedEnd },
        { step: duration }
    ).map((x) => new TimeString(x).time);
}
