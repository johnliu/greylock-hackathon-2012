import json
import os
import requests

gs_tinysong = os.environ.get('GS_TINYSONG')


def search_request(query, limit=5):
  """
  Sends a query request to tinysong, limit default to 5 results. Returns the
  json response as a python dictionary.
  """
  # Generate the url
  url = 'http://tinysong.com/s/'

  # Parse the query and replace spaces with '+'.
  # TODO(jng): Need to sanitize this input.
  query = query.replace(' ', '+')

  # Return the json data form.
  return requests.post(url + query + '?format=json&limit=' + str(limit)
                       + '&key=' + gs_tinysong).json

  # Uncomment if you want to return the list as a python dict instead.
  # songs = []
  # for song in result:
  #   songs.append({'song_id': song['SongID'],
  #                 'song_name': song['SongName'],
  #                 'artist_id': song['ArtistID'],
  #                 'artist_name': song['ArtistName'],
  #                 'album_id': song['AlbumID'],
  #                 'album_name': song['AlbumName']})
  # return songs
