<script setup lang="ts">
import global from "../global";

defineProps({ showMenu: Boolean });
defineEmits(["toggle"]);
</script>

<template>
    <div>
        <div class="fixed top-0 right-0 z-50 flex items-end justify-end w-full">
            <div class="flex items-center justify-between h-12 bg-white min-w-[320px]">
                <div class="flex items-center gap-4">
                    <p class="pl-4">Modo livre</p>
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
        <Transition enter-active-class="duration-300 " enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100" leave-active-class="duration-300 " leave-from-class="translate-x-0 opacity-100" leave-to-class="translate-x-full opacity-0">
            <div v-show="showMenu" class="fixed right-0 flex flex-col items-center justify-between h-screen gap-4 p-4 space-y-4 overflow-hidden transition-all bg-white trnasform pt-14 w-80">
                <div class="w-full space-y-4">
                    <!-- colunas -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Colunas</p>
                        <div class="flex items-center justify-center">
                            <button v-on:click="global.decrementCol()" class="rounded-none rounded-l button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                </svg>
                            </button>
                            <p v-text="global.getCols()" class="flex items-center justify-center flex-grow w-full h-10 border-t border-b border-gray-100"></p>
                            <button v-on:click="global.incrementCol()" class="rounded-none rounded-r button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- linhas -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Linhas</p>
                        <div class="flex items-center justify-center">
                            <button v-on:click="global.decrementRow()" class="rounded-none rounded-l button-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                </svg>
                            </button>
                            <p v-text="global.getRows()" class="flex items-center justify-center flex-grow w-full h-10 border-t border-b border-gray-100"></p>
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
                        <p class="mb-2 text-sm text-gray-500 uppercase">Exibir colunas e linhas dos jogadores</p>
                        <div class="flex">
                            <button v-on:click="global.setShowColsAndRows(true)" v-bind:class="{ button: global.showColsAndRows(), 'button-secondary': !global.showColsAndRows() }" class="uppercase rounded-none rounded-l">SIM</button>
                            <button v-on:click="global.setShowColsAndRows(false)" v-bind:class="{ button: !global.showColsAndRows(), 'button-secondary': global.showColsAndRows() }" class="uppercase rounded-none rounded-r">NÃO</button>
                        </div>
                    </div>

                    <!-- tipo de formação -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Tipo de formação</p>
                        <div class="flex">
                            <button v-on:click="global.setCurrentFormationType('FREE')" v-bind:class="{ button: global.currentFormationTypeIs('FREE'), 'button-secondary': !global.currentFormationTypeIs('FREE') }" class="uppercase rounded-none rounded-l">LIVRE</button>
                            <button v-on:click="global.setCurrentFormationType('INITIAL_POSITIONS')" v-bind:class="{ button: global.currentFormationTypeIs('INITIAL_POSITIONS'), 'button-secondary': !global.currentFormationTypeIs('INITIAL_POSITIONS') }" class="uppercase rounded-none rounded-r">
                                INICIAL
                            </button>
                        </div>
                    </div>

                    <!-- bloquar área do gol -->
                    <div v-if="global.getCurrentFormationType() != 'INITIAL_POSITIONS'">
                        <p class="mb-2 text-sm text-gray-500 uppercase">Bloquear área do gol</p>
                        <div class="flex">
                            <button v-on:click="global.setBlockGoalArea(true)" v-bind:class="{ button: global.getBlockGoalArea(), 'button-secondary': !global.getBlockGoalArea() }" class="uppercase rounded-none rounded-l">SIM</button>
                            <button v-on:click="global.setBlockGoalArea(false)" v-bind:class="{ button: !global.getBlockGoalArea(), 'button-secondary': global.getBlockGoalArea() }" class="uppercase rounded-none rounded-r">NÃO</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
