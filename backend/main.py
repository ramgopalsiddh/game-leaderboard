from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, SessionLocal
from models import Base, Game
import crud
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from contextlib import asynccontextmanager

Base.metadata.create_all(bind=engine)

# Start and stop the scheduler when FastAPI app starts
scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# background job
def refresh_popularity():
    db = SessionLocal() 
    crud.update_popularity_score(db)
    db.close()

# Schedule the job to run
scheduler.add_job(refresh_popularity, "interval", minutes=5)

# logging for job execution
def job_listener(event):
    if event.exception:
        print(f"Refresh Popularity Score Job {event.job_id} failed")
    else:
        print(f" Refresh Popularity Score Job {event.job_id} completed")

# Listen to job events
scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)

# Routes
class ContestantCreate(BaseModel):
    name: str
    email: str

@app.post("/contestants/")
def create_contestant(contestant: ContestantCreate, db: Session = Depends(get_db)):
    return crud.create_contestant(db, contestant.name, contestant.email)

class ContestantUpdate(BaseModel):
    name: str
    email: str

@app.put("/contestants/{contestant_id}")
def update_contestant_endpoint(contestant_id: int, contestant: ContestantUpdate, db: Session = Depends(get_db)):
    updated_contestant = crud.update_contestant(db, contestant_id, contestant.name, contestant.email)
    if not updated_contestant:
        raise HTTPException(status_code=404, detail="Contestant not found")
    return { "message": "Contestant updated successfully", 
            "updated_contestant": {"id": updated_contestant.id, "name": updated_contestant.name, "email": updated_contestant.email}}


@app.delete("/contestants/{contestant_id}")
def delete_contestant_endpoint(contestant_id: int, db: Session = Depends(get_db)):
    success = crud.delete_contestant(db, contestant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contestant not found")
    return {"message": "Contestant deleted successfully"}


class GameCreate(BaseModel):
    name: str
    description: str = ""

@app.post("/games/")
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    return crud.create_game(db, game.name, game.description)


@app.post("/games/{game_id}/start")
def start_game(game_id: int, db: Session = Depends(get_db)):
    try:
        game = crud.start_game(db, game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return {"message": f"Game {game_id} started"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/games/{game_id}/end")
def end_game(game_id: int, db: Session = Depends(get_db)):
    try:
        game = crud.end_game(db, game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return {"message": f"Game {game_id} ended at {game.end_time}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/games/{game_id}/upvote")
def upvote_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game:
        game.upvotes += 1
        db.commit()
        db.refresh(game)
        return {"message": "Game upvoted"}
    raise HTTPException(status_code=404, detail="Game not found")

@app.post("/games/{game_id}/contestants/{contestant_id}/enter")
def enter_game(game_id: int, contestant_id: int, db: Session = Depends(get_db)):
    try:
        response = crud.enter_game(db, game_id, contestant_id)
        if response is None:
            raise HTTPException(status_code=404, detail="Game or Contestant not found")
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/games/{game_id}/contestants/{contestant_id}/exit")
def exit_game(game_id: int, contestant_id: int, db: Session = Depends(get_db)):
    try:
        response = crud.exit_game(db, game_id, contestant_id)
        if response is None:
            raise HTTPException(status_code=404, detail="Game or Contestant not found")
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



class ScoreCreate(BaseModel):
    game_id: int
    contestant_id: int
    score: int

@app.post("/scores/")
def assign_score(score_data: ScoreCreate, db: Session = Depends(get_db)):
    try:
        return crud.assign_score(db, score_data.game_id, score_data.contestant_id, score_data.score)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/leaderboard/")
def get_leaderboard(game_id: int = None, db: Session = Depends(get_db)):
    return crud.get_leaderboard(db, game_id)

@app.get("/popularity/")
def get_popularity(db: Session = Depends(get_db)):
    results = db.query(Game.id, Game.name, Game.popularity_score).order_by(Game.popularity_score.desc()).all()

    games = [{"id": game.id, "name": game.name, "popularity_score": game.popularity_score} for game in results]
    return games

@app.get("/")
def root():
    return {"message": "Game Leaderboard API is running"}
