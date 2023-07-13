<script setup lang="ts">
import { onMounted } from "vue";
import { FIELD_POINT_CENTER } from "../helpers/constants";
import { MathWorld } from "@mauricioroberto/math-world";
import loop from "../loop";

onMounted(() => {
    const WORLD = new MathWorld("world");

    WORLD.default();
    WORLD.drawInformation(false);
    WORLD.setCameraMaxZoom(1000);
    WORLD.setCameraMinZoom(1);
    WORLD.drawAxis(false);
    WORLD.drawGrid(false);
    WORLD.setGridSize(1);
    WORLD.setCameraZoom(8.5);
    WORLD.moveCameraToCartesianPlane(FIELD_POINT_CENTER.clone().add({ x: 0, y: 250 }));
    WORLD.setDebugMouseMode("off");
    WORLD.loop(loop(WORLD));
    WORLD.start();
});
</script>

<template>
    <canvas id="world" class="overflow-hidden"></canvas>
</template>

<style scoped></style>
