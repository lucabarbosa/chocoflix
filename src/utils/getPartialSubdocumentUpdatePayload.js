export default function getPartialSubdocumentUpdatePayload(operator, payload) {
  const set = {};

  for (let prop in payload) {
    set[operator + '.$.' + prop] = payload[prop];
  }

  return set;
}
