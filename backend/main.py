from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import crud, models, schemas, database
from fastapi.middleware.cors import CORSMiddleware
from auth import schemas as authSchema, utils
from fastapi.security import OAuth2PasswordRequestForm

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
ACCESS_TOKEN_EXPIRE_MINUTES = 15
origins = ["http://localhost",
           "http://localhost:8000", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/posts/{post_id}", response_model=schemas.Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post_by_id(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post


@app.post("/users/{user_id}/posts/", response_model=schemas.Post, dependencies=[Depends(utils.JWTBearer())])
def create_post_for_user(
    user_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)
):
    return crud.create_user_post(db=db, post=post, user_id=user_id)


@app.get("/users/{user_id}/posts/", response_model=schemas.Post)
def get_post_for_user(
    user_id: int, db: Session = Depends(get_db)
):
    posts = crud.get_post_of_user(db, user_id)
    return posts


@app.get("/posts/", response_model=list[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts


@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = crud.delete_post(db, post_id)
    return post


@app.post("/token", response_model=authSchema.Token, tags=["users"])
def authenticate_user(user: authSchema.UserAuthenticate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user is None:
        raise HTTPException(
            status_code=403, detail="Username or password is incorrect")
    else:
        is_password_correct = utils.check_username_password(db, user)

        if is_password_correct is False:
            raise HTTPException(
                status_code=403, detail="Username or password is incorrect")
        else:
            from datetime import timedelta
            access_token_expires = timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = utils.encode_jwt_token(
                data={"sub": user.email}, expires_delta=access_token_expires)
            return {"access_token": access_token, "token_type": "Bearer"}


@app.get("/protected", dependencies=[Depends(utils.JWTBearer())])
def get_route():
    return {"msg": "protected route"}


@app.get("/users/me/", response_model=schemas.User)
def get_me(curUser: schemas.User = Depends(utils.get_current_user)):
    return curUser


@app.post('/login', summary="Create access and refresh tokens for user")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(
        db, email=form_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    hashed_pass = user.hashed_password
    if not utils.verify_password(form_data.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "access_token": utils.create_access_token(user.email),
        "refresh_token": utils.create_refresh_token(user.email),
    }

# @app.patch()
