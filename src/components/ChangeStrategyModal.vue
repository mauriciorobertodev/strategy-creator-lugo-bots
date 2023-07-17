<script setup lang="ts">
import global from "../global";

const emit = defineEmits(["close"]);
defineProps({ showModal: Boolean });

function changeStrategyTo(uuid: string) {
    global.setCurrentStrategy(uuid);
    emit("close");
}
</script>

<template>
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="modal-wraper" v-show="showModal">
            <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="scale-90 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-90 opacity-0">
                <div v-show="showModal" class="modal">
                    <!-- header -->
                    <div class="modal-header">
                        <p>Trocar de estratégia</p>
                        <button type="button" v-on:click="$emit('close')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <!-- body -->
                    <div class="p-4 space-y-4">
                        <template v-for="strategy in global.getStrategies()" v-bind:key="strategy.getUuid()">
                            <button v-on:click="changeStrategyTo(strategy.getUuid())" type="button" class="w-full p-4 text-left truncate transition duration-300 border rounded-md hover:bg-blue-500 hover:text-white">
                                {{ strategy.getName() }}
                            </button>
                        </template>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
