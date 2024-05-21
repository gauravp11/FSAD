import jwt
import time
from cryptography.hazmat.primitives import serialization
 
# Load the private key
with open("private_key.pem", "rb") as private_file:
    private_key = private_file.read()
 
# Payload
payload = {
    "username": "gauravP",
    "userID": 23445,
    "exp": int(time.time()) + 60 * 60  # Add expiration time (1 hour)
}
 
# Generate JWT
token = jwt.encode(payload, private_key, algorithm='RS256')
 
print(token)