from typing import List

class OpenAIService:
    def __init__(self):
            self.client = None
        print("OpenAI service disabled - using fallback mode")

    async def get_embedding(self, text: str) -> List[float]:
        # Return a default vector when OpenAI is not available
        return [0.0] * 1536

openai_service = OpenAIService() 