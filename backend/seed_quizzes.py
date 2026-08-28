from database import SessionLocal
import models
import json

db = SessionLocal()

# Create a sample quiz
if not db.query(models.Quiz).filter_by(title="ARIA Basics").first():
    quiz1 = models.Quiz(
        title="ARIA Basics",
        description="Test your knowledge of ARIA attributes and roles."
    )
    db.add(quiz1)
    db.commit()
    db.refresh(quiz1)

    # Questions for quiz1
    questions1 = [
        {
            "question_text": "What does ARIA stand for?",
            "options": json.dumps(["Accessible Rich Internet Applications", "Advanced Resource Internet Access", "Automated Responsive Interface Applications"]),
            "correct_answer": "Accessible Rich Internet Applications",
            "explanation": "ARIA stands for Accessible Rich Internet Applications."
        },
        {
            "question_text": "Which ARIA attribute is used to label an element?",
            "options": json.dumps(["aria-labelledby", "aria-describedby", "aria-label"]),
            "correct_answer": "aria-label",
            "explanation": "aria-label provides a string value that labels an element."
        },
        {
            "question_text": "True or False: ARIA changes the visual appearance of an element.",
            "options": json.dumps(["True", "False"]),
            "correct_answer": "False",
            "explanation": "ARIA only affects accessibility semantics, not visual styling."
        }
    ]

    for q in questions1:
        db.add(models.Question(quiz_id=quiz1.id, **q))

    db.commit()

# Create another sample quiz
if not db.query(models.Quiz).filter_by(title="Color Contrast").first():
    quiz2 = models.Quiz(
        title="Color Contrast",
        description="Check your understanding of WCAG contrast requirements."
    )
    db.add(quiz2)
    db.commit()
    db.refresh(quiz2)

    questions2 = [
        {
            "question_text": "What is the minimum contrast ratio for normal text under WCAG AA?",
            "options": json.dumps(["3:1", "4.5:1", "7:1"]),
            "correct_answer": "4.5:1",
            "explanation": "WCAG AA requires 4.5:1 for normal text."
        },
        {
            "question_text": "For large text (24px or 19px bold), what is the minimum contrast ratio under WCAG AA?",
            "options": json.dumps(["3:1", "4.5:1", "7:1"]),
            "correct_answer": "3:1",
            "explanation": "Large text only needs 3:1 contrast ratio for AA."
        }
    ]

    for q in questions2:
        db.add(models.Question(quiz_id=quiz2.id, **q))

    db.commit()

db.close()
print("Quiz seed data inserted")