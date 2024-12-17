import { coloniseTimeString } from "$lib/utils";
import { add } from "date-fns/add";

// Handle string that represents time
// inlcudes HH:mm and HHmm format
// hour number can be > 24
export class TimeString {
    _time!: string; // exclamation mark tells compiler that _time is already initialised via setter in constructor
    _HH!: number;
    _mm!: number;
    constructor(time: string | Date) {
        this.time = time;
    }
    get time(): string {
        return this._time;
    }
    set time(time: string | Date) {
        this._time =
            typeof time === "string"
                ? coloniseTimeString(time)
                : `${String(time.getHours()).padStart(2, "0")}:${String(
                      time.getMinutes()
                  ).padStart(2, "0")}`;
        [this._HH, this._mm] = this._time.split(":").map((x) => parseInt(x));
    }

    addMinutes(mins: string | number) {
        const nMins = typeof mins === "string" ? parseInt(mins) : mins;
        let newMin = this._mm + nMins;
        let shiftHour = 0;
        if (newMin >= 60) {
            newMin = newMin % 60;
            shiftHour = newMin / 60;
        } else {
            while (newMin < 0) {
                newMin += 60;
                shiftHour -= 1;
            }
        }
        return `${this._HH + shiftHour}:${newMin}`;
    }

    HHmm(): number[] {
        return [this._HH, this._mm];
    }

    DTO(): Date {
        // return a date time object
        return add(new Date(`1900-01-01T00:00`), {
            hours: this._HH,
            minutes: this._mm,
        });
    }
}
