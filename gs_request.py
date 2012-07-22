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
  return requests.post(url + signature, json_data)


def startSession():
  json_data = json.dumps({
    'method': 'startSession',
    'header': {
      'wsKey': gs_key
    }
  })

  return post_request(json_data, secure=True)
