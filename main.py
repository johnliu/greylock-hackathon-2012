import os
import json
import gs_api as gs
import ts_api as ts

from flask import (Flask, render_template, session,
    request, redirect, url_for, make_response)

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_object('conf.Config')


def render_base(template='base.html', **kwargs):
  default_args = {
    'firebase_url': app.config['FIREBASE']
  }

  merged_args = dict(default_args, **kwargs)
  return render_template(template, **merged_args)


@app.route('/', methods=['GET', 'POST'])
def front():
  if request.method == 'POST':
    # Create the Grooveshark session for the room.
    session['gs_session'] = gs.start_session()

    room = request.form['name'].replace(' ', '_')
    return redirect(url_for('room', room=room))
  return render_base('front.html')


"""MOBILE"""

@app.route('/m')
def mobile():
  return render_base('front.html')

@app.route('/m/<room>')
def mobile_room(room):
  return render_base('mobile_room.html', room=room)

@app.route('/m/_search')
def mobile_search():
  search_query = request.args.get('search_query')
  return json_search(search_query)

"""MOBILE"""


@app.route('/<room>')
def room(room):
  return render_base('room.html', room=room)


@app.route('/play')
def play():
  gs_session = gs.start_session()
  gs_stream = gs.get_stream_key_stream_server(gs_session, 33123639)
  return render_base(template='play.html', data=gs_stream['url'])

@app.route('/_queue_list', methods=['GET', 'POST'])
def queue_list():
  if request.method == 'POST':
    filename = 'test'
    server_path = 'http://gamma.firebase.com/bling/rooms/helo.json'
    response = make_response()
    response.headers['Content-Type'] = 'application/'
    response.headers['Content-Disposition'] = 'attachment; filename=%s' % filename
    response.headers['X-Accel-Redirect'] = server_path
    import sys; print >> sys.stderr, response
    return response

@app.route('/_search')
def json_search(search_query=''):
  if not search_query:
    search_query = request.args.get('search_query')
  search_result = ts.search_request(search_query, limit=50)
  return json.dumps(search_result)


@app.route('/_authenticate', methods=['GET', 'POST'])
def json_authenticate():
  if request.method == 'GET':
    username = request.args.get('username')
    password = request.args.get('password')
    auth_result = ''
    library_result = ''
    if 'gs_session' in session:
      if username and password:
        auth_result = gs.authenticate(session['gs_session'], username, password)
        library_result = gs.get_user_library_songs(session['gs_session'])
      else:
        auth_result = False
    else:
      #User no session.
      auth_result = False

    return json.dumps(library_result)


@app.route('/_library')
def json_user_library():
  if 'gs_session' in session:
    if gs.authenticated_find(session['gs_session']):
      library_result = gs.get_user_library_songs(session['gs_session'])
    else:
      #User not authenticated. Need to authenticate.
      pass
  else:
    #User has no session.
    pass
  return json.dumps(library_result)


@app.route('/_play')
def json_play():
  song_id = request.args.get('song_id')
  album_id = request.args.get('album_id')

  cover_art_result = '';
  song_data = ''
  if 'gs_session' in session and song_id:
    #song_data = gs.get_stream_key_stream_server(session['gs_session'], song_id)

    import random
    song_data = {
      'url': url_for('static', filename='.test/0%s.mp3' % random.randrange(1, 6)),
      'stream_key': '',
      'stream_server_id': '',
      'duration': 5000000
    }

    if album_id:
      cover_art_result = gs.get_album_art(session['gs_session'], album_id)
      song_data['cover_art_url'] = cover_art_result
  return json.dumps(song_data)


@app.route('/_complete', methods=['POST'])
def json_complete():
  form = request.form
  success_data = ''
  if 'gs_session' in session and form:
    success_data = gs.mark_song_complete(session['gs_session'],
        form['stream_key'], form['stream_server_id'], form['song_id'])
  return json.dumps(success_data)


@app.route('/_over_30', methods=['POST'])
def json_over_30():
  form = request.form
  success_data = ''
  if 'gs_session' in session and form:
    success_data = gs.mark_stream_key_over_30_secs(session['gs_session'],
        form['stream_key'], form['stream_server_id'])
  return json.dumps(success_data)


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

