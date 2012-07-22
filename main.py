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


def gs_request(method, parameters):
  # Request the session if it doesn't exist
  if 'gs_session' not in session:
    session['gs_session'] = None

  # Get the session id from cookies.
  g.gs_session = session['gs_session']


@app.route('/', methods=['GET', 'POST'])
def front():
  if request.method == 'POST':
    #TODO(johnliu): create Grooveshark session ID

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
  """
  Test method.
  """
  return render_base()


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

