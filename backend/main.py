from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base
import crud
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Routes
class ContestantCreate(BaseModel):
    name: str
    email: str

@app.post("/contestants/")
def create_contestant(contestant: ContestantCreate, db: Session = Depends(get_db)):
    return crud.create_contestant(db, contestant.name, contestant.email)

class GameCreate(BaseModel):
    name: str
    description: str = ""

@app.post("/games/")
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    return crud.create_game(db, game.name, game.description)


@app.post("/games/{game_id}/start")
def start_game(game_id: int, db: Session = Depends(get_db)):
    game = crud.start_game(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"message": f"Game {game_id} started"}

@app.post("/games/{game_id}/end")
def end_game(game_id: int, db: Session = Depends(get_db)):
    game = crud.end_game(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"message": f"Game {game_id} ended"}

class ScoreCreate(BaseModel):
    game_id: int
    contestant_id: int
    score: int

@app.post("/scores/")
def assign_score(score_data: ScoreCreate, db: Session = Depends(get_db)):
    return crud.assign_score(db, score_data.game_id, score_data.contestant_id, score_data.score)

@app.get("/leaderboard/")
def get_leaderboard(game_id: int = None, db: Session = Depends(get_db)):
    return crud.get_leaderboard(db, game_id)

@app.get("/")
def root():
    return {"message": "Game Leaderboard API is running"}
