<script setup lang="ts">
defineProps(["code", "language"]);
</script>

<template>
    <div class="not-prose relatve">
        <div class="relative">
            <div class="absolute z-50 w-20 h-4 top-12 left-4 mac"></div>
            <pre class="relative">
                <code  ref="code" :class="`rounded-lg shadow-2xl !p-0 !m-0 language-${language} `">{{ code }}</code>
            </pre>
        </div>
    </div>
</template>
