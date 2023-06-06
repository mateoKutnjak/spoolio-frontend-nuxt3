export function capitalizeOnlyFirstLetter(str: string): string {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeFirstLetter(str: string): string {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}