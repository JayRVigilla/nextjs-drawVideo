export const createObjectClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}