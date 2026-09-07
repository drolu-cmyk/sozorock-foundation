// Permanent retirement of the legacy Health hostname. Managed by the Foundation release.
function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;
  if (host !== 'www.sozorockhealth.com' && host !== 'sozorockhealth.com') {
    return { statusCode: 403, statusDescription: 'Forbidden', headers: { 'cache-control': {value:'no-store'} } };
  }
  if ((request.method !== 'GET' && request.method !== 'HEAD') || request.uri.indexOf('/api/') === 0) {
    return { statusCode: 410, statusDescription: 'Gone', headers: { 'cache-control': {value:'no-store'} } };
  }
  var uri = request.uri || '/';
  var target = 'https://health.sozorockfoundation.org' + uri;
  if (uri === '/cb-cap' || uri === '/cb-cap/' || uri === '/cbcap' || uri === '/cbcap/') target = 'https://cbcap.sozorockfoundation.org/';
  var query = request.querystring || {};
  var allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var parts = [];
  allowed.forEach(function(key) { if (query[key] && query[key].value) parts.push(key + '=' + encodeURIComponent(query[key].value)); });
  if (parts.length) target += '?' + parts.join('&');
  return { statusCode: 301, statusDescription: 'Moved Permanently', headers: {
    location: {value:target}, 'cache-control': {value:'public, max-age=300'},
    'strict-transport-security': {value:'max-age=31536000; includeSubDomains'},
    'referrer-policy': {value:'no-referrer'}, 'x-content-type-options': {value:'nosniff'}
  }};
}
