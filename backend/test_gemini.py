import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# List available models (optional)
print("Listing models (first 10):")
for m in client.models.list():
    if "flash" in m.name or "gemini" in m.name:
        print(m.name)
        break  # just show one

# Test generation
response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Say hello"
)
print("Response:", response.text)