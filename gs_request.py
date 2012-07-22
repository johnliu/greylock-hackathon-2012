import hmac
import json
import os
import requests

gs_secret = os.environ.get('GS_SECRET')
gs_key = os.environ.get('GS_KEY')


def post_request(json_data, secure=False):
  # Generate the url
  if secure:
    url = 'https://api.grooveshark.com/ws3.php?sig='
  else:
    url = 'http://api.grooveshark.com/ws3.php?sig='

  # Create the signature from the json data
  signature = hmac.new(gs_secret.encode('utf-8'), json_data).hexdigest()

  # Return the json data form the response.
  return requests.post(url + signature, json_data).json


def start_session():
  json_data = json.dumps({
    'method': 'startSession',
    'header': {
      'wsKey': gs_key
    }
  })

  r = post_request(json_data, secure=True)

  session_id = ''
  if 'result' in r and 'sessionID' in r['result']:
    session_id = r['result']['sessionID']

  return session_id


# Returns a country object based on the request IP.
def get_country(sessionID):
  json_data = json.dumps({
    'method': 'getCountry',
    'header': {
      'wsKey': gs_key,
      'sessionID':sessionID
    }
  })

  result = post_request(json_data).json
  return result['result']
>>>>>>> Adds get_country request function to gs_request.
