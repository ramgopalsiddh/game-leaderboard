from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import game_contestants, Contestant, Game, Score
from datetime import datetime, timedelta

def create_contestant(db: Session, name: str, email: str):
    new_contestant = Contestant(name=name, email=email)
    db.add(new_contestant)
    db.commit()
    db.refresh(new_contestant)
    return new_contestant

def update_contestant(db: Session, contestant_id: int, name: str, email: str):
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    if contestant:
        contestant.name = name
        contestant.email = email
        db.commit()
        return contestant
    return None

def delete_contestant(db: Session, contestant_id: int):
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()
    if contestant:
        db.delete(contestant)
        db.commit()
        return True
    return False

def create_game(db: Session, name: str, description: str = ""):
    new_game = Game(name=name, description=description)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

def start_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        return None
    if game.start_time:
        raise ValueError("Game has already started")
    game.start_time = datetime.now()
    db.commit()
    db.refresh(game)
    return game

def end_game(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        return None
    if not game.start_time:
        raise ValueError("Game has not started yet")
    if game.end_time:
        raise ValueError("Game has already ended")
    game.end_time = datetime.now()
    db.commit()
    db.refresh(game)
    return game

def get_game_details(db: Session, game_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        return None

    game_details = {
        "id": game.id,
        "name": game.name,
        "description": game.description,
        "start_time": game.start_time,
        "end_time": game.end_time,
        "upvotes": game.upvotes,
        "popularity_score": game.popularity_score,
        "contestants": [{"id": c.id, "name": c.name} for c in game.contestants]
    }
    return game_details


def enter_game(db: Session, game_id: int, contestant_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()

    if not game or not contestant:
        return None

    # Check if contestant is already in the game
    in_game = db.execute(
        game_contestants.select().where(
            (game_contestants.c.game_id == game_id) & 
            (game_contestants.c.contestant_id == contestant_id)
        )
    ).fetchone()

    if in_game:
        raise ValueError("Contestant is already in the game")

    db.execute(game_contestants.insert().values(game_id=game_id, contestant_id=contestant_id))
    db.commit()
    return {"message": f"Contestant {contestant.name} entered the game {game.name}"}

def exit_game(db: Session, game_id: int, contestant_id: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()

    if not game or not contestant:
        return None

    in_game = db.execute(
        game_contestants.select().where(
            (game_contestants.c.game_id == game_id) & 
            (game_contestants.c.contestant_id == contestant_id)
        )
    ).fetchone()

    if not in_game:
        raise ValueError("Contestant is not in the game")

    db.execute(game_contestants.delete().where(
        (game_contestants.c.game_id == game_id) & 
        (game_contestants.c.contestant_id == contestant_id)
    ))
    db.commit()
    return {"message": f"Contestant {contestant.name} exited the game {game.name}"}



def assign_score(db: Session, game_id: int, contestant_id: int, score: int):
    game = db.query(Game).filter(Game.id == game_id).first()
    contestant = db.query(Contestant).filter(Contestant.id == contestant_id).first()

    if not game:
        raise ValueError("Game not found")
    if not contestant:
        raise ValueError("Contestant not found")
    if not game.start_time:
        raise ValueError("Game has not started")
    if game.end_time:
        raise ValueError("Game has already ended")

    in_game = db.execute(
        game_contestants.select().where(
            (game_contestants.c.game_id == game_id) &
            (game_contestants.c.contestant_id == contestant_id)
        )
    ).fetchone()

    if not in_game:
        raise ValueError("Contestant is not in the game and cannot receive a score.")

    new_score = Score(game_id=game_id, contestant_id=contestant_id, score=score)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    
    return new_score

def get_leaderboard(db: Session, game_id: int = None, date: str = None):
    query = (
        db.query(
            Score.contestant_id,
            Contestant.name,
            func.sum(Score.score).label("total_score")
        )
        .join(Contestant, Score.contestant_id == Contestant.id)
        .group_by(Score.contestant_id, Contestant.name)
        .order_by(func.sum(Score.score).desc())
    )

    if game_id:
        query = query.filter(Score.game_id == game_id)

    if date:
        # Ensure we extract just the date part of the timestamp
        query = query.filter(func.date(Score.timestamp) == date)

    results = query.all()

    return [
        {"contestant_id": r[0], "name": r[1], "total_score": r[2]}
        for r in results
    ]



def get_global_leaderboard(db: Session):
    results = (
        db.query(
            Score.contestant_id,
            Contestant.name,
            func.sum(Score.score).label("total_score")
        )
        .join(Contestant, Score.contestant_id == Contestant.id)
        .group_by(Score.contestant_id, Contestant.name)
        .order_by(desc("total_score"))
        .all()
    )

    return [
        {"contestant_id": r[0], "name": r[1], "total_score": r[2]}
        for r in results
    ]


def update_popularity_score(db: Session):
    yesterday = datetime.now() - timedelta(days=1)
    # Dynamic calculations for max values    
    max_w1 = db.query(Score.game_id).filter(Score.timestamp >= yesterday).distinct().count()
    max_w2 = db.query(Score.game_id).filter(Score.timestamp >= datetime.utcnow()).distinct().count()
    max_w3 = db.query(func.max(Game.upvotes)).scalar() or 1
    max_w4 = db.query(func.max(func.julianday(Game.end_time) - func.julianday(Game.start_time))).filter(Game.start_time >= yesterday).scalar() or 1
    max_w5 = db.query(Score.game_id).filter(Score.timestamp >= yesterday).distinct().count() or 1

    # Loop through all games
    games = db.query(Game).all()

    for game in games:
        # Calculate w1, w2, w3, w4, w5 for each game
        w1 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= yesterday).count()
        w2 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= datetime.utcnow()).count()
        w3 = game.upvotes
        w4 = (db.query(func.julianday(game.end_time) - func.julianday(game.start_time)).scalar() or 0) if game.start_time and game.end_time else 0
        w5 = db.query(Score).filter(Score.game_id == game.id, Score.timestamp >= yesterday).count()

        # Normalize and calculate popularity score
        game.popularity_score = (
            0.3 * (w1 / max_w1 if max_w1 else 1) +
            0.2 * (w2 / max_w2 if max_w2 else 1) +
            0.25 * (w3 / max_w3 if max_w3 else 1) +
            0.15 * (w4 / max_w4 if max_w4 else 1) +
            0.1 * (w5 / max_w5 if max_w5 else 1)
        )
    db.commit()

