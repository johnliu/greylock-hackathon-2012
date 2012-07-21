import os

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


def gs_request(method, parameters):
  # Request the session if it doesn't exist
  if 'gs_session' not in session:
    session['gs_session'] = None

  # Get the session id from cookies.
  g.gs_session = session['gs_session']


@app.route('/')
def front():
  return render_base(template='front.html')


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

