<script lang="ts">
    import ShowItem from "./ShowItem.svelte";
    import type {
        TimeRanges,
        StageEvent,
        TimeBlockType,
    } from "./classes/StageEvent";
    import type { Show } from "./classes/types";

    let { stage, timeInfo }: { stage: StageEvent; timeInfo: TimeRanges } =
        $props();

    // {
    //     const blocks = stage.itemsWithRestsTimeIndice(timeInfo);
    //     const showsWithRests = [];
    //     let styleStr = "3em ";
    //     for (const itm of blocks) {
    //         // console.log("block: ", itm);
    //         styleStr += `${itm.endIdx - itm.startIdx}em `; // 1em per marking
    //         showsWithRests.push(
    //             itm.type === "item"
    //                 ? { show: stage.shows[itm.typeIdx], type: itm.type }
    //                 : {
    //                       show: null,
    //                       type: itm.type,
    //                       style: `emptyCell ${itm.typeIdx % 2 === 0 ? "darkBG" : "lightBG"}`,
    //                   }
    //         );
    //     }
    //     return { styleStr, showsWithRests };
    // }
    // function computeLayout(): {
    //     styleStr: string;
    //     showsWithRests: Array<ShowAndStyle>;
    // }
    // {
    //     const itemBoundaries = stage.itemTimeIndices(timeInfo.timeMarkings);
    //     // let startOffset = 0;
    //     // if (timeInfo.timeBlocks[0].slice(-2) !== "00") {
    //     //     const timeobj = new TimeString(timeInfo.timeBlocks[0]);
    //     //     const nearestHr = roundToNearestHours(timeobj.DTO(), {
    //     //         roundingMethod: "floor",
    //     //     });
    //     //     startOffset = Math.floor(
    //     //         differenceInMinutes(nearestHr, timeobj.DTO()) / 5
    //     //     );
    //     // }
    //     // const durationBoundaries = sortedIndices(
    //     //     timeInfo.durationBlocks,
    //     //     timeInfo.timeBlocks
    //     // ); // do not need starting boundary
    //     // console.log("item bdry:", itemBoundaries);
    //     // console.log("duration bdry:", durationBoundaries);
    //     let ends = 0;
    //     let res = "3em ";
    //     let showsWithRest = []; // entry is null for empty block; otherwise, corresponding item index

    //     let durationLen = Math.floor(timeInfo.displayedBlockDuration / 5); // how many 5 min. is in each duration
    //     // compute the position of cells containing show item
    //     // including space between them
    //     for (let i = 0; i < itemBoundaries.length; i++) {
    //         const [s, t] = itemBoundaries[i];
    //         if (s > ends) {
    //             // there is rest block before show item
    //             console.group(
    //                 `i=${i} (${stage.shows[i].name}); [s,t]=[${s},${t}]; ends=${ends}`
    //             );
    //             // first get to next duration marker
    //             let pad = ends % durationLen;
    //             let temp = "";
    //             if (pad > 0) {
    //                 showsWithRest.push(null);
    //                 if (s > ends + durationLen - pad) {
    //                     temp += `${durationLen - pad}em `;
    //                     ends += durationLen - pad;
    //                 } else {
    //                     temp += `${s - ends}em `;
    //                     ends = s;
    //                 }
    //                 console.log("padded start: ", temp, ".  ends=", ends);
    //             }
    //             // fill in blocks of rest durations
    //             let numDurationBlock = Math.floor((s - ends) / durationLen);
    //             for (let j = 0; j < numDurationBlock; j++) {
    //                 showsWithRest.push(null);
    //                 temp += `${durationLen}em `;
    //                 ends += durationLen;
    //             }
    //             console.log("rest durations added: ", numDurationBlock);
    //             // pad tailing ends (if there is any)
    //             pad = s - ends;
    //             if (pad > 0) {
    //                 showsWithRest.push(null);
    //                 temp += `${s - ends}em `;
    //                 ends += pad;
    //                 console.log("padded end: ", temp, ".  ends=", ends);
    //             }
    //             res += temp;
    //             // }
    //         }
    //         res += `${t - s}em `;
    //         showsWithRest.push(stage.shows[i]);
    //         ends = t;
    //         console.groupEnd();
    //     }
    //     showsWithRest.push(null);
    //     res += "auto";

    //     return { styleStr: res, showsWithRests: showsWithRest };
    // }

    // let { styleStr, showsWithRests } = $derived(computeLayout());
    let showsWithRests = $derived(stage.itemsWithRestsTimeIndice(timeInfo));
    let styleStr = $derived(
        showsWithRests.reduce(
            (prev, { startIdx, endIdx }) => prev + `${endIdx - startIdx}em `,
            `3em `
        )
    ); // 1em per marking
    $inspect(styleStr);
    $inspect(showsWithRests);
</script>

<div class="col" style:grid-template-rows={styleStr}>
    <div class="heading">
        {stage.venue.display ?? stage.venue.name}
    </div>
    {#each showsWithRests as itm}
        {#if itm.type === "rest"}
            <div
                class={[
                    "emptyCell",
                    { lightBG: itm.typeIdx % 2 === 1 },
                    { darkBG: itm.typeIdx % 2 === 0 },
                ]}
            ></div>
            <!-- <div class={"darkBG":itm.typeIdx%2===0}></div> -->
        {:else}
            <ShowItem show={stage.shows[itm.typeIdx]} color={stage.color}
            ></ShowItem>
        {/if}
    {/each}
</div>

<style>
    /* @import "./tt-style.css"; */
    .col {
        min-width: 4em;
        display: grid;
        /* gap: 0px; */
    }
    .heading {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow-wrap: break-word; /* Allow long words to wrap */
        word-wrap: break-word; /* Fallback for older browsers */
        word-break: break-word; /* Handle breaking inside words */
        white-space: normal;
    }

    .emptyCell {
        /* display: hidden; */
        border-collapse: collapse;
        height: 100%;
    }

    .darkBG {
        background-color: hsl(0, 0%, 90%);
    }
    .lightBG {
        background-color: hsl(0, 0%, 95%);
    }
</style>
