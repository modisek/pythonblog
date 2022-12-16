from pydantic import BaseModel


class TokenData(BaseModel):
    email: str


class User(BaseModel):
    email: str
    full_name: str
    disabled: bool


class UserInDB(User):
    hashed_password: str


class UserAuthenticate(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
