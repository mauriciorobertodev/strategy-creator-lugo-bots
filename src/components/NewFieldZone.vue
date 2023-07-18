<script setup lang="ts">
import { onMounted, ref } from "vue";
import global from "../global";
import { vMaska } from "maska";
import { hexToColor } from "../helpers/color";
import { isPermittedFieldZone } from "../helpers/field";

defineProps({ showMe: Boolean });

const emit = defineEmits(["close"]);

function changeName() {
    field_zone_name.value = field_zone_name.value.trimStart();
    global.getTemporaryZone().setName(field_zone_name.value);
}

function colorChangeInput() {
    if (color_input.value.length === 7) {
        field_zone_color.value = color_input.value;
        const color = hexToColor(color_input.value);
        global.getTemporaryZone().setColor(color);
    }
}

function colorChangePick() {
    color_input.value = field_zone_color.value;
    const color = hexToColor(color_input.value);
    global.getTemporaryZone().setColor(color);
}

const color_input = ref("#FFFFFF");
const field_zone_name = ref("");
const field_zone_color = ref("#FFFFFF");

onMounted(() => {
    field_zone_name.value = global.getTemporaryZone().getName();
    color_input.value = "#FFFFFF";
    field_zone_color.value = "#FFFFFF";
});

function save() {
    global.saveTemporaryFieldZone();
    color_input.value = "#FFFFFF";
    field_zone_name.value = "";
    field_zone_color.value = "#FFFFFF";
    emit("close");
}
</script>

<template>
    <div>
        <Transition enter-active-class="duration-300" enter-from-class="translate-x-full opacity-0" enter-to-class="translate-x-0 opacity-100" leave-active-class="duration-300" leave-from-class="translate-x-0 opacity-100" leave-to-class="translate-x-full opacity-0">
            <div v-show="global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone() && showMe" class="fixed right-0 flex flex-col items-center justify-between h-screen gap-4 space-y-4 overflow-hidden transition-all bg-white trnasform pt-14 w-80">
                <form v-on:submit="save()" class="w-full px-4 pb-4 space-y-4 overflow-y-auto">
                    <!-- nome da formação -->
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Nome</p>
                        <input required type="text" v-model="field_zone_name" placeholder="ex. Zona de Guerra, AHUUUUL !" class="input" v-on:input="changeName()" />
                    </div>
                    <div>
                        <p class="mb-2 text-sm text-gray-500 uppercase">Cor</p>
                        <input type="color" class="w-full h-20 border-none" v-model="field_zone_color" v-on:input="colorChangePick()" />
                        <input type="text" class="input" v-model="color_input" v-on:input="colorChangeInput()" v-maska data-maska="!#FFFFFF" data-maska-tokens="{ 'F': { 'pattern': '[0-9a-fA-F]' }}" />
                    </div>
                    <div class="space-y-2">
                        <button type="submit" v-bind:disabled="!isPermittedFieldZone(global.getTemporaryZone().getDefinition()) || !field_zone_name" class="uppercase button">Salvar</button>
                        <button type="button" class="uppercase button-secondary" v-on:click="global.getCurrentStrategy().getCurrentFormation().setSelectingTheZone(false)">Cancelar</button>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>
