<script setup lang="ts">
import type { OutputModes } from '@vue/repl'
import type { ShallowRef } from 'vue'
import { mergeImportMap, Repl, useStore, useVueImportMap } from '@vue/repl'
import MonacoEditor from '@vue/repl/monaco-editor'
import semver from 'semver'

const showOutput = useRouteQuery<string, boolean>('showOutput', 'false', { transform: {
  get(value) {
    if (value === 'false' || value === '0')
      return false
    else return Boolean(value)
  },
  set(value) {
    return String(value)
  },
} })

const outputMode = useRouteQuery<OutputModes, OutputModes>('outputMode', 'preview')

const hash = useRouteHash(undefined, { mode: 'replace' })

const {
  importMap: builtinImportMap,
  vueVersion,
  productionMode,
} = useVueImportMap()

const injectedVueVersion = inject<ShallowRef<string>>('vueVersion', shallowRef<string>('latest'))

const vueuseVersion = useRouteQuery('vueuse', 'latest')

const vueUsePackages = [
  '@vueuse/metadata',
  '@vueuse/shared',
  '@vueuse/core',
  '@vueuse/integrations',
  '@vueuse/math',
  '@vueuse/rxjs',
]

function generateVueUseImportCDNs() {
  return vueUsePackages.map((p) => {
    return [p, `https://cdn.jsdelivr.net/npm/${p}@${vueuseVersion.value}/index.mjs`]
  })
}

const importMap = computed(() => {
  return mergeImportMap(builtinImportMap.value, {
    imports: Object.fromEntries([...generateVueUseImportCDNs(), ...(semver.valid(vueuseVersion.value) && semver.major(vueuseVersion.value) <= 11 ? [['vue-demi', 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.mjs']] : [])]),
  })
})

const { template } = useTemplate()

const store = useStore(
  {
    // pre-set import map
    builtinImportMap: importMap,
    vueVersion,
    // starts on the output pane (mobile only) if the URL has a showOutput query
    showOutput,
    // starts on a different tab on the output pane if the URL has a outputMode query
    // and default to the "preview" tab
    outputMode,
    template,
  },
  // initialize repl with previously serialized state
  hash.value ?? undefined,
)

injectedVueVersion.value = vueVersion.value ?? 'latest'

// persist state to URL hash
watchEffect(() => hash.value = store.serialize())

// production mode is enabled
productionMode.value = true

watch(() => injectedVueVersion.value, (newVersion) => {
  vueVersion.value = newVersion
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
  <client-only>
    <Repl :store="store" :editor="MonacoEditor" :show-compile-output="true" :theme="theme" :preview-theme="true" :preview-options="previewOptions" />
  </client-only>
</template>
