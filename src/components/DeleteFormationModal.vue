<script setup lang="ts">
import global from "../global";

const emit = defineEmits(["close"]);
defineProps({ showModal: Boolean, formation_uuid: String });

const deleteFormation = (uuid: string) => {
    global.deleteFormation(uuid);
    emit("close");
};
</script>

<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="modal-wraper" v-if="showModal && !global.isFreeMode()">
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="scale-90 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-90 opacity-0">
                <div v-if="showModal && !global.isFreeMode() && formation_uuid" class="modal">
                    <!-- header -->
                    <div class="modal-header">
                        <p v-text="'Excluir formação - ' + global.getCurrentStrategy().getName()"></p>
                        <button type="button" v-on:click="$emit('close')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <!-- body -->
                    <div class="p-4 space-y-4 text-gray-500">
                        Ao excluir a formação vocâ perderá todo progresso feito até agora. <br /><br />
                        Você tem certeza disso ?
                    </div>
                    <!-- footer -->
                    <div class="gap-4 modal-footer">
                        <button v-on:click="$emit('close')" class="uppercase button-secondary">cancelar</button>
                        <button v-on:click="deleteFormation(formation_uuid)" class="uppercase button-red">Excluir</button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
