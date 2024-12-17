<script lang="ts">
    // import type { NearestMinutes } from "date-fns";
    import ShowItem from "./ShowItem.svelte";
    import type { StageEvent } from "./classes/StageEvent";
    import type { Show } from "./classes/types";
    let { stage, timeBlocks }: { stage: StageEvent, timeBlocks: string[] } = $props();

    // TODO: prepare start time as previous nearest hour of first slot
    
    function computeLayout():{styleStr: string, showsWithRests: Array<Show|null>}{
        const itemBoundaries = stage.itemTimeIndices(timeBlocks);
        console.log(itemBoundaries)
        let ends = 0;
        let res = "";
        let showsWithRest = []; // entry is null for empty block; otherwise, corresponding item index
        for (let i=0; i<itemBoundaries.length; i++){
            const [s,t]=itemBoundaries[i];
            if (s>ends){
                res+=`${s-ends}em `; // 1em per 5min.
                showsWithRest.push(null);
            }
            res+=`${t-s}em `;
            showsWithRest.push(stage.shows[i]);
            ends = t;
        }
        res += "auto";
        return {styleStr: res, showsWithRests: showsWithRest};
    }

    let {styleStr,showsWithRests: showsWithRest}=$derived(computeLayout());
    $inspect(styleStr);
    $inspect(showsWithRest);
</script>

<div class="col" style:grid-template-rows={styleStr}>
    {#each showsWithRest as show}
        {#if show===null}
            <div class="emptyCell"></div>
        {:else}
            <ShowItem {show} color={stage.color}></ShowItem>
        {/if}
    {/each}
</div>

<style>
    /* @import "./tt-style.css"; */
    .col {
        display: grid;
        /* gap: 0px; */
    }
    .emptyCell{
        /* display: hidden; */
        background-color:#eee;
        height: 100%;
    }
</style>
