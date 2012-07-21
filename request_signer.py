import hmac
import hashlib

digest_maker = hmac.new('7a50b3c1dd5202893c30b9368e44c7ce', '', hashlib.md5)

def generate_key(request):
  digest_maker.update(request)
  return digest_maker.hexdigest()

