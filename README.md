[![Frontend CI](https://github.com/Maksa9905/avito/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Maksa9905/avito/actions/workflows/frontend-ci.yml)

## Запуск через Docker

Нужны **Docker** и **Docker Compose** (v2).

Из корня репозитория:

```bash
docker compose up --build
```

После старта:

| Сервис    | URL |
|-----------|-----|
| Фронтенд  | http://localhost:3000 |
| Бэкенд API | http://localhost:8080 |
| Ollama    | http://localhost:11434 |

При первом запуске контейнер **`ollama-pull-models`** скачивает модель **`deepseek-r1:8b`** (может занять время и несколько гигабайт памяти). Прогресс: `docker compose logs -f ollama-pull-models`. Пока модель не скачана, запросы к ИИ из приложения могут отвечать ошибкой «model not found» - на фронте отображаться ошибка.

Повторно подтянуть модель вручную:

```bash
docker exec ai-asistent ollama pull deepseek-r1:8b
```

## Локальная разработка без Docker

1. **Бэкенд** (`avito.backend`): `npm ci` → `npm start` (порт **8080**).
2. **Фронтенд** (`avito.trainee`): `npm install` → `npm run dev` (порт **3000**). API по умолчанию: `http://localhost:8080`.
3. **Ollama** установить локально или поднять отдельно; при необходимости задать `VITE_OLLAMA_HOST` в `.env` фронтенда (см. `OllamaController`).

Тесты фронтенда: в каталоге `avito.trainee` выполнить `npm run test:run`.
