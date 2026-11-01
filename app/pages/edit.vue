<script setup lang="ts">
import { ComponentEditor } from "@transient/nuxt/editor";
import components from "virtual:transient/components";
import schemas from "virtual:transient/schemas";
import { ref } from "vue";
import { useRoute } from "#imports";

const page = String(useRoute().query.page ?? "index");
const component = ref(structuredClone(schemas[page]));
</script>

<template>
  <p v-if="!component">Unknown page "{{ page }}"</p>
  <ComponentEditor
    v-else
    v-model="component"
    :dictionnary="schemas"
    :components="components"
  />
</template>
