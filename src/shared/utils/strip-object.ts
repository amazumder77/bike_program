import { parse, stringify } from 'flatted';
/**
 * Removes properties from an object. Useful for sanitizing data.

 * @param targetObject Object to strip fields from
 * @param fieldNames Fields/object properties to remove
 */
const stripObject = <T>(targetObject: T, fieldNames: Set<string>): T => {
  if (typeof targetObject !== 'object' || !targetObject) {
    return targetObject;
  }

  // Stringify to simplify object and prevent call stack errors
  // If object key matches one of the fieldNames, replace with *****
  const filteredJson = stringify(targetObject, (key, value) => (fieldNames.has(key) ? '*****' : value));
  return parse(filteredJson);
};

export default stripObject;
