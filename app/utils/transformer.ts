export const stringToBooleanTransformer = {
  get(value) {
    if (value === 'false' || value === '0')
      return false
    else return Boolean(value)
  },
  set(value) {
    return String(value)
  },
}
