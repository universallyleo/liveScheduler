<script lang="ts">
    const { h, pos }: { h: number; pos: number[] } = $props();
</script>

<!-- use pos to determine height width viewBox boundary -->
<svg
    height="{h}em"
    width="100%"
    viewBox="0 0 100 {h * 10}"
    xmlns="http://www.w3.org/2000/svg"
    style="border: 1px solid black;width:100%"
>
    <g>
        {#each pos as p}
            <path
                stroke-dasharray="5,2"
                d="M0 {p} 100 {p}"
                style="stroke:blue;stroke-width:1;fill:none;"
            />
        {/each}
    </g>
</svg>
