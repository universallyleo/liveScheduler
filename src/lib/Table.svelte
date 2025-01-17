<script lang="ts">
    import type { NearestMinutes } from "date-fns";
    import { FesEvent } from "./classes/FesEvent";
    import StageColumn from "./StageColumn.svelte";
    import type { TimeRanges } from "./classes/StageEvent";
    import TimeColumn from "./TimeColumn.svelte";
    // import DragColumns from "./DragColumns.svelte";
    // import { blocksOfMinutes, coloniseTimeString } from "./utils";
    // import {chunk} from "es-toolkit";

    let { fes }: { fes: FesEvent } = $props();

    let duration: NearestMinutes = 30;
    let stages = $state(fes.stages);
    let numStages = $state(fes.stages.length);
    let timeBlocks = $state(fes.refinedTimeBlocks(duration));
    $inspect(timeBlocks);
    // take only one time label for every (duration/5) of them
    // (e.g. duration=30 => 5min blocks x6 => take one label for every 6)
    let durationBlocks = $derived(
        timeBlocks.filter((_, i) => i % (duration / 5) === 0)
    );
    let timeInfo: TimeRanges = $derived({
        timeMarkings: timeBlocks,
        markingInterval: 5,
        displayedBlockDuration: duration,
    });
    // $inspect(durationBlocks);

    // function moveStage(from: number, to: number) {
    //     console.log("from ", from, " to ", to);
    //     if (
    //         from < 0 ||
    //         from >= stages.length ||
    //         to < 0 ||
    //         to >= stages.length
    //     ) {
    //         return;
    //         // throw new Error("Index out of bounds");
    //     }

    //     const elt = stages.splice(from, 1)[0]; // Remove the element at "from"
    //     stages.splice(to, 0, elt);
    //     console.log(stages.map((x) => x.venue.name));
    //     stages = stages;
    // }
</script>

<!-- <div class="tbl"> -->
<!-- !! Really should have grid columns, one column contain both venue label and full timetable
     !! this allows proper transitioning animation on full column
    -->

<!-- <div
    class="headrow"
    style:grid-template-columns="4em repeat({numStages}, 6em)"
    > -->
<!-- <div class="headcell">Time</div> -->
<!-- {#each stages as stage,i}
            <div class="headcell" style:background-color={stage.color}> 
                <button onclick={()=>moveStage(i,i-1)}>&lt;</button>
                <div class="headcell-content">{stage.venue.display??stage.venue.name} </div>
                <button onclick={()=>moveStage(i,i+1)}>&gt;</button>
            </div>
        {/each} -->
<!-- </div> -->
<!-- <DragColumns bind:stages {timeInfo} /> -->
<div class="tbl" style:grid-template-columns="4em repeat({numStages}, 6em)">
    <TimeColumn blocks={durationBlocks} {duration}></TimeColumn>
    {#each stages as stage}
        <StageColumn {stage} {timeInfo}></StageColumn>
    {/each}
</div>

<!-- </div> -->

<style>
    /* @import "./tt-style.css"; */
    .tbl {
        /* display: flex;
    flex-direction: row;
    flex-wrap: nowrap; */
        display: grid;
        grid-template-rows: 1fr auto;
        min-height: 80%;
        border: 1px solid black;
        gap: 2px;
        width: fit-content;
        justify-items: stretch;
    }

    .headrow {
        position: sticky;
        border-bottom: 1px solid black;
        display: grid;
        gap: 2px;
        /* grid-template-columns: repeat(var(--numStages), 2em); */
    }
    /* 
    .headcell {
        border: 1px solid #999;
        margin: 0 1px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        gap: 2px;
    } */

    /* .headcell-content {
        max-width: 4em;
        text-align: center;
        overflow-wrap: break-word;
        white-space: normal;
    } 
    .headcell > button:first-child {
        height: 100%;
        justify-self: left;
    }
    .headcell > button:last-child {
        height: 100%;
        justify-self: left;
    }*/
</style>
