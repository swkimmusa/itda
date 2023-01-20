/* eslint-disable no-prototype-builtins */
function flattenObject(ob) {
  const toReturn = {};

  const keys = Object.keys(ob);
  keys.forEach((key) => {
    const value = ob[key];

    if (!ob.hasOwnProperty(key)) return;

    if (typeof value === 'object' && value !== null) {
      const flatObject = flattenObject(value);
      const flatKeys = Object.keys(flatObject);
      flatKeys.forEach((flatKey) => {
        if (!flatObject.hasOwnProperty(flatKey)) return;

        toReturn[`${key}.${flatKey}`] = flatObject[flatKey];
      });
    } else {
      toReturn[key] = ob[key];
    }
  });
  return toReturn;
}

const objectUtils = { flatten: flattenObject };

export default objectUtils;
