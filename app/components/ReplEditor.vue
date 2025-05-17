<script setup lang="ts">
import type { Store } from '@vue/repl'
import { Repl } from '@vue/repl'
import MonacoEditor from '@vue/repl/monaco-editor'

const props = defineProps({
  ssr: {
    type: Boolean,
    default: false,
  },
  store: {
    type: Object as PropType<Store>,
    required: true,
  },
})

const colorMode = useColorMode()

const theme = computed(() => {
  if (colorMode.value === 'dark')
    return 'dark'
  else
    return 'light'
})

const previewOptions = {
  headHTML: `
    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
    <script>
      window.__unocss = {
        rules: [],
        presets: [],
      }
    <\/script>
  `,
}
</script>

<template>
  <Repl
    :store="props.store" :editor="MonacoEditor" :show-compile-output="true" :theme="theme" :preview-theme="true"
    :preview-options="previewOptions" :ssr="props.ssr"
  />
</template>
