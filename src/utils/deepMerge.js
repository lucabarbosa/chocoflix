import mergeWith from 'lodash.mergewith';

export default function deepMerge(target, source) {
  return mergeWith({}, source, target, function(a, b) {
    if (Array.isArray(a)) {
      return b.concat(a);
    }
  });
}
