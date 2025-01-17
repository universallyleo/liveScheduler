<script lang="ts">
    import { quintOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import type { Snippet } from "svelte";
    import { StageEvent } from "./classes/StageEvent";

    // FLIP ANIMATION
    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
                      transform: ${transform} scale(${t});
                      opacity: ${t}
                  `,
            };
        },
    });

    // DRAG AND DROP
    let isOver = $state("");
    const getDraggedParent = (node: HTMLElement | null): DOMStringMap | null =>
        !node
            ? null
            : node.dataset && node.dataset.index
              ? node.dataset
              : getDraggedParent(node.parentNode as HTMLElement | null);
    const start = (ev: DragEvent) => {
        let node = ev.target as HTMLElement;
        console.log("start");
        ev.dataTransfer?.setData("source", node.dataset.index as string);
    };
    const over = (ev: DragEvent) => {
        ev.preventDefault();
        let dragged = getDraggedParent(ev.target as HTMLElement);
        console.log("over");
        // if (isOver !== dragged.id) isOver = JSON.parse(dragged.id??"");
        isOver = `${isOver}` !== dragged?.id ? (dragged?.id ?? "") : isOver;
    };
    const leave = (ev: DragEvent) => {
        let dragged = getDraggedParent(ev.target as HTMLElement);
        console.log("leave");
        isOver = `${isOver}` === dragged?.id ? "" : isOver;
        // if (isOver === dragged.id) isOver = false;
    };
    const drop = (ev: DragEvent) => {
        isOver = "";
        ev.preventDefault();
        console.log("drop");
        let dragged = getDraggedParent(ev.target as HTMLElement);
        let from = ev.dataTransfer?.getData("source") ?? "";
        let to = dragged ? (dragged.index ?? "") : "";
        reorder(from, to);
    };

    // DISPATCH REORDER
    // import { createEventDispatcher } from "svelte";
    // const dispatch = createEventDispatcher();

    // svelte 5 replacement:
    // onsort : fallback prop for dispatching sort event
    // children : slot rendering
    let {
        stages = $bindable([]),
        onsort,
        children,
    }: {
        stages: Array<StageEvent>;
        key?: string;
        onsort?: (l: Array<any>) => void;
        children?: Snippet;
    } = $props();

    let stagesName = $derived(
        stages.map((x) => x.venue.display ?? x.venue.name)
    );

    const reorder = (from: string, to: string) => {
        const [f, t] = [parseInt(from), parseInt(to)];
        // const elt = stages.splice(f, 1)[0]; // Remove the element at "from"
        // stages.splice(t, 0, elt);
        const newList = [...stages];
        newList[f] = [newList[t], (newList[t] = newList[f])][0];
        stages = newList;
        // dispatch("sort", newList);
        if (onsort) onsort(stages);
    };
</script>

{#if stages && stages.length}
    <div
        class="headrow"
        style:grid-template-columns="repeat({stages.length}, 6em)"
    >
        {#each stagesName as name, index (name)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                data-index={index}
                data-id={name}
                draggable="true"
                ondragstart={start}
                ondragover={over}
                ondragleave={leave}
                ondrop={drop}
                in:receive={{ key: name }}
                out:send={{ key: name }}
                animate:flip={{ duration: 300 }}
                class="headcell"
                class:over={name === isOver}
            >
                <!-- <slot {item} {index}> -->
                <!-- replacement for slot: -->
                {#if children}
                    {@render children()}
                {:else}
                    <p>{name}</p>
                {/if}
                <!-- </slot> -->
            </div>
        {/each}
    </div>
{/if}

<style>
    .over {
        border-color: rgba(48, 12, 200, 0.2);
    }

    .headrow {
        position: sticky;
        border-bottom: 1px solid black;
        display: grid;
        gap: 2px;
        /* grid-template-columns: repeat(var(--numStages), 2em); */
    }

    .headcell {
        border: 1px solid #999;
        margin: 0 1px;
        text-align: center;
        /* display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 2px;
        align-items: center;
        justify-content: space-between; */
    }
</style>
