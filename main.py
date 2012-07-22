import os
import json
import gs_api as gs
import ts_api as ts

from flask import (Flask, render_template, session,
    request, redirect, url_for)

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


@app.route('/<room>', methods=['GET', 'POST'])
def room(room):
  import sys
  if request.method == 'POST':
    search_result = ts.search_request(request.form['search_query'])
    result_json = json.dumps(search_result)
    return result_json
  return render_base('room.html', room=room)


@app.route('/play')
def play():
  gs_session = gs.start_session()
  gs_stream = gs.get_stream_key_stream_server(gs_session, 33123639)
  return render_base(template='play.html', data=gs_stream['url'])


@app.route('/_play', methods=['GET'])
def json_play():
  song_id = request.args.get('song_id')
  if 'gs_session' in session and song_id:
    song_data = gs.get_stream_key_stream_server(session['gs_session'], song_id)
    return json.dumps(song_data)
  return json.dumps('')


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

