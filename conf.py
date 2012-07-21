import os

class Config(object):
  """
  Default configuration.
  """
  DEBUG = bool(os.environ.get('DEBUG'))
  TESTING = bool(os.environ.get('TESTING'))
  SECRET_KEY = unicode(os.environ.get('SECRET'))

  FIREBASE = os.environ.get('FIREBASE_URL')
  GS_SECRET = os.environ.get('GS_SECRET')
  GS_KEY = os.environ.get('GS_KEY')
  GS_TINYSONG = os.environ.get('GS_TINYSONG')

