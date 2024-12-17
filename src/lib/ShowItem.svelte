<script lang="ts">
    import type { Show } from "./classes/types";
    import { coloniseTimeString } from "./utils";
    let { show, color }: { show: Show, color:string } = $props();
</script>

<div class="card" style:background-color={color}>
    {show.name}
    <div class="time">{coloniseTimeString(show.startTime)} ~ {coloniseTimeString(show.endTime)}</div>
</div>

<style>
    .card{
        border-radius: 5px;
        margin: auto 0;
        padding: .2em;
        border: 1px solid #999;
        min-width: 2em;
        /* min-height: 2ch; */
        height: 100%;
        box-sizing: border-box;;
        text-shadow:
        -1px -1px 0 #fff,
        1px -1px 0 #fff,
        -1px 1px 0 #fff,
        1px 1px 0 #fff;  
        /* allow child div to appear at bottom */
        display:grid;
        grid-template-rows: 1fr auto;
    }

    .time{
        font-size: smaller;
        justify-self:end;
        color: white;
        text-shadow:none;
    }
</style>

