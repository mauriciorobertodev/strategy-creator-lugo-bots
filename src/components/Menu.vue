<script setup lang="ts">
import global from "../global";
import download from "downloadjs";
import { FREE_MODE_UUID } from "../helpers/constants";
import NewFieldZone from "./NewFieldZone.vue";

import { exportTeamPositions, exportCurrentStrategy, exportFormationsOfStrategy, exportFieldZonesOfStrategy, exportFormationNamesOfStrategy } from "../helpers/export";
import { importTeamPositions } from "../helpers/import-export";

defineProps({ showMenu: Boolean });
defineEmits(["toggle", "open-new-strategy-modal", "open-change-strategy-modal", "open-delete-strategy-modal", "open-new-formation-modal", "open-delete-formation-modal", "open-delete-field-zone"]);

const exportFieldZones = () => {
    const fieldZonesOfStrategy = exportFieldZonesOfStrategy();
    const data = encodeURI("data:text/json;charset=utf-8," + JSON.stringify(fieldZonesOfStrategy));
    download(data, "field-zones.json", "application/json;charset=utf-8");
};

const exportFormationNames = () => {
    const formationNamesOfStrategy = exportFormationNamesOfStrategy();
    const data = encodeURI("data:text/json;charset=utf-8," + JSON.stringify(formationNamesOfStrategy));
    download(data, "names.json", "application/json;charset=utf-8");
};

const exportFormations = () => {
    const formationsOfStrategy = exportFormationsOfStrategy();
    const data = encodeURI("data:text/json;charset=utf-8," + JSON.stringify(formationsOfStrategy));
    download(data, "formations.json", "application/json;charset=utf-8");
};

const exportCurrentPositions = () => {
    const playersToExport = exportTeamPositions();
    const data = encodeURI("data:text/json;charset=utf-8," + JSON.stringify(playersToExport));
    download(data, "positions.json", "application/json;charset=utf-8");
};

const exportStrategy = () => {
    const strategyToExport = exportCurrentStrategy();
    const data = encodeURI("data:text/json;charset=utf-8," + JSON.stringify(strategyToExport));
    download(data, "strategy.json", "application/json;charset=utf-8");
};

const uploadTeamPositions = (e: any) => {
    const jsonFile = e.target.files[0] as File;

    if (jsonFile.type.toLowerCase() != "application/json") {
        alert("Somente JSON");
        return;
    }

    importTeamPositions(jsonFile);
    const input = document.querySelector<HTMLInputElement>("#upload_positions");
    if (input) input.value = "";
};
</script>

