<script setup lang="ts">
import { ref } from "vue";
import global from "../global";
import { FormationType } from "../types";
import { importStrategy } from "../helpers/json";

const emit = defineEmits(["close"]);
defineProps({ showModal: Boolean });

const strategy_cols = ref(global.getCols());
const strategy_rows = ref(global.getRows());
const strategy_name = ref("");
const formation_name = ref("");
const formation_type = ref<FormationType>("INITIAL_POSITIONS");

const incrementCol = () => strategy_cols.value++;
const decrementCol = () => {
    if (strategy_cols.value > 1) strategy_cols.value--;
};
const incrementRow = () => strategy_rows.value++;
const decrementRow = () => {
    if (strategy_rows.value > 1) strategy_rows.value--;
};

const newStrategy = () => {
    global.setNewStrategy(strategy_cols.value, strategy_rows.value, strategy_name.value, formation_name.value, formation_type.value);
    emit("close");
    strategy_name.value = "";
    formation_name.value = "";
    formation_type.value = "INITIAL_POSITIONS";
    strategy_cols.value = 16;
    strategy_rows.value = 12;
};

const uploadStrategy = (e: any) => {
    const jsonFile = e.target.files[0] as File;

    if (jsonFile.type.toLowerCase() != "application/json") {
        alert("Somente JSON");
        return;
    }

    importStrategy(jsonFile, strategy_name.value);
    const input = document.querySelector<HTMLInputElement>("#upload_strategy");
    if (input) input.value = "";
    emit("close");
};
</script>

<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="modal-wraper" v-show="showModal">
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="scale-90 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-90 opacity-0">
                <form v-show="showModal" class="modal" v-on:submit.prevent="newStrategy()">
                    <!-- header -->
                    <div class="modal-header">
                        <p>Nova estratégia</p>
                        <button type="button" v-on:click="$emit('close')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <!-- body -->
                    <div class="p-4 space-y-4">
                        <!-- nome -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Nome</p>
                            <input required type="text" v-model="strategy_name" placeholder="ex. Batata eSport" class="input" v-on:input="strategy_name = strategy_name.trimStart()" />
                        </div>

                        <!-- colunas -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Colunas</p>
                            <div class="flex items-center justify-center">
                                <button type="button" v-on:click="decrementCol()" class="rounded-none rounded-l button-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                </button>
                                <input v-bind:value="strategy_cols" type="number" class="flex items-center justify-center flex-grow w-full h-10 text-center border-t border-b border-gray-100" disabled />
                                <button type="button" v-on:click="incrementCol()" class="rounded-none rounded-r button-secondary">
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
                                <button type="button" v-on:click="decrementRow()" class="rounded-none rounded-l button-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                </button>
                                <input v-bind:value="strategy_rows" type="number" class="flex items-center justify-center flex-grow w-full h-10 text-center border-t border-b border-gray-100" disabled />
                                <button type="button" v-on:click="incrementRow()" class="rounded-none rounded-r button-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <!-- nome da primeira formação -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Nome da primeira formação</p>
                            <input required type="text" v-model="formation_name" placeholder="ex. Posições iniciais" class="input" v-on:input="formation_name = formation_name.trimStart()" />
                        </div>
                        <!-- tipo da primeira formação -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Tipo da primeira formação</p>
                            <div class="flex">
                                <button type="button" v-on:click="formation_type = 'INITIAL_POSITIONS'" v-bind:class="{ button: formation_type == 'INITIAL_POSITIONS', 'button-secondary': formation_type != 'INITIAL_POSITIONS' }" class="uppercase rounded-none rounded-l">INICIAL</button>
                                <button type="button" v-on:click="formation_type = 'FREE'" v-bind:class="{ button: formation_type == 'FREE', 'button-secondary': formation_type != 'FREE' }" class="uppercase rounded-none rounded-r">LIVRE</button>
                            </div>
                        </div>
                        <!-- importar -->
                        <label for="upload_strategy" class="h-20 gap-2 uppercase button-secondary">
                            <input id="upload_strategy" type="file" class="hidden" accept="application/json" v-on:change="uploadStrategy" />
                            importar estratégia
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </label>
                    </div>
                    <!-- footer -->
                    <div class="gap-4 modal-footer">
                        <button type="button" v-on:click="$emit('close')" class="uppercase button-secondary">cancelar</button>
                        <button type="submit" class="uppercase button">Criar</button>
                    </div>
                </form>
            </Transition>
        </div>
    </Transition>
</template>
