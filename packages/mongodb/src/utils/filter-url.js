/**
 * Returns a filtered MongoDB url string with the
 * username and password redacted from a MongoDB client instance.
 *
 * @param {MongoClient} client The MongoClient instance.
 * @returns {string}
 */
export default function filterURL(client) {
  const { url, options } = client.s;
  const { credentials } = options;
  if (!credentials) return url;
  const { username, password } = credentials;
  if (username || password) return `${url}`.replace(username, '*****').replace(password, '*****');
  return url;
}
