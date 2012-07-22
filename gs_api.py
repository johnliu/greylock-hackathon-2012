import hmac
import hashlib
import json
import os
import requests

gs_secret = os.environ.get('GS_SECRET')
gs_key = os.environ.get('GS_KEY')
authenticated = []

def authenticated_find(session_id):
  """Return first item in sequence where f(item) == True."""
  for s in authenticated:
    if s == session_id:
      return True
    return False


def authenticated_remove(session_id):
  """Removes a session_id from authenticated list."""
  if authenticated_find(session_id):
    authenticated.remove(session_id)
    return True
  else:
    return False


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


def authenticate(session_id, user, pw):
  """
  Authenticates a user session using a MD5 hashed password.
  Adds the session id to the authenticated list.
  """
  pw_hashed = hashlib.md5(pw).hexdigest()
  r = generic_request('authenticate', session=session_id, secure=True,
                      login=user, password=pw_hashed)

  if 'result' in r and r['result']['success']:
    authenticated.append(session_id)
    return True
  else:
    return False


def logout(session_id):
  """
  Logs out current session and removes it from authenticated list.
  """
  r = generic_request('logout', session=session_id)
  authenticated_remove(session_id)
  return r.get('result') or ''


def get_country(session_id):
  """
  Returns a country object based on the request IP.
  """
  r = generic_request('getCountry', session=session_id)
  return r.get('result') or ''


def get_albums_info(session_id, album_ids):
  """
  Returns meta data pertaining to the album_ids passed in.
  """
  r = generic_request('getAlbumsInfo', session=session_id, albumIDs=album_ids)
  return r.get('result') or ''


def get_album_art(session_id, album_id):
  """
  Returns album art URL.
  """
  r = get_albums_info(session_id, [album_id])
  print r
  if r.get('albums'):
    return "http://images.grooveshark.com/static/albums/90_" + r['albums'][0]['CoverArtFilename']
  else:
    return "http://images.grooveshark.com/static/albums/90_11111.png"


def get_user_library_songs(session_id):
  """
  Returns songs from the user's library.
  """
  r = generic_request('getUserLibrarySongs', session=session_id)
  result = r.get('result')
  if result:
    return result.get('songs')
  else:
    return None


def get_user_playlists(session_id):
  """
  Returns the user's playlists.
  """
  r = generic_request('getUserPlaylists', session=session_id)
  result = r.get('result')
  if result:
    return result.get('playlists')
  else:
    return None


def get_playlist_songs(session_id, playlist_id):
  """
  Returns the playlist's songs.
  """
  r = generic_request('getPlaylistSongs', session=session_id,
                      playlistID=playlist_id)
  result = r.get('result')
  if result:
    return result.get('songs')
  else:
    return None


def add_user_favorite_song(session_id, song_id):
  """
  Adds a song to the user's favorites.
  """
  r = generic_request('addUserFavoriteSong', session=session_id,
                      songID=song_id)
  result = r.get('result')
  if result:
    return result.get('success')
  else:
    return None


def remove_user_favorite_songs(session_id, song_ids):
  """
  Removes a song from the user's favorites.
  """
  r = generic_request('removeUserFavoriteSongs', session=session_id,
                      songIDs=song_ids)
  result = r.get('result')
  if result:
    return result.get('success')
  else:
    return None


def mark_stream_key_over_30_secs(session_id, stream_key, stream_server_id):
  """
  Marks a stream that has been played over 30 seconds.
  """
  r = generic_request('markStreamKeyOver30Secs', session=session_id,
                      streamKey=stream_key, streamServerID=stream_server_id)
  return r.get('result') or ''


def mark_song_complete(session_id, stream_key, stream_server_id, song_id):
  """
  Marks a song that has completed and has played more than 30 secs.
  """
  r = generic_request('markSongComplete', session=session_id,
                      streamKey=stream_key, streamServerID=stream_server_id,
                      songID=song_id)
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

  url = ''
  stream_key = ''
  stream_server_id = ''
  duration = ''

  if (result):
    url = result.get('url')
    stream_key = result.get('StreamKey')
    stream_server_id = result.get('StreamServerID')
    duration = result.get('uSecs')

  return {'url': url,
          'stream_key': stream_key,
          'stream_server_id': stream_server_id,
          'duration' : duration}


def get_popular_songs_month(limit=10):
  """
  Returns a set of popular songs of the month so that we can populate the
  play queue even when there are no songs in it.

  Each new session should start by calling this and storing it.

  There is a bug with the Grooveshark API currently which causes the
  response to give the full list of songs even if you pass in a limit param.
  """
  r = generic_request('getPopularSongsMonth', limit=limit)
  return r.get('result') or ''


def get_playlist(session_id, playlist_id):
  """
  Returns a playlist object.
  """
  r = generic_request('getPlaylist', session=session_id, playlistID=playlist_id)
  return r.get('result') or ''


def get_song_url_from_song_id(session_id, song_id):
  """
  Returns a Grooveshark URL for the song id specified.
  """
  r = generic_request('getSongURLFromSongID', session=session_id, songID=song_id)
  return r.get('result') or ''


def get_autocomplete_search_results(session_id, query, limit=5):
  """
  Returns some autocomplete search results.
  """

  # TODO(jng): Sanitize query input.
  r = generic_request('getAutocompleteSearchResults', session=session_id,
                      query=query, type='user', limit=limit)
  #return r.get('result') or ''
  return r


def get_song_search_results(session_id, query, limit=5):
  """
  Returns some song search results.
  """

  country = get_country(session_id)
  # TODO(jng): Sanitize query input.
  r = generic_request('getSongSearchResults', session=session_id,
                      query=query, country=country, limit=limit)
  return r.get('result') or ''


def get_album_search_results(session_id, query, limit=5):
  """
  Returns some album search results.
  """

  country = get_country(session_id)
  # TODO(jng): Sanitize query input.
  r = generic_request('getAlbumSearchResults', session=session_id,
                      query=query, country=country, limit=limit)
  return r.get('result') or ''


def get_artist_search_results(session_id, query, limit=5):
  """
  Returns some artist search results.
  """

  country = get_country(session_id)
  # TODO(jng): Sanitize query input.
  r = generic_request('getArtistSearchResults', session=session_id,
                      query=query, country=country, limit=limit)
  return r.get('result') or ''
