from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Create database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./masons.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create declarative base
Base = declarative_base()

# Define Mason model
class Mason(Base):
    __tablename__ = "masons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    expected_rate = Column(Float)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Define IVRSession model
class IVRSession(Base):
    __tablename__ = "ivr_sessions"

    id = Column(Integer, primary_key=True, index=True)
    mason_id = Column(Integer, index=True)
    question_index = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    responses = Column(JSON, default=list)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# CRUD operations for Mason
def create_mason(db, name: str, location: str, expected_rate: float):
    mason = Mason(
        name=name,
        location=location,
        expected_rate=expected_rate
    )
    db.add(mason)
    db.commit()
    db.refresh(mason)
    return mason

def get_mason(db, mason_id: int):
    return db.query(Mason).filter(Mason.id == mason_id).first()

def get_available_masons(db):
    return db.query(Mason).filter(Mason.is_available == True).all()

def update_mason_availability(db, mason_id: int, is_available: bool):
    mason = get_mason(db, mason_id)
    if mason:
        mason.is_available = is_available
        mason.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(mason)
    return mason

# CRUD operations for IVRSession
def create_ivr_session(db):
    session = IVRSession()
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def update_session_progress(db, session_id: int, question_index: int, response: str = None):
    session = db.query(IVRSession).filter(IVRSession.id == session_id).first()
    if session:
        session.question_index = question_index
        session.completed = question_index >= 3
        if response:
            responses = session.responses or []
            responses.append(response)
            session.responses = responses
        db.commit()
        db.refresh(session)
    return session