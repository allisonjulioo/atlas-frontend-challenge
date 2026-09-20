export const onlyDigits = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
