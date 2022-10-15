# movies-explorer-api

**Backend Сервиса, в котором можно найти фильмы по запросу и сохранить в личном кабинете.**

> Публичный IP: 130.193.53.29  
> Домен: https://api.koltsov.nomoredomains.icu/  

## Роуты  

GET `/users/me` —  возвращает информацию о пользователе (email и имя)  

PATCH `/users/me` — обновляет информацию о пользователе (email и имя)  

GET `/movies` — возвращает все сохранённые текущим  пользователем фильмы  

POST `/movies` — создаёт фильм с переданными в теле (*country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId*)  

DELETE `/movies/_id` — удаляет сохранённый фильм по id
## Запуск проекта  

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
