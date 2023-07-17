<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FIELD_POINT_CENTER } from "../helpers/constants";
import { MathWorld } from "@mauricioroberto/math-world";
import loop from "../loop";
import Menu from "./Menu.vue";
import NewStrategyModal from "./NewStrategyModal.vue";
import ChangeStrategyModal from "./ChangeStrategyModal.vue";
import DeleteStrategyModal from "./DeleteStrategyModal.vue";

const isVisibleMenu = ref(false);
const isVisibleNewStrategyModal = ref(false);
const isVisibleChangeStrategyModal = ref(false);
const isVisibleDeleteStrategyModal = ref(false);

onMounted(() => {
    const WORLD = new MathWorld("world");

    WORLD.default();
    WORLD.drawInformation(true);
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

const openNewStrategyModal = () => {
    isVisibleNewStrategyModal.value = true;
    isVisibleMenu.value = false;
};
const openChangeStrategyModal = () => {
    isVisibleChangeStrategyModal.value = true;
    isVisibleMenu.value = false;
};
const openDeleteStrategyModal = () => {
    isVisibleDeleteStrategyModal.value = true;
    isVisibleMenu.value = false;
};
const toggleMenu = () => (isVisibleMenu.value = !isVisibleMenu.value);
const closeNewStrategyModal = () => (isVisibleNewStrategyModal.value = false);
const closeChangeStrategyModal = () => (isVisibleChangeStrategyModal.value = false);
const closeDeleteStrategyModal = () => (isVisibleDeleteStrategyModal.value = false);
</script>

<template>
    <canvas id="world" class="overflow-hidden"></canvas>
    <Menu v-bind:show-menu="isVisibleMenu" v-on:toggle="toggleMenu()" v-on:open-new-strategy-modal="openNewStrategyModal()" v-on:open-change-strategy-modal="openChangeStrategyModal()" v-on:open-delete-strategy-modal="openDeleteStrategyModal()" />
    <NewStrategyModal v-bind:showModal="isVisibleNewStrategyModal" v-on:close="closeNewStrategyModal()" />
    <ChangeStrategyModal v-bind:showModal="isVisibleChangeStrategyModal" v-on:close="closeChangeStrategyModal()" />
    <DeleteStrategyModal v-bind:showModal="isVisibleDeleteStrategyModal" v-on:close="closeDeleteStrategyModal()" />
</template>

<style scoped></style>
