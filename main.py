import os
import gs_api as gs
import ts_api as ts

from flask import Flask, render_template, session

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_object('conf.Config')


def render_base(template='base.html', **kwargs):
  default_args = {
    'firebase_url': app.config['FIREBASE']
  }

  merged_args = dict(default_args, **kwargs)
  return render_template(template, **merged_args)


@app.route('/')
def front():
  return render_base(template='front.html')


@app.route('/room')
def room():
  return render_base(template='room.html')


@app.route('/play')
def play():
  gs_session = gs.start_session()
  gs_stream = gs.get_stream_key_stream_server(gs_session, 33123639)
  return render_base(template='play.html', data=gs_stream['url'])


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

