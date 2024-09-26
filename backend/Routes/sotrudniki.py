from Database import Databases
from Database.Databases import NotFoundError, BadUserError, BadUsernameError
from Utils.Hasher import HasherClass
from jose.exceptions import ExpiredSignatureError
from Models.Models import *
from fastapi import HTTPException, APIRouter
from starlette.responses import JSONResponse
from Routes.Authorization import unpack_token, BadTokenError

router = APIRouter()
Hasher = HasherClass()
SQLDatabase = Databases.SQLDatabase()

"""
This file contains all endpoints related to workers logic such creating theirs account, getting info etc.
"""


# -----------------ROUTES--------------------

@router.post('/workers/get_all_workers', tags=['workers'])
async def get_all_workers(token: Token):
    """
    :param token: access_token: string

    checks user's token and returns list of its workers if user type is business

    :return: list of workers if successful, else HTTP error
    """
    try:
        username, user_type = unpack_token(token.access_token)
        if user_type == "business":
            info = await SQLDatabase.get_all_workers(username)
            return JSONResponse({'workers': info})
        else:
            raise HTTPException(status_code=412, detail="bad user_type")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='token expired')
    except BadTokenError:
        raise HTTPException(status_code=401, detail='bad token')


@router.post('/workers/worker_info/{worker_id}', tags=['workers'])
async def get_worker_info(token: Token, worker_id: int):
    """
    :param token: access_token: string
    :param worker_id: int

    checks user's token and returns information about definite worker defined by its id if he is related to
    this business.

    :return: information about definite worker if successful, else HTTP error
    """
    try:
        username, user_type = unpack_token(token.access_token)
        if user_type == "business":
            info = await SQLDatabase.get_worker_info(username, worker_id)
            return JSONResponse({'worker': info})
        else:
            raise HTTPException(status_code=412, detail="bad user_type")
    except NotFoundError:
        raise HTTPException(status_code=404, detail='worker not found or not related to this business')
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='token expired')
    except BadTokenError:
        raise HTTPException(status_code=401, detail='bad token')


@router.delete('/workers/delete_worker/{worker_id}', tags=['workers'])
async def delete_worker(token: Token, worker_id: int):
    """

    :param token: access_token: string
    :param worker_id: int

    Deletes definite worker by its id if it's related to this business.

    :return: HTTP status OK if successful else HTTP error
    """
    try:
        username, user_type = unpack_token(token.access_token)
        if user_type == "business":
            await SQLDatabase.delete_worker(username, worker_id)
            return HTTPException(status_code=200)
        else:
            raise HTTPException(status_code=412, detail="bad user_type")
    except NotFoundError:
        raise HTTPException(status_code=404, detail='worker not found')
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='token expired')
    except BadTokenError:
        raise HTTPException(status_code=401, detail='bad token')


@router.post('/workers/create_worker', tags=['workers'])
async def create_worker(token: Token, worker: Worker):
    """

    :param token: access_token: string
    :param worker:
                login: string
                full_name: worker's full name
                phone: string
                password: string

    Creates worker related to business defined by its token.


    :return: HTTP status OK if successful else HTTP error
    """
    try:
        username, user_type = unpack_token(token.access_token)
        if user_type == "business":
            await SQLDatabase.create_worker(username, worker.full_name, worker.login, worker.phone, worker.password)
            return HTTPException(status_code=200)
        else:
            raise HTTPException(status_code=412, detail="bad user_type")
    except NotFoundError:
        raise HTTPException(status_code=404, detail='business not found')
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='token expired')
    except BadTokenError:
        raise HTTPException(status_code=401, detail='bad token')
    except BadUsernameError:
        raise HTTPException(status_code=402, detail="username occupied")


@router.put('/workers/edit_worker/{worker_id}', tags=['workers'])
async def edit_worker(token: Token, worker_id: int, login: str, phone: str, password: str, full_name: str):
    """
        :param worker_id: int
        :param login: string
        :param phone: worker's phone number
        :param password: string
        :param full_name: worker's name
        :param token: access_token: string


        edits all worker's information if it's related to business defined by given token

        :return: HTTP status OK if successful else HTTP error
        """
    try:
        username, user_type = unpack_token(token.access_token)
        if login == 'admin':
            raise HTTPException(status_code=402, detail='username can not be "admin"')
        if user_type == "business":
            await SQLDatabase.edit_worker(username, worker_id, login, phone, password, full_name)
            return HTTPException(status_code=200, detail="success")
        else:
            raise HTTPException(status_code=412, detail="bad user_type")
    except NotFoundError:
        raise HTTPException(status_code=404, detail='worker not found')
    except ExpiredSignatureError:
        raise HTTPException(status_code=400, detail='token expired')
    except BadTokenError:
        raise HTTPException(status_code=400, detail='bad token')
    except BadUsernameError:
        raise HTTPException(status_code=402, detail="username occupied")