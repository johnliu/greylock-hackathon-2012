import json
import request_signer

_wsKey = 'jonathanng_gs'
_endpoint = 'http://api.grooveshark.com/ws3.php?sig='

# def build_country_request(ip):
#   return json.dumps([
# 
# 
# def build_streamKeyStreamServer_request(songID, country):


def build_sessionStart_request():
  return json.dumps([{'method': 'sessionStart', 'header': {'wsKey': _wsKey}}])


def send_sessionStart():
  request = build_sessionStart_request()
  signature = request_signer.generate_key(request)
  _endpoint = _endpoint + signature
  print "new endpoint: " + _endpoint
