<script lang="ts">
    // import {blocksOfMinutes} from "$lib/utils";
    // import type { NearestMinutes } from "date-fns";
    // let { start, end, duration }: { start: string, end: string, duration: NearestMinutes } = $props();
    let {blocks, duration}:{ blocks: string[], duration: number } = $props();

    // TODO: prepare start time as previous nearest hour of first slot
    // let slots = blocksOfMinutes(start,end,duration);
    // let timeCellStyle = $derived(`timeCell${duration}`);
    // console.log(slots);
</script>

<div class="col" style:grid-template-rows="repeat({blocks.length},{duration/5}em)">
    {#each blocks as time}
        <div class="timeCell">{time}</div>
    {/each}
</div>

<style>
    /* @import "./tt-style.css"; */
.col {
    display: grid;
}

.timeCell {
    padding: 8px;
    /* justify-self: center; */
    align-content:start;
    background-color: #ddd;
    border-bottom: 1px solid #555;
    border-right: 1px solid #555;
    font-weight: bold;
}
</style>
