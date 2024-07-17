import openai
import json

# Set your OpenAI API key
openai.api_key = 'your_api_key_here'

class TomRiddleDiary:
    def __init__(self):
        self.entries = []
    
    def add_entry(self, user_input):
        self.entries.append(user_input)

    def generate_response(self, user_input):
        # Here, we format the context to feed into GPT
        context = "\n".join(self.entries[-5:])  # Use last 5 entries for context

        # Prompt to OpenAI's API
        prompt = f"You are Tom Riddle, a dark wizard from the Harry Potter universe. Respond to this user input:\n{context}\nUser: {user_input}\nTom Riddle:"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if you have access
            messages=[{"role": "user", "content": prompt}],
        )

        return response['choices'][0]['message']['content'].strip()
