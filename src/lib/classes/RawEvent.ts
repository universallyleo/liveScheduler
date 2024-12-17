import { format, parse, add } from "date-fns";
import { toTimeString } from "$lib/utils";
import { TimeString } from "./TimeString";

export class RawEvent {
    _date: Date;
    _openTime: Date;
    _startTime: Date;
    remark: string;

    constructor(date: string, open: string, start: string) {
        this._date = parse(date, "yyyy-MM-dd", new Date());
        this._openTime = new TimeString(open).DTO();
        this._startTime = new TimeString(start).DTO();
        this.remark = "";
    }

    // setRemark(r:string){ this.remark=r; }
    // setLink(url:string){ this.link=url; }
    get date(): string {
        return format(this._date, "yyyy-MM-dd");
    }
    set date(date: string) {
        this._date = parse(date, "yyyy-MM-dd", new Date());
    }

    get openTime(): string {
        return toTimeString(this._openTime);
    }
    set openTime(time: string) {
        const [h, m] = new TimeString(time).HHmm();
        this._openTime = add(this._date, { hours: h, minutes: m });
    }

    get startTime(): string {
        return toTimeString(this._startTime);
    }
    set startTime(time: string) {
        const [h, m] = new TimeString(time).HHmm();
        this._startTime = add(this._date, { hours: h, minutes: m });
    }
}
