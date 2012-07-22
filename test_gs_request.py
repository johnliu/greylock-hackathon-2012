import gs_request as gs

def test():
  sID = gs.start_session()
  #country = gs.get_country(sID)
  r = gs.get_stream_key_stream_server(sID, '33123639')
  print r

if __name__ == '__main__':
  test()
