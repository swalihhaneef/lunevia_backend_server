export function isNull(field) {
  return field === null || field === undefined || field === "" || field === "undefined";
}

global.isNull = isNull;
