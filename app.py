import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Inicia o cliente oficial da Google
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

# Cria a sessão de chat nativa (ela cuida do histórico sozinha)
chat_session = client.chats.create(
    model="gemini-3.6-flash",
    config=types.GenerateContentConfig(
        system_instruction="Você é o FiapSchool bot. Responda sempre em inglês e de forma curta."
    )
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Pega os dados vindos do HTML
        data = request.get_json(silent=True) or {}
        pergunta = data.get("mensagem")
        
        if not pergunta:
            return jsonify({"resposta": "Mensagem vazia."}), 400

        # Envia direto para a sessão nativa do Gemini
        response = chat_session.send_message(pergunta)
        
        # Devolve a resposta exata em texto
        return jsonify({"resposta": response.text})

    except Exception as erro:
        print("\n❌ ERRO DETALHADO NO TERMINAL:", erro, "\n")
        return jsonify({"resposta": f"Erro interno: {str(erro)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
