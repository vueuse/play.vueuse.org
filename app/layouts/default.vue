<script setup lang="ts">
import { getVersionsBatch } from 'fast-npm-meta'
import semver from 'semver'

// todo: type
const versions = useSessionStorage<any>('versions', [])

const loadingVersions = shallowRef(false)

async function fetchVersions() {
  loadingVersions.value = true
  versions.value = await getVersionsBatch(['@vueuse/core', 'vue'])
  loadingVersions.value = false
}

if (!versions.value.length) {
  fetchVersions()
}

const vueVersion = shallowRef()

const vueVersions = computed(() => {
  const vue = versions.value.find(p => p.name === 'vue')
  if (vue?.error)
    return []
  return vue?.versions ?? []
})

const vueVersionsSorted = useSorted(vueVersions, (a, b) => semver.compare(b, a))

const vueUseVersion = useRouteQuery('vueuse', 'latest')

const vueUseVersions = computed(() => {
  const vueuse = versions.value.find(p => p.name === '@vueuse/core')
  if (vueuse?.error)
    return []
  return vueuse?.versions ?? []
})

const vueUseVersionsSorted = useSorted(vueUseVersions, (a, b) => semver.compare(b, a))

provide('vueVersion', vueVersion)
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <UIcon name="i-logos-vueuse" class="size-8" />VueUse Playground
      </template>
      <template #right>
        <USelectMenu v-model="vueUseVersion" :items="vueUseVersionsSorted" class="w-32" icon="i-logos-vueuse" :loading="loadingVersions" />
        <USelectMenu v-model="vueVersion" :items="vueVersionsSorted" class="w-32" icon="i-logos-vue" :loading="loadingVersions" />
        <UButton icon="i-lucide-refresh-ccw" size="md" color="primary" variant="soft" @click="fetchVersions" />
        <UColorModeButton />

        <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton
            color="neutral"
            variant="ghost"
            to="https://github.com/vueuse"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
          />
        </UTooltip>
      </template>
    </UHeader>

    <UMain class="h-[calc(100vh-var(--ui-header-height))]">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
