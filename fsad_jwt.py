import secrets
import jwt
import time

secret = secrets.token_hex(32)
print("Generated secret: ",secret)
payload = {
    "username": "gpande",
    "userID": 123,
    "custom_claim": "demo",
    "exp": int(time.time()) + 60 * 60  # Add expiration time (1 hour)
}
token = jwt.encode(payload, secret, algorithm='HS256')

print("Generated JWT token:", token)

received_token = token

try:
    decoded = jwt.decode(received_token, secret, algorithms=['HS256'])
    print("\nDecoded payload:", decoded)
except jwt.exceptions.JWTError as e:
    print("Invalid JWT:", e)
