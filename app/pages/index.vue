<script setup lang="ts">
import type { OutputModes } from '@vue/repl'
import type { ShallowRef } from 'vue'
import { mergeImportMap, useStore, useVueImportMap } from '@vue/repl'

const showOutput = useRouteQuery<string, boolean>('showOutput', 'false', {
  transform: stringToBooleanTransformer,
})

const outputMode = useRouteQuery<OutputModes, OutputModes>('outputMode', 'preview')

const ssr = useRouteQuery<string, boolean>('ssr', 'false', {
  transform: stringToBooleanTransformer,
})

const prod = useRouteQuery<string, boolean>('prod', 'false', {
  transform: stringToBooleanTransformer,
})

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
    imports: Object.fromEntries([...generateVueUseImportCDNs(), ['vue-demi', 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.mjs']]),
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

watch(() => injectedVueVersion.value, (newVersion) => {
  vueVersion.value = newVersion
})

watch(() => prod.value, (newProd) => {
  productionMode.value = newProd
}, { immediate: true })
</script>

<template>
  <ClientOnly>
    <ReplEditor :ssr="ssr" :store="store" />
    <template #fallback>
      <div class="flex w-full h-full justify-center items-center px-12">
        <UProgress animation="swing" />
      </div>
    </template>
  </ClientOnly>
</template>
