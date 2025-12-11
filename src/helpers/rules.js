// using code from https://vuetifyjs.com/en/components/forms/#rules
// using code from https://regexr.com/

export function required(value) {
  // copied from https://vuetifyjs.com/en/components/forms/#rules
  if (value === 0) return true
  if (value) return true
  return 'This is required.'
}

export function noWhiteSpace(value) {
  if (value.search(/\s/) === -1) return true
  return 'Spaces are not allowed.'
}

export function notOnlyWhiteSpace(value) {
  if (value.search(/^\s+$/) === -1) return true
  return 'Cannot be only spaces.'
}
