

# This wrapper provides several features:

# 1. A `ImageGenerationParams` dataclass to handle parameters with default values
# 2. A `ImageGenerationResult` class to wrap the API response
# 3. The main `ImagenWrapper` class with:
#    - Proper initialization with error handling
#    - Logging support
#    - Two methods for generation:
#      - `generate()` using the `ImageGenerationParams` class
#      - `generate_simple()` for a more straightforward interface

# Here's how to use it:

# # Example usage:

# # Initialize the wrapper
# wrapper = ImagenWrapper("https://bcdb8b7f9c4a57127c.gradio.live/")

# # Method 1: Using ImageGenerationParams
# params = ImageGenerationParams(
#     prompt="A beautiful sunset over mountains",
#     width=512,
#     height=512
# )
# result = wrapper.generate(params)

# # Method 2: Using generate_simple
# result = wrapper.generate_simple(
#     prompt="A beautiful sunset over mountains",
#     width=512,
#     height=512
# )

# # Access the results
# print(f"Image URL: {result.image_url}")
# print(f"Seed used: {result.seed}")

# The wrapper includes:
# - Type hints for better IDE support
# - Error handling and logging
# - Parameter validation
# - Flexible parameter input (both through dataclass and dictionary)
# - Clean result handling through a dedicated class

# You can also add error handling in your code:

# try:
#     wrapper = ImagenWrapper("https://bcdb8b7f9c4a57127c.gradio.live/")
#     result = wrapper.generate_simple("A beautiful sunset")
#     print(f"Generated image: {result}")
# except ConnectionError as e:
#     print(f"Failed to connect to API: {e}")
# except RuntimeError as e:
#     print(f"Generation failed: {e}")
# except Exception as e:
#     print(f"Unexpected error: {e}")



from gradio_client import Client
from typing import Dict, Tuple, Optional, Union
from dataclasses import dataclass
import logging

@dataclass
class ImageGenerationParams:
    """Data class to hold image generation parameters"""
    prompt: str
    seed: float = 0
    randomize_seed: bool = True
    width: float = 1024
    height: float = 1024
    guidance_scale: float = 3.5
    num_inference_steps: float = 28
    lora_scale: float = 0.7

class ImageGenerationResult:
    """Class to handle the generation result"""
    def __init__(self, image_data: Dict, seed: float):
        self.image_path = image_data.get('path')
        self.image_url = image_data.get('url')
        self.size = image_data.get('size')
        self.orig_name = image_data.get('orig_name')
        self.mime_type = image_data.get('mime_type')
        self.is_stream = image_data.get('is_stream', False)
        self.meta = image_data.get('meta', {})
        self.seed = seed

    def __str__(self) -> str:
        return f"ImageGenerationResult(url={self.image_url}, seed={self.seed})"

class ImagenWrapper:
    """Wrapper class for the Imagen Gradio deployment"""
    
    def __init__(self, api_url: str):
        """
        Initialize the wrapper with the API URL
        
        Args:
            api_url (str): The URL of the Gradio deployment
        """
        self.api_url = api_url
        self.logger = logging.getLogger(__name__)
        try:
            self.client = Client(api_url)
            self.logger.info(f"Successfully connected to API at {api_url}")
        except Exception as e:
            self.logger.error(f"Failed to connect to API at {api_url}: {str(e)}")
            raise ConnectionError(f"Failed to connect to API: {str(e)}")

    def generate(self, 
                params: Union[ImageGenerationParams, Dict],
                ) -> ImageGenerationResult:
        """
        Generate an image using the provided parameters
        
        Args:
            params: Either an ImageGenerationParams object or a dictionary with the parameters
            
        Returns:
            ImageGenerationResult: Object containing the generation results
            
        Raises:
            ValueError: If parameters are invalid
            RuntimeError: If the API call fails
        """
        try:
            # Convert dict to ImageGenerationParams if necessary
            if isinstance(params, dict):
                params = ImageGenerationParams(**params)
            
            # Validate parameters
            if not params.prompt:
                raise ValueError("Prompt cannot be empty")
            
            # Make the API call
            result = self.client.predict(
                prompt=params.prompt,
                seed=params.seed,
                randomize_seed=params.randomize_seed,
                width=params.width,
                height=params.height,
                guidance_scale=params.guidance_scale,
                num_inference_steps=params.num_inference_steps,
                lora_scale=params.lora_scale,
                api_name="/infer"
            )
            
            # Process the result
            if not result or len(result) != 2:
                raise RuntimeError("Invalid response from API")
            
            image_data, seed = result
            return ImageGenerationResult(image_data, seed)
            
        except Exception as e:
            self.logger.error(f"Error during image generation: {str(e)}")
            raise RuntimeError(f"Failed to generate image: {str(e)}")

    def generate_simple(self, 
                       prompt: str,
                       **kwargs) -> ImageGenerationResult:
        """
        Simplified interface for generating images
        
        Args:
            prompt (str): The prompt for image generation
            **kwargs: Optional parameters to override defaults
            
        Returns:
            ImageGenerationResult: Object containing the generation results
        """
        params = ImageGenerationParams(prompt=prompt, **kwargs)
        return self.generate(params)