import config from '../constants/config';

async function saveFile(path, content) {
  const encodedPath = encodeURIComponent(path);

  const requestOptions = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Charset': 'iso-8859-5, unicode-1-1;q=0.8',
    },
    mode: 'cors',
    body: JSON.stringify({ content }),
  };

  try {
    const response = await fetch(`${config.serverURL}/files/${encodedPath}`, requestOptions);
    const json = await response.json();
    return json;
  } catch (e) {
    /* eslint-disable */
    console.error('Error occured on saveFile:', e);
    /* eslint-enable */
    return e;
  }
}

export default saveFile;
