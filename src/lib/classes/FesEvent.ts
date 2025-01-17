import { type FesOption } from "./types";
import { type StageEvent } from "./StageEvent";
import { RawEvent } from "./RawEvent";
import {
    maxDateTime,
    toTimeObj,
    toTimeString,
    blocksOfMinutes,
} from "$lib/utils";
import { max, type NearestMinutes } from "date-fns";

export class FesEvent extends RawEvent {
    stages: Array<StageEvent>;
    link: string;
    remark: string;
    _timeBlocks: string[];
    _durationTime: NearestMinutes;
    _cellTime: NearestMinutes;

    //TODO: change to initialise from RawFes data
    constructor(
        date: string,
        open: string,
        start: string,
        stages: Array<StageEvent>,
        opt?: FesOption
    ) {
        super(date, open, start);
        this.stages = stages;
        this.link = opt?.link ?? "";
        this.remark = opt?.remark ?? "";
        this._durationTime = 30;
        this._cellTime = 5;
        this._timeBlocks = blocksOfMinutes(this.openTime, this.endTime);
    }

    // setRemark(r:string){ this.remark=r; }
    // setLink(url:string){ this.link=url; }
    get endTime(): string {
        return toTimeString(
            maxDateTime(this.stages.map((s) => toTimeObj(s.endTime)))
        );
    }

    refinedTimeBlocks(
        durationTime: NearestMinutes = 30,
        cellTime: NearestMinutes = 5
    ): string[] {
        this._durationTime = durationTime;
        this._cellTime = cellTime;
        this._timeBlocks = blocksOfMinutes(
            this.openTime,
            this.endTime,
            cellTime,
            durationTime
        );
        return this._timeBlocks;
    }

    blockIndices(): number[][][] {
        return this.stages.map((stage) =>
            stage.itemTimeIndices(this._timeBlocks)
        );
    }

    alignEndTime(): void {
        const m = toTimeString(
            max(this.stages.map((stage) => toTimeObj(stage.endTime)))
        );
        for (const s of this.stages) {
            s.endTime = m;
        }
    }

    // rearrangeStage(from: number, to: number): Array<StageEvent> {
    //     if (
    //         from < 0 ||
    //         from >= this.stages.length ||
    //         to < 0 ||
    //         to >= this.stages.length
    //     ) {
    //         throw new Error("Index out of bounds");
    //     }

    //     const elt = this.stages.splice(from, 1)[0]; // Remove the element at "from"
    //     this.stages.splice(to, 0, elt);
    //     return this.stages;
    // }

    // durationDay(): number {}
}