<template>
    <div>
        <div class="fixed top-0 right-0 z-50 flex items-end justify-end w-min">
            <div class="flex items-center justify-between h-12 bg-white min-w-[320px]">
                <div class="flex items-center gap-4">
                    <p class="pl-4" v-text="global.getCurrentStrategy().getName()"></p>
                </div>
                <button v-on:click="$emit('toggle')" class="flex items-center justify-center w-12 h-12">
                    <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <svg v-if="showMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        <Transition enter-active-class="duration-300" enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100" leave-active-class="duration-300" leave-from-class="translate-x-0 opacity-100" leave-to-class="translate-x-full opacity-0">
            <div v-show="showMenu" class="fixed right-0 flex flex-col items-center justify-between h-screen gap-4 space-y-4 overflow-hidden transition-all bg-white trnasform pt-14 w-80">
                <div v-if="!global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()" class="w-full px-4 pb-4 space-y-4 overflow-y-auto">
                    <!-- formações -->
                    <div v-if="!global.isFreeMode()" class="space-y-2">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Formações</p>
                        <template v-for="formation in global.getCurrentStrategy().getFormations()" v-bind:key="formation.getUuid()">
                            <div class="flex gap-2">
                                <!-- botão de troca -->
                                <button
                                    type="button"
                                    v-on:click="global.setCurrentFormation(formation.getUuid())"
                                    v-bind:class="{ button: global.getCurrentStrategy().getCurrentFormation().getUuid() === formation.getUuid(), 'button-ghost': global.getCurrentStrategy().getCurrentFormation().getUuid() != formation.getUuid() }"
                                    class="!justify-between items-center text-sm !h-10 uppercase truncate"
                                >
                                    <p class="truncate">{{ formation.getName() }}</p>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                </button>
                                <!-- botão de exclusão -->
                                <button
                                    v-if="global.getCurrentStrategy().getFormations().length > 1"
                                    v-on:click="$emit('open-delete-formation-modal', formation.getUuid())"
                                    type="button"
                                    class="flex items-center justify-center w-12 h-10 text-red-500 uppercase border border-red-200 rounded-md hover:border-red-500 hover:text-white hover:bg-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </template>
                        <!-- botão de criação -->
                        <button type="button" class="text-sm !h-10 uppercase button-secondary gap-2" v-on:click="$emit('open-new-formation-modal')">
                            nova formação
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                            </svg>
                        </button>
                    </div>

                    <!-- colunas -->
                    <div v-if="global.isFreeMode()">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Colunas</p>
                        <div class="flex items-center justify-center">
                            <button v-on:click="global.decrementCol()" class="rounded-none rounded-l button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                </svg>
                            </button>
                            <p v-text="global.getCurrentStrategy().getCols()" class="flex items-center justify-center flex-grow w-full h-10 border-t border-b border-gray-100"></p>
                            <button v-on:click="global.incrementCol()" class="rounded-none rounded-r button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- linhas -->
                    <div v-if="global.isFreeMode()">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Linhas</p>
                        <div class="flex items-center justify-center">
                            <button v-on:click="global.decrementRow()" class="rounded-none rounded-l button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                </svg>
                            </button>
                            <p v-text="global.getCurrentStrategy().getRows()" class="flex items-center justify-center flex-grow w-full h-10 border-t border-b border-gray-100"></p>
                            <button v-on:click="global.incrementRow()" class="rounded-none rounded-r button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- trocar lado do campo -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Lado do campo</p>
                        <div class="flex">
                            <button v-on:click="global.setSide('HOME')" v-bind:class="{ button: global.isHomeSide(), 'button-secondary': global.isAwaySide() }" class="uppercase rounded-none rounded-l">HOME</button>
                            <button v-on:click="global.setSide('AWAY')" v-bind:class="{ button: global.isAwaySide(), 'button-secondary': global.isHomeSide() }" class="uppercase rounded-none rounded-r">AWAY</button>
                        </div>
                    </div>

                    <!-- exibir colunas e linhas -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Exibir colunas e linhas</p>
                        <div class="flex">
                            <button v-on:click="global.setShowColsAndRows(true)" v-bind:class="{ button: global.showColsAndRows(), 'button-secondary': !global.showColsAndRows() }" class="uppercase rounded-none rounded-l">SIM</button>
                            <button v-on:click="global.setShowColsAndRows(false)" v-bind:class="{ button: !global.showColsAndRows(), 'button-secondary': global.showColsAndRows() }" class="uppercase rounded-none rounded-r">NÃO</button>
                        </div>
                    </div>

                    <!-- mostrar zonas de campo -->
                    <div v-if="!global.isFreeMode()">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Exibir zonas de campo</p>
                        <div class="flex">
                            <button v-on:click="global.setShowFieldZones(true)" v-bind:class="{ button: global.showFieldZones(), 'button-secondary': !global.showFieldZones() }" class="uppercase rounded-none rounded-l">SIM</button>
                            <button v-on:click="global.setShowFieldZones(false)" v-bind:class="{ button: !global.showFieldZones(), 'button-secondary': global.showFieldZones() }" class="uppercase rounded-none rounded-r">NÃO</button>
                        </div>
                    </div>

                    <!-- tipo de formação -->
                    <div v-if="global.isFreeMode()">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Tipo de formação</p>
                        <div class="flex">
                            <button v-on:click="global.getCurrentStrategy().getCurrentFormation().setType('FREE')" v-bind:class="{ button: global.currentFormationTypeIs('FREE'), 'button-secondary': !global.currentFormationTypeIs('FREE') }" class="uppercase rounded-none rounded-l">LIVRE</button>
                            <button
                                v-on:click="global.getCurrentStrategy().getCurrentFormation().setType('INITIAL_POSITIONS')"
                                v-bind:class="{ button: global.currentFormationTypeIs('INITIAL_POSITIONS'), 'button-secondary': !global.currentFormationTypeIs('INITIAL_POSITIONS') }"
                                class="uppercase rounded-none rounded-r"
                            >
                                INICIAL
                            </button>
                        </div>
                    </div>

                    <!-- bloquar área do gol -->
                    <div v-if="global.getCurrentStrategy().getCurrentFormation().getType() != 'INITIAL_POSITIONS'">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Bloquear área do gol</p>
                        <div class="flex">
                            <button
                                v-on:click="global.getCurrentStrategy().getCurrentFormation().setBlockGoalArea(true)"
                                v-bind:class="{ button: global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea(), 'button-secondary': !global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea() }"
                                class="uppercase rounded-none rounded-l"
                            >
                                SIM
                            </button>
                            <button
                                v-on:click="global.getCurrentStrategy().getCurrentFormation().setBlockGoalArea(false)"
                                v-bind:class="{ button: !global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea(), 'button-secondary': global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea() }"
                                class="uppercase rounded-none rounded-r"
                            >
                                NÃO
                            </button>
                        </div>
                    </div>

                    <!-- zona de campo -->
                    <div v-if="global.getCurrentStrategy().getCurrentFormation().getType() === 'FREE' && global.getCurrentStrategy().getUuid() != FREE_MODE_UUID">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Zona de campo</p>
                        <div class="space-y-2">
                            <!-- editar ou excluir zona de campo -->
                            <div v-if="global.getCurrentStrategy().getCurrentFormation().hasFieldZone()" class="flex gap-2">
                                <!--  botão de edição -->
                                <button v-on:click="global.editFieldZone()" class="gap-2 text-sm uppercase button-secondary">
                                    Editar zona
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                </button>

                                <!-- botão de exclusão -->
                                <button v-on:click="$emit('open-delete-field-zone')" type="button" class="flex items-center justify-center w-12 h-10 text-red-500 uppercase border border-red-200 rounded-md hover:border-red-500 hover:text-white hover:bg-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <!--  botão de criação -->
                            <button v-if="!global.getCurrentStrategy().getCurrentFormation().hasFieldZone()" v-on:click="global.getCurrentStrategy().getCurrentFormation().setSelectingTheZone(true)" class="gap-2 text-sm uppercase button-secondary">
                                Definir zona
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- ações -->
                    <div class="space-y-4 text-sm uppercase">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Ações</p>
                        <!-- importar e exportar posições -->
                        <button v-on:click="exportCurrentPositions()" class="gap-2 uppercase button-secondary">
                            Exportar posições atuais
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <label for="upload_positions" class="gap-2 cursor-pointer button-secondary">
                            <input id="upload_positions" type="file" class="hidden" accept="application/json" v-on:change="uploadTeamPositions" />
                            Importar posições
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </label>

                        <hr />

                        <!-- criar ou selecionar estratégia -->
                        <button v-if="global.isFreeMode()" v-on:click="$emit('open-new-strategy-modal')" class="gap-2 uppercase button-secondary">
                            Nova estratégia
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <a href="#" v-if="!global.isFreeMode()" v-on:click="exportStrategy()" class="gap-2 uppercase button-secondary">
                            Exportar estratégia
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </a>
                        <button v-on:click="$emit('open-change-strategy-modal')" class="gap-2 uppercase button-secondary">
                            Alternar modo
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                        <hr />
                        <button v-if="!global.isFreeMode()" v-on:click="exportFormations()" class="gap-2 uppercase button-secondary">
                            Exportar formações
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <button v-if="!global.isFreeMode()" v-on:click="exportFormationNames()" class="gap-2 uppercase button-secondary">
                            Exportar nomes
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <button v-if="!global.isFreeMode()" v-on:click="exportFieldZones()" class="gap-2 uppercase button-secondary">
                            Exportar zonas de campo
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                        <a href="/strategy-creator-lugo-bots/tutorial" target="_blank" class="gap-2 uppercase button-green">
                            Exemplo de uso
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </a>
                        <button v-if="!global.isFreeMode()" v-on:click="$emit('open-delete-strategy-modal')" class="gap-2 uppercase button-red">
                            Excluir estratégia
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <NewFieldZone v-if="global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()" v-bind:show-me="showMenu" />
</template>
