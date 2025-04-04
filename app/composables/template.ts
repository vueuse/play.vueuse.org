import AppFile from '../template/App.vue?raw'

export function useTemplate() {
  const template = ref({
    welcomeSFC: AppFile,
  })

  return {
    template,
  }
}
