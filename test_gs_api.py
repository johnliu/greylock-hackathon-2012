import gs_api as gs
import os

def test():
  sID = gs.start_session()
  print 'Current sID: ' + sID
  #r = gs.get_stream_key_stream_server(sID, '33123639')
  #r = gs.get_song_url_from_song_id(sID, '33123639')
  #r = gs.get_playlist(sID, '75521778')
  #r = gs.get_autocomplete_search_results(sID, 'Call Me M', limit=5)
  #r = gs.get_song_search_results(sID, 'Call Me Maybe', limit=5)
  #r = gs.get_album_search_results(sID, 'Greatest Hits', limit=5)
  #r = gs.get_artist_search_results(sID, 'Jay Chou', limit=5)
  #r = gs.get_popular_songs_month()
  test_authenticate(sID)

def test_authenticate(sID):
  r = gs.authenticate(sID, 'asdfprou', os.environ.get('GS_USER_PW'))
  r = gs.get_user_library_songs(sID)
  if r:
    print 'got songs'
  else:
    print 'no songs'
  r = gs.add_user_favorite_song(sID, '33123639')
  r = gs.add_user_favorite_song(sID, '33332120')
  r = gs.remove_user_favorite_songs(sID, ['33332120', '33123639'])
  r = gs.get_user_playlists(sID)
  print r
  r = gs.logout(sID)

if __name__ == '__main__':
  test()
