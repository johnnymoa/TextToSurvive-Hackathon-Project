# team9

### git huggingface

git remote add huggingface-test https://huggingface.co/spaces/The-Last-Message/spaces-docker-backend-quarterback

### Docker

# Build the image
docker build -t p5js-game .

# Run the container
docker run -p 8000:8000 p5js-game

# Build the image
docker build -t elevenlabs-api .

# Run the container
docker run -p 7860:7860 -e ELEVENLABS_API_KEY=your_api_key elevenlabs-api