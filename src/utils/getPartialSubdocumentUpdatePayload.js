export default function getPartialSubdocumentUpdatePayload(operator, payload) {
  const result = {};

  for (let prop in payload) {
    if (Array.isArray(payload[prop])) {
      result['$push'] = result['$push'] || {};
      result['$push'][operator + '.$.' + prop] = payload[prop];
    } else {
      result['$set'] = result['$set'] || {};
      result['$set'][operator + '.$.' + prop] = payload[prop];
    }
  }

  return result;
}
