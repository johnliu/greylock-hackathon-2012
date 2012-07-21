import os

class Config(object):
  """
  Default configuration.
  """
  DEBUG = bool(os.environ.get('DEBUG'))
  TESTING = bool(os.environ.get('TESTING'))
  SECRET_KEY = unicode(os.environ.get('SECRET'))

  FIREBASE = os.environ.get('FIREBASE_URL')

