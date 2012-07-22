import hmac
import json
import os
import requests

gs_secret = os.environ.get('GS_SECRET')
gs_key = os.environ.get('GS_KEY')


def post_request(json_data, secure=False):
  """
  Sends a post request to grooveshark, with a json object data. Returns the
  json response as a python dictionary.
  """
  # Generate the url
  if secure:
    url = 'https://api.grooveshark.com/ws3.php?sig='
  else:
    url = 'http://api.grooveshark.com/ws3.php?sig='

  # Create the signature from the json data
  signature = hmac.new(gs_secret.encode('utf-8'), json_data).hexdigest()

  # Return the json data form the response.
  return requests.post(url + signature, json_data).json


def generic_request(method, session=None, secure=False, **parameters):
  """
  Starts a generic request, returns the json response as a python dictionary.
  """
  data = {
    'method': method,
    'header': {
      'wsKey': gs_key
    },
    'parameters': parameters
  }

  if session:
    data['header']['sessionID'] = session

  return post_request(json.dumps(data), secure=secure)


def start_session():
  """
  Returns a new session id.
  """
  r = generic_request('startSession', secure=True)

  session_id = ''
  if 'result' in r and 'sessionID' in r['result']:
    session_id = r['result']['sessionID']

  return session_id


def get_country(session_id):
  """
  Returns a country object based on the request IP.
  """
  r = generic_request('getCountry', session=session_id)
  return r.get('result') or ''


def get_stream_key_stream_server(session_id, song_id):
  """
  Returns a python dict with {url, StreamServerID, StreamKey, duration}.
  """
  country = get_country(session_id)

  result = generic_request('getStreamKeyStreamServer',
      session=session_id,
      songID=song_id,
      country=country).get('result')

  if (result):
    url = result.get('url')
    stream_key = result.get('StreamKey')
    stream_server_id = result.get('StreamServerID')
    duration = result.get('uSecs')

  return {'url': url,
          'stream_key': stream_key,
          'stream_server_id': stream_server_id,
          'duration' : duration}

