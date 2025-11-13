// using code from https://vuetifyjs.com/en/components/forms/#rules

export function required(value) {
  // copied from https://vuetifyjs.com/en/components/forms/#rules
  if (value) return true
  return 'This is required.'
}

export function noWhiteSpace(value) {
  if (value.search(/\s/) === -1) return true
  return 'Spaces are not allowed'
}
