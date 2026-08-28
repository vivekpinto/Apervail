# backend/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class ResourceCard(Base):
    __tablename__ = "resource_cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    url = Column(String, nullable=False)
    category = Column(String, nullable=False)
    tags = Column(String)  # For simplicity, we'll store tags as comma-separated later

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(String)  # You can use DateTime if preferred

    scores = relationship("Score", back_populates="user")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    questions = relationship("Question", back_populates="quiz")
    scores = relationship("Score", back_populates="quiz")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    correct_answer = Column(String, nullable=False)  # We'll store the correct option text or a single correct answer
    # For simplicity, we'll store options as a JSON string (comma-separated). But better to use a separate options table or JSON column.
    # For now, use a single column `options` as Text with JSON string.
    options = Column(Text)  # JSON string of list of options, including correct one somewhere
    explanation = Column(Text, nullable=True)  # To store feedback

    quiz = relationship("Quiz", back_populates="questions")


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score_percent = Column(Float, nullable=False)  # e.g., 80.0
    time_taken = Column(Integer, nullable=True)  # in seconds
    feedback = Column(Text, nullable=True)  # AI feedback later

    user = relationship("User", back_populates="scores")
    quiz = relationship("Quiz", back_populates="scores")