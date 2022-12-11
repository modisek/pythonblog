from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas

salt = bcrypt.gensalt()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_post_by_id(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

    


def create_user(db: Session, user: schemas.UserCreate):
    passw = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    db_user = models.User(email=user.email, hashed_password=passw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post).offset(skip).limit(limit).all()


def create_user_post(db: Session, post: schemas.PostCreate, user_id: int):
    db_post = models.Post(**post.dict(), owner_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id:int):
    db_delete = db.query(models.Post).filter(models.Post.id == post_id).delete()
    db.commit()
    return db_delete

def update_post(db: Session, post: schemas.PostCreate, post_id: int):
    db_post = models.Post(**post.dict(), owner_id=post_id)
    db.query(models.Post).filter(models.Post.id == post_id).update(db_post)
    db.commit()
    return db_post
    
