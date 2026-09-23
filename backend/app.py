from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os


# ==========================================
# SAFENEXA AI - BACKEND SETUP
# ==========================================

load_dotenv()

app = Flask(__name__)
CORS(app)


# ==========================================
# OPENAI CLIENT
# ==========================================

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("WARNING: OPENAI_API_KEY is not configured.")

client = OpenAI(api_key=api_key) if api_key else None


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():

    return "SafeNexa AI Backend is Running 🚀"


# ==========================================
# AI CHAT API
# ==========================================

@app.route("/api/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        if not data or "message" not in data:

            return jsonify({
                "error": "Message is required."
            }), 400


        user_message = data["message"].strip()


        if not user_message:

            return jsonify({
                "error": "Message cannot be empty."
            }), 400


        if client is None:

            return jsonify({
                "error": "AI API key is not configured."
            }), 500


        response = client.responses.create(

            model="gpt-5.6",

            instructions="""
You are SafeNexa AI, an intelligent safety and emergency
support assistant.

Your role is to provide calm, clear and practical safety
guidance.

If the user appears to be in immediate danger, encourage
them to contact the appropriate local emergency service
and move to a safer location when possible.

Do not claim that you have contacted emergency services,
police, ambulance, fire services, or a person's emergency
contacts.

Do not invent a user's location.

Keep emergency guidance concise and easy to follow.
""",

            input=user_message
        )


        return jsonify({
            "reply": response.output_text
        })


    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": "AI service is temporarily unavailable."
        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

