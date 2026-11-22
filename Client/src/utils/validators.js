export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value)
export const minLength = (value, n) => value.length >= n
