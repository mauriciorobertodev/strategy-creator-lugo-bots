<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FIELD_POINT_CENTER } from "../helpers/constants";
import { MathWorld } from "@mauricioroberto/math-world";
import loop from "../loop";
import Menu from "./Menu.vue";
import NewStrategyModal from "./NewStrategyModal.vue";
import ChangeStrategyModal from "./ChangeStrategyModal.vue";
import DeleteStrategyModal from "./DeleteStrategyModal.vue";
import NewFormationModal from "./NewFormationModal.vue";
import DeleteFormationModal from "./DeleteFormationModal.vue";
import DeleteFieldZoneModal from "./DeleteFieldZoneModal.vue";

const isVisibleMenu = ref(false);
const isVisibleNewStrategyModal = ref(false);
const isVisibleChangeStrategyModal = ref(false);
const isVisibleDeleteStrategyModal = ref(false);
const isVisibleNewFormationModal = ref(false);
const isVisibleDeleteFormationModal = ref(false);
const isVisibleDeleteFieldZoneModal = ref(false);

let delete_formation_uuid = "";

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

const openDeleteFieldZoneModal = () => {
    isVisibleDeleteFieldZoneModal.value = true;
    isVisibleMenu.value = false;
};
const openNewStrategyModal = () => {
    isVisibleNewStrategyModal.value = true;
    isVisibleMenu.value = false;
};
const openDeleteFormationModal = (uuid: string) => {
    isVisibleDeleteFormationModal.value = true;
    isVisibleMenu.value = false;
    delete_formation_uuid = uuid;
};
const openNewFormationModal = () => {
    isVisibleNewFormationModal.value = true;
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
const closeNewFormationModal = () => (isVisibleNewFormationModal.value = false);
const closeDeleteFormationModal = () => (isVisibleDeleteFormationModal.value = false);
const closeDeleteFieldZoneModal = () => (isVisibleDeleteFieldZoneModal.value = false);
</script>

<template>
    <canvas id="world" class="overflow-hidden"></canvas>
    <Menu
        v-on:toggle="toggleMenu()"
        v-bind:show-menu="isVisibleMenu"
        v-on:open-new-strategy-modal="openNewStrategyModal()"
        v-on:open-new-formation-modal="openNewFormationModal()"
        v-on:open-change-strategy-modal="openChangeStrategyModal()"
        v-on:open-delete-strategy-modal="openDeleteStrategyModal()"
        v-on:open-delete-formation-modal="openDeleteFormationModal"
        v-on:open-delete-field-zone="openDeleteFieldZoneModal()"
    />
    <NewStrategyModal v-bind:showModal="isVisibleNewStrategyModal" v-on:close="closeNewStrategyModal()" />
    <ChangeStrategyModal v-bind:showModal="isVisibleChangeStrategyModal" v-on:close="closeChangeStrategyModal()" />
    <DeleteStrategyModal v-bind:showModal="isVisibleDeleteStrategyModal" v-on:close="closeDeleteStrategyModal()" />
    <NewFormationModal v-bind:showModal="isVisibleNewFormationModal" v-on:close="closeNewFormationModal()" />
    <DeleteFormationModal v-bind:showModal="isVisibleDeleteFormationModal" v-bind:formation_uuid="delete_formation_uuid" v-on:close="closeDeleteFormationModal()" />
    <DeleteFieldZoneModal v-bind:show-modal="isVisibleDeleteFieldZoneModal" v-on:close="closeDeleteFieldZoneModal()" />
</template>

<style scoped></style>
