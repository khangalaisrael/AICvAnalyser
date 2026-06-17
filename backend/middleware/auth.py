import urllib.request
import json

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from config import SUPABASE_JWKS_URL

_security = HTTPBearer()
_cached_keys: list[dict] | None = None


def _get_jwks() -> list[dict]:
    global _cached_keys
    if _cached_keys is None:
        with urllib.request.urlopen(SUPABASE_JWKS_URL, timeout=5) as resp:
            _cached_keys = json.loads(resp.read())["keys"]
    return _cached_keys


def _decode_token(token: str) -> dict:
    keys = _get_jwks()
    # Try each key in the JWKS (handles key rotation)
    last_err: Exception = JWTError("No keys available")
    for key in keys:
        try:
            return jwt.decode(
                token,
                key,
                algorithms=[key.get("alg", "ES256")],
                options={"verify_aud": False},
            )
        except JWTError as e:
            last_err = e
    raise last_err


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_security),
) -> str:
    try:
        payload = _decode_token(credentials.credentials)
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
