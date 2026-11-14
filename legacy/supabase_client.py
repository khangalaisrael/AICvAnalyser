import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

try:
    import streamlit as st
    url = st.secrets.get("SUPABASE_URL") or os.getenv("SUPABASE_URL")
    key = st.secrets.get("SUPABASE_KEY") or os.getenv("SUPABASE_KEY")
except Exception:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)


def set_supabase_session(access_token: str, refresh_token: str):
    supabase.auth.set_session(access_token, refresh_token)
