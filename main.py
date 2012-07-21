import os

from flask import Flask

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_object('conf.Config')

@app.route('/')
def front():
  """
  The front page.
  """
  return "Hello world!"


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

