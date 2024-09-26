import aiofiles, json, os, detect, aiomysql, asyncssh, asyncio, uvicorn, pymysql
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from loguru import logger
from starlette.responses import JSONResponse

from apiUtils.Hasher import HasherClass
from pathlib import Path
from apiUtils.other import *

if not os.path.exists(os.path.join(".", "Content")):
    os.mkdir(os.path.join('.', 'Content'))
    os.mkdir(os.path.join('.', 'Content', 'Predict_Images'))

app = FastAPI()

app.mount("/static/", StaticFiles(directory="Content"), name="static")
logger.add('debug.log', format="{time} {message}", level="DEBUG", rotation="2 MB", compression="zip")
HasherObject = HasherClass()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_conn = pymysql.connect(
    host='185.185.70.161',
    port=3306,
    user='API_connection',
    password='Ay2t6PYDd!9',
    db='waterdroplet_model',
    cursorclass=pymysql.cursors.DictCursor
)


@app.on_event('shutdown')
async def shutdown_event():
    try:
        await cursor.close()
    except:
        ...
    finally:
        users_conn.close()


@app.post('/all_values')
async def get_all_values(upload_image: UploadFile, token: str = Form()):
    """
    :param: upload_image: File of photo that contains ipu and QR code on it
    :param: token: string of apitoken that is given to business for api requests

    Endpoint checks apitoken value with value in db, uses Neural Vision to operate with photo and returns all values
    that are given by it. Creates log in debug.log file and saves photo in Content/Predict_images folder.

    :return: array of parsed values from photo
    """
    all_values = {}
    cursor = users_conn.cursor()
    cursor.execute('SELECT * FROM business WHERE apitoken = %s', (token,))
    try:
        (cursor.fetchall())[0]
        hashedFileName = HasherObject.CreateImageFileNameHash(upload_image.filename)
        async with aiofiles.open((Path() / "Content" / "Predict_Images" / hashedFileName).absolute(),
                                 'wb') as image_file:
            await image_file.write(await upload_image.read())
        prediction = detect.prediction('v2.pt', 'data.yaml',
                                       (Path() / "Content" / "Predict_Images" / hashedFileName).absolute())
        try:
            prediction = check_area(prediction)
            for ID in range(len(prediction)):
                all_values[ID] = prediction.iloc[ID].to_dict()
            message = dict_to_message(all_values)
            logger.info(message)
            cursor.close()
            return JSONResponse(all_values)

        except TypeError:
            cursor.close()
            return JSONResponse({})

    except IndexError:
        cursor.close()
        raise HTTPException(status_code=401, detail='Bad APIToken')


@app.post('/get_number')
async def get_number(upload_image: UploadFile, token: str = Form()):
    """
        :param: upload_image: File of photo that contains ipu and QR code on it
        :param: token: string of apitoken that is given to business for api requests

        Endpoint checks apitoken value with value in db, uses Neural Vision to operate with photo and returns only
        value from ipu. Creates log in debug.log file and saves photo in Content/Predict_images folder.

        :return: number: string
    """
    all_values = {}
    cursor = users_conn.cursor()
    cursor.execute('SELECT * FROM business WHERE apitoken = %s', (token,))
    try:
        (cursor.fetchall())[0]
        hashedFileName = HasherObject.CreateImageFileNameHash(upload_image.filename)
        number = ''
        async with aiofiles.open((Path() / "Content" / "Predict_Images" / hashedFileName).absolute(),
                                 'wb') as image_file:
            await image_file.write(await upload_image.read())
        prediction = detect.prediction('v2.pt', 'data.yaml',
                                       (Path() / "Content" / "Predict_Images" / hashedFileName).absolute())
        prediction = check_area(prediction)
        try:
            for ID in range(len(prediction)):
                all_values[ID] = prediction.iloc[ID].to_dict()
            message = dict_to_message(all_values)
            logger.info(message)
            for i in range(len(prediction) - 1):
                number += prediction.at[i, 'value']
            if token == 'apitokentest':
                num_amount = len(number)
                while num_amount < 8:
                    number += '0'
                    num_amount += 1
                cursor.close()
                return JSONResponse({'number': number[0:7]})
            cursor.close()
            return JSONResponse({'number': number})
        except TypeError:
            cursor.close()
            return JSONResponse({'number': ''})

    except IndexError:
        cursor.close()
        raise HTTPException(status_code=401, detail='Bad APIToken')


@app.post('/get_coordinates')
async def get_coordinates(upload_image: UploadFile, token: str = Form()):
    """
        :param: upload_image: File of photo that contains ipu and QR code on it
        :param: token: string of apitoken that is given to business for api requests

        Endpoint checks apitoken value with value in db, uses Neural Vision to operate with photo and returns all
        coordinates related to values (to analyse NV work). Creates log in debug.log file and saves photo in
        Content/Predict_images folder.

        :return: array of coordinates
    """
    all_values = {}
    cursor = users_conn.cursor()
    cursor.execute('SELECT * FROM business WHERE apitoken = %s', (token,))
    try:
        (cursor.fetchall())[0]
        hashedFileName = HasherObject.CreateImageFileNameHash(upload_image.filename)
        async with aiofiles.open((Path() / "Content" / "Predict_Images" / hashedFileName).absolute(),
                                 'wb') as image_file:
            await image_file.write(await upload_image.read())
        prediction = detect.prediction('v2.pt', 'data.yaml',
                                       (Path() / "Content" / "Predict_Images" / hashedFileName).absolute())
        prediction = check_area(prediction)
        try:
            for ID in range(len(prediction)):
                all_values[ID] = prediction.iloc[ID].to_dict()
            message = dict_to_message(all_values)
            logger.info(message)

            prediction = prediction.drop('coef', axis=1)
            result = prediction.to_dict(orient='index')
            cursor.close()
            return result
        except TypeError:
            cursor.close()
            return JSONResponse({})
    except IndexError:
        cursor.close()
        raise HTTPException(status_code=401, detail='Bad APIToken')


# --------------------------------------------------------------------------

if __name__ == '__main__':
    uvicorn.run("main:app",
                host="45.91.8.156",
                port=5500,
                reload=True
                )
