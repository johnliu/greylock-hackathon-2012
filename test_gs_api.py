import gs_api as gs

def test():
  sID = gs.start_session()
  #r = gs.get_stream_key_stream_server(sID, '33123639')
  #r = gs.get_song_url_from_song_id(sID, '33123639')
  #r = gs.get_playlist(sID, '75521778')
  #r = gs.get_autocomplete_search_results(sID, 'Call Me M', limit=5)
  #r = gs.get_song_search_results(sID, 'Call Me Maybe', limit=5)
  #r = gs.get_album_search_results(sID, 'Greatest Hits', limit=5)
  r = gs.get_artist_search_results(sID, 'Jay Chou', limit=5)
  print r

if __name__ == '__main__':
  test()
