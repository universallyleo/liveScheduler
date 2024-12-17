<script lang="ts">
    // import Column from "$lib/Column.svelte";
    import Table from "$lib/Table.svelte";
    import { FesEvent } from "$lib/classes/FesEvent";
    import { StageEvent } from "$lib/classes/StageEvent";
    // import Table from "$lib/Table.svelte";

    let date="2024-12-18";

    // let shows = [
    //     { name: "Jiemei", startTime: "1200", endTime: "1230" },
    //     { name: "0start", startTime: "1230", endTime: "1300" },
    //     { name: "TENRIN", startTime: "1305", endTime: "1335" },
    //     { name: "iLife!", startTime: "1335", endTime: "1405" },
    // ];
    // let shows2 = [
    //     { name: "Nonfic", startTime: "1210", endTime: "1240" },
    //     { name: "STN", startTime: "1240", endTime: "1310" },
    //     { name: "LADYBABY", startTime: "1310", endTime: "1340" },
    //     { name: "LEIWAN", startTime: "1340", endTime: "1410" },
    // ];
    let shows = [
        { name: "TENRIN", startTime: "1420", endTime: "1445" },
        { name: "i-COL", startTime: "1540", endTime: "1605" },
        { name: "＃ババババンビ", startTime: "1850", endTime: "1915" },
        { name: "iLife!", startTime: "1925", endTime: "1950" },
        {name: "終演後特典 iLife!/＃ババババンビ", startTime: "2010", endTime: "2110" }
    ];
    let shows2 = [
        { name: "夏空のオリオン", startTime: "1300", endTime: "1325" },
        { name: "0start", startTime: "1325", endTime: "1350" },
        { name: "LADYBABY", startTime: "1515", endTime: "1540" },
        { name: "＃212", startTime: "1730", endTime: "1755" },
        { name: "INUWASI", startTime: "1925", endTime: "1950" },
        { name: "終演後特典 INUWASI", startTime: "2000", endTime: "2100" },
    ];
    let shows3 = [
        { name: "Snow Complex", startTime: "1400", endTime: "1420" },
        { name: "0start", startTime: "1805", endTime: "1825" },
        { name: "TENRIN", startTime: "1930", endTime: "1955" },
    ];
    let bb1 = [
        { name: "TENRIN", startTime: "1500", endTime: "1550" },
        { name: "LADYBABY", startTime: "1600", endTime: "1700" },
        { name: "TENRIN", startTime: "1700", endTime: "1750" },
    ];
    let bb2 = [{ name: "i-COL", startTime: "1630", endTime: "1730" }];
    let bb3 = [
        { name: "夏空のオリオン", startTime: "1340", endTime: "1440" },
        { name: "＃212", startTime: "1805", endTime: "1905" },
    ];
    let bb32 = [{ name: "0start", startTime: "1400", endTime: "1500" },];
    let bb4 = [
        { name: "Snow Complex", startTime: "1430", endTime: "1530" },
        { name: "0start", startTime: "1845", endTime: "1945" },
        { name: "＃212", startTime: "1805", endTime: "1905" },
    ];
    

    //"#E4734C"

    let stage = new StageEvent(date,"1230","1300",{name:"ReNY"},shows, "#ca4989");
    let stage2 = new StageEvent(date,"1130","1210",{name:"Zephyr"},shows2, "#9711cf");
    let stage3 = new StageEvent(date,"1250","1320",{name:"RAD HALL"},shows3, "#00b745");
    let bbEvt = new StageEvent(date,"1400","1400",{name:"Gas Hall A2"},bb1, "#ff65b1");
    let bbEvt2 = new StageEvent(date,"1430","1430",{name:"Gas Hall A1"},bb2, "#ff65b1");
    let bbEvt3 = new StageEvent(date,"1340","1340",{name:"Zephyr C1"},bb3, "#c065ff");
    let bbEvt32 = new StageEvent(date,"1340","1340",{name:"Zephyr C2"},bb32, "#c065ff");
    let bbEvt4 = new StageEvent(date,"1350","1350",{name:"RADHALL特典"},bb4, "#91E44C");

    let fesEvt = [stage2,bbEvt3,bbEvt32,stage,bbEvt,bbEvt2,stage3,bbEvt4];
    // let fesEvt = [stage,stage2,bbEvt];

    let fes = new FesEvent(date, "1230", "1300", fesEvt);
    
    // let v = { name: "Shibuya Veats", display: "Veats", slots: shows };
</script>

<div class='main'>
    <Table {fes}></Table>
<!-- <Column {stage}></Column> -->
</div>

<style>
    .main{
        width: 70%;
        margin: 0 auto;
        font-family: Arial, Helvetica, sans-serif ;
        font-weight: bold;
    }
</style>