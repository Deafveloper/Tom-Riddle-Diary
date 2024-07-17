from openai import OpenAI

client = OpenAI(api_key='your-openai-api-key')


def get_response(message):
    response = client.completions.create(engine="text-davinci-003",
    prompt=f"Tom Riddle's response: {message}",
    max_tokens=100)
    return response.choices[0].text.strip()

