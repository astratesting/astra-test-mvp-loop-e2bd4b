from datetime import date, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Habit, HabitLog, User
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["habits"])


class HabitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    reminder_email: bool = True


class HabitUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=500)
    reminder_email: bool | None = None


class HabitLogCreate(BaseModel):
    logged_on: date = Field(default_factory=date.today)
    note: str | None = Field(default=None, max_length=500)


class HabitResponse(BaseModel):
    id: int
    name: str
    description: str | None
    reminder_email: bool
    current_streak: int
    best_streak: int
    logged_today: bool
    weekly_completion_rate: int


class WeeklySummary(BaseModel):
    total_habits: int
    total_checkins: int
    weekly_completion_rate: int
    highlights: list[str]


def habit_for_user(db: Session, habit_id: int, user_id: int) -> Habit:
    habit = db.query(Habit).options(joinedload(Habit.logs)).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


def streaks(log_dates: set[date]) -> tuple[int, int]:
    if not log_dates:
        return 0, 0
    today = date.today()
    current = 0
    cursor = today
    while cursor in log_dates:
        current += 1
        cursor -= timedelta(days=1)

    best = 0
    run = 0
    previous = None
    for logged_on in sorted(log_dates):
        if previous is None or logged_on == previous + timedelta(days=1):
            run += 1
        else:
            run = 1
        best = max(best, run)
        previous = logged_on
    return current, best


def weekly_rate(log_dates: set[date]) -> int:
    today = date.today()
    week = {today - timedelta(days=offset) for offset in range(7)}
    return round(len(log_dates & week) / 7 * 100)


def serialize_habit(habit: Habit) -> HabitResponse:
    log_dates = {log.logged_on for log in habit.logs}
    current, best = streaks(log_dates)
    return HabitResponse(
        id=habit.id,
        name=habit.name,
        description=habit.description,
        reminder_email=habit.reminder_email,
        current_streak=current,
        best_streak=best,
        logged_today=date.today() in log_dates,
        weekly_completion_rate=weekly_rate(log_dates),
    )


@router.get("/habits", response_model=list[HabitResponse])
def list_habits(current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habits = db.query(Habit).options(joinedload(Habit.logs)).filter(Habit.user_id == current_user.id).order_by(Habit.created_at.desc()).all()
    return [serialize_habit(habit) for habit in habits]


@router.post("/habits", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(payload: HabitCreate, current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habit = Habit(user_id=current_user.id, name=payload.name, description=payload.description, reminder_email=payload.reminder_email)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return serialize_habit(habit)


@router.patch("/habits/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id: int, payload: HabitUpdate, current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habit = habit_for_user(db, habit_id, current_user.id)
    if payload.name is not None:
        habit.name = payload.name
    if payload.description is not None:
        habit.description = payload.description
    if payload.reminder_email is not None:
        habit.reminder_email = payload.reminder_email
    db.commit()
    db.refresh(habit)
    return serialize_habit(habit)


@router.delete("/habits/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(habit_id: int, current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habit = habit_for_user(db, habit_id, current_user.id)
    db.delete(habit)
    db.commit()


@router.post("/habits/{habit_id}/logs", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def log_habit(habit_id: int, payload: HabitLogCreate, current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habit = habit_for_user(db, habit_id, current_user.id)
    existing = db.query(HabitLog).filter(HabitLog.habit_id == habit.id, HabitLog.logged_on == payload.logged_on).first()
    if existing:
        existing.note = payload.note
    else:
        db.add(HabitLog(habit_id=habit.id, logged_on=payload.logged_on, note=payload.note))
    db.commit()
    db.refresh(habit)
    return serialize_habit(habit)


@router.get("/weekly-summary", response_model=WeeklySummary)
def weekly_summary(current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    habits = db.query(Habit).options(joinedload(Habit.logs)).filter(Habit.user_id == current_user.id).all()
    if not habits:
        return WeeklySummary(total_habits=0, total_checkins=0, weekly_completion_rate=0, highlights=["Create your first daily habit to start a streak."])
    today = date.today()
    week = {today - timedelta(days=offset) for offset in range(7)}
    total_checkins = sum(1 for habit in habits for log in habit.logs if log.logged_on in week)
    possible = len(habits) * 7
    summaries = [serialize_habit(habit) for habit in habits]
    top = max(summaries, key=lambda item: item.current_streak)
    return WeeklySummary(
        total_habits=len(habits),
        total_checkins=total_checkins,
        weekly_completion_rate=round(total_checkins / possible * 100),
        highlights=[
            f"{top.name} has your strongest active streak at {top.current_streak} days.",
            f"You completed {total_checkins} habit check-ins over the last 7 days.",
        ],
    )
