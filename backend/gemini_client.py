import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

def generate_quiz(topic: str, num_questions: int = 5) -> dict:
    """
    Ask Gemini to generate a quiz on a given topic.
    Returns a dict with keys: title, description, questions (list of dicts with
    question_text, options (list), correct_answer, explanation)
    """
    if not client:
        raise Exception("Gemini API key not configured")

    prompt = f"""
    Generate a quiz on the topic "{topic}" for an accessibility learning website.
    The quiz should have exactly {num_questions} multiple-choice questions.
    Each question should have 4 options, exactly one correct answer, and a brief explanation.

    Return ONLY a valid JSON object with the following structure:
    {{
      "title": "Quiz title",
      "description": "Short description of the quiz",
      "questions": [
        {{
          "question_text": "Question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": "The correct option text exactly as it appears in options",
          "explanation": "Explanation why this is correct"
        }},
        ...
      ]
    }}
    Do not include any markdown formatting or extra text. Return only the JSON.
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    text = response.text.strip()

    # Remove markdown code fences if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
    text = text.strip()

    # In case the model still adds extra text, try to extract JSON between braces
    import re
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        text = json_match.group(0)
    else:
        raise ValueError("No JSON found in Gemini response")

    quiz_data = json.loads(text)
    return quiz_data


def generate_feedback(score_percent: float, quiz_title: str, weak_areas: list = None) -> str:
    """
    Generate personalized feedback based on the user's score.
    weak_areas is an optional list of question topics the user missed.
    """
    if not client:
        return "AI feedback unavailable (API key not configured)."

    weak_str = ", ".join(weak_areas) if weak_areas else "none"
    prompt = f"""
    A user just completed the quiz "{quiz_title}" and scored {score_percent:.1f}%.
    The topics they struggled with were: {weak_str}.
    Write a short, encouraging, and educational feedback message (2-3 sentences) that helps them improve their accessibility knowledge.
    """
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    return response.text.strip()