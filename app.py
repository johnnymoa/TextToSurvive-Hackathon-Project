from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
from mistralai import Mistral
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Initialize Mistral client
client = Mistral(api_key=api_key)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]

@app.post("/chat/complete")
async def chat_complete(request: ChatRequest):
    try:
        response = client.chat.complete(
            model=request.model,
            messages=[{"role": msg.role, "content": msg.content} for msg in request.messages]
        )
        return {
            "content": response.choices[0].message.content,
            "finish_reason": response.choices[0].finish_reason
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)