<script setup lang="ts">
import { ref } from "vue";
import global from "../global";
import { FormationType } from "../types";

const emit = defineEmits(["close"]);
defineProps({ showModal: Boolean });

const formation_name = ref("");
const formation_type = ref<FormationType>("FREE");

const newFormation = () => {
    global.getCurrentStrategy().newFormation(formation_name.value, formation_type.value);
    emit("close");
    formation_name.value = "";
    formation_type.value = "FREE";
};
</script>

<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="modal-wraper" v-show="showModal">
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="scale-90 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-90 opacity-0">
                <form v-show="showModal" class="modal" v-on:submit.prevent="newFormation()">
                    <!-- header -->
                    <div class="modal-header">
                        <p>Nova formação</p>
                        <button type="button" v-on:click="$emit('close')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <!-- body -->
                    <div class="p-4 space-y-4">
                        <!-- nome da formação -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Nome da formação</p>
                            <input required type="text" v-model="formation_name" placeholder="ex. Posições iniciais" class="input" v-on:input="formation_name = formation_name.trimStart()" />
                        </div>
                        <!-- tipo da formação -->
                        <div>
                            <p class="mb-2 text-sm text-gray-500 uppercase">Tipo da primeira formação</p>
                            <div class="flex">
                                <button type="button" v-on:click="formation_type = 'INITIAL_POSITIONS'" v-bind:class="{ button: formation_type == 'INITIAL_POSITIONS', 'button-secondary': formation_type != 'INITIAL_POSITIONS' }" class="uppercase rounded-none rounded-l">INICIAL</button>
                                <button type="button" v-on:click="formation_type = 'FREE'" v-bind:class="{ button: formation_type == 'FREE', 'button-secondary': formation_type != 'FREE' }" class="uppercase rounded-none rounded-r">LIVRE</button>
                            </div>
                        </div>
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
