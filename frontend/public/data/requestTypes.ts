export const REQUESTS = [
  {
    id: 1,
    heading: {
      title: 'get_number',
      main: 'получение только показаний счетчика',
    },
    request: `curl -X 'POST' \n
'http://waterdroplet.ru/get_number' \n
-H 'accept: application/json' \n
-H 'Content-Type: multipart/form-data' \n
-F 'upload_image=@image.jpg;type=image/jpeg' \n
-F 'token=access_token'`,
    response: `Response code: 200 
Response body: 
{
"number": "062521"
}`,
  },
  {
    id: 2,
    heading: {
      title: 'all_values',
      main: 'получение всех значений, включая координаты и точность определения значения',
    },
    request: `curl -X 'POST' \n
'http://waterdroplet.ru/all_values' \n
-H 'accept: application/json' \n
-H 'Content-Type: multipart/form-data' \n
-F 'upload_image=@image.jpg;type=image/jpeg' \n
-F 'token=access_token'`,
    response: `Response code: 200
Response body:
{
"0": {
"value": "0",
"x": 0.34354305267333984,
"y": 0.4986737370491028,
"w": 0.04470198601484299,
"h": 0.08488063514232635,
"coef": 0.743715226650238
},
"1": {
        …
      },
  …
}`,
    footer: [
      'value - цифра показания',
      'x - координата x левого нижнего угла бокса, содержащего value',
      'указанная в долях размера фотографии',
      'y - координата y левого нижнего угла бокса, содержащего value, указанная в долях размера фотографии',
      'w - ширина бокса, содержащего value, указанная в долях размера фотографии',
      'h - высота бокса, содержащего value, указанная в долях размера фотографии',
      'coef - точность определения значения в боксе',
    ],
  },
  {
    id: 3,
    heading: {
      title: 'get_coordinates',
      main: 'получение координат каждой цифры',
    },
    request: `curl -X 'POST' \n
'http://waterdroplet.ru/get_coordinates' \n
-H 'accept: application/json' \n
-H 'Content-Type: multipart/form-data' \n
-F 'upload_image=@image.jpg;type=image/jpeg' \n
-F 'token=access_token’`,
    response: `Response code: 200
Response body:
{
"0": {
"value": "0",
"x": 0.34354305267333984,
"y": 0.4986737370491028,
"w": 0.04470198601484299,
"h": 0.08488063514232635
 },
 "1": {
         …
         },
      …
 }`,
    footer: [
      'value - цифра показания',
      'x - координата x левого нижнего угла бокса, содержащего value, указанная в долях размера фотографии',
      'y - координата y левого нижнего угла бокса, содержащего value, указанная в долях размера фотографии',
      'w - ширина бокса, содержащего value, указанная в долях размера фотографии',
      'h - высота бокса, содержащего value, указанная в долях размера фотографии',
    ],
  },
];
export const ERRORS = [
  { id: 1, code: '401', desc: 'указан неверный секретный ключ (token)' },
  { id: 2, code: '500', desc: 'Ошибка сервера' },
];
