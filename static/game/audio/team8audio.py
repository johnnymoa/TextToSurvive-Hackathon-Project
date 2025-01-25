from flask import Flask, request, send_file, jsonify, render_template
import os
import requests
from pydub import AudioSegment
import io
import uuid
import tempfile
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuration
class Config:
    ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', "<YOUR-API-KEY>")
    VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Default voice (Rachel)
    CHUNK_SIZE = 2000  # Characters per chunk
    TEMP_DIR = "temp_audio"
    DB_PATH = "data/audio_history.db"
    
    @staticmethod
    def create_temp_dir():
        if not os.path.exists(Config.TEMP_DIR):
            os.makedirs(Config.TEMP_DIR)
    
    @staticmethod
    def init_db():
        conn = sqlite3.connect(Config.DB_PATH)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS audio_generations
            (id TEXT PRIMARY KEY, 
             timestamp DATETIME,
             text TEXT,
             file_path TEXT)
        ''')
        conn.commit()
        conn.close()

# Database operations
class DatabaseManager:
    @staticmethod
    def add_generation(generation_id, text, file_path):
        conn = sqlite3.connect(Config.DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO audio_generations VALUES (?, ?, ?, ?)",
            (generation_id, datetime.now(), text, file_path)
        )
        conn.commit()
        conn.close()

    @staticmethod
    def get_generations():
        conn = sqlite3.connect(Config.DB_PATH)
        c = conn.cursor()
        c.execute("SELECT * FROM audio_generations ORDER BY timestamp DESC")
        generations = c.fetchall()
        conn.close()
        return generations

# Text processor class
class TextProcessor:
    @staticmethod
    def split_text(text, chunk_size):
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) > chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1
                
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks

# Audio Generator class
class AudioGenerator:
    def __init__(self):
        self.api_key = Config.ELEVENLABS_API_KEY
        self.voice_id = Config.VOICE_ID

    def generate_audio_chunk(self, text, previous_text=None, next_text=None, previous_request_ids=None):
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}/stream"
        
        headers = {
            "xi-api-key": self.api_key
        }
        
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2"
        }
        
        if previous_text is not None:
            payload["previous_text"] = previous_text
        if next_text is not None:
            payload["next_text"] = next_text
        if previous_request_ids:
            payload["previous_request_ids"] = previous_request_ids[-3:]

        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code} - {response.text}")
            
        return response.content, response.headers.get("request-id")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        context_before = data.get('context_before', '')
        context_after = data.get('context_after', '')
        
        processor = TextProcessor()
        generator = AudioGenerator()
        
        chunks = processor.split_text(text, Config.CHUNK_SIZE)
        
        segments = []
        previous_request_ids = []
        
        for i, chunk in enumerate(chunks):
            is_first = i == 0
            is_last = i == len(chunks) - 1
            
            prev_text = None if is_first else (context_before + " " + " ".join(chunks[:i])).strip()
            next_text = None if is_last else (" ".join(chunks[i+1:]) + " " + context_after).strip()
            
            audio_content, request_id = generator.generate_audio_chunk(
                chunk,
                previous_text=prev_text,
                next_text=next_text,
                previous_request_ids=previous_request_ids
            )
            
            segments.append(AudioSegment.from_mp3(io.BytesIO(audio_content)))
            previous_request_ids.append(request_id)
        
        final_audio = segments[0]
        for segment in segments[1:]:
            final_audio += segment
        
        generation_id = str(uuid.uuid4())
        output_path = os.path.join(Config.TEMP_DIR, f"{generation_id}.wav")
        final_audio.export(output_path, format="wav")
        
        # Save to database
        DatabaseManager.add_generation(generation_id, text, output_path)
        
        return send_file(
            output_path,
            mimetype="audio/wav",
            as_attachment=True,
            download_name="generated_audio.wav"
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/voices', methods=['GET'])
def get_voices():
    try:
        response = requests.get(
            "https://api.elevenlabs.io/v1/voices",
            headers={"xi-api-key": Config.ELEVENLABS_API_KEY}
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        generations = DatabaseManager.get_generations()
        return jsonify([{
            'id': g[0],
            'timestamp': g[1],
            'text': g[2],
            'file_path': g[3]
        } for g in generations])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    # Initialize directories and database
    Config.create_temp_dir()
    Config.init_db()
    
    # Run the Flask app
    port = int(os.getenv('PORT', 7860))
    app.run(host='0.0.0.0', port=port)