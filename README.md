[![Frontend CI](https://github.com/Maksa9905/avito/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Maksa9905/avito/actions/workflows/frontend-ci.yml)

## Запуск через Docker (рекомендуется)

Нужны **Docker** и **Docker Compose** (v2). Файл **`docker-compose.yml`** в корне репозитория поднимает всё приложение.

**Сервисы:**

| Сервис в Compose | Контейнер | Назначение |
|------------------|-----------|------------|
| `backend` | `backend` | API на порту **8080** (сборка из `avito.backend`). |
| `frontend` | `frontend` | Vite/React на порту **3000** (сборка из `avito.trainee`). |
| `ai-asistent` | `ai-asistent` | Ollama, порт **11434**, том **`ollama-data`** — модели сохраняются между перезапусками. |
| `ollama-pull-models` | `ollama-pull-models` | Одноразовый контейнер: ждёт готовности Ollama и выполняет `ollama pull` (после успеха завершается, `restart: no`). |

Фронтенду в Compose передаются **`VITE_API_URL=http://localhost:8080`** и **`VITE_OLLAMA_HOST=http://localhost:11434`**: браузер на вашей машине обращается к API и к Ollama по `localhost`, проброшенным из контейнеров.

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

При первом запуске контейнер **`ollama-pull-models`** скачивает модель **`deepseek-r1:8b`** (может занять время и несколько гигабайт на диске). Прогресс: `docker compose logs -f ollama-pull-models`. Пока модель не скачана, запросы к ИИ из приложения могут отвечать ошибкой «model not found» — на фронте отображается ошибка.

Повторно подтянуть модель вручную:

```bash
docker exec ai-asistent ollama pull deepseek-r1:8b
```

Остановить всё: `docker compose down` (том с моделями по умолчанию сохраняется).

Рекомендую поднять ресурсы, потребляемые Docker Engine — для корректной работы модели требуется выделить **>5.1 GB ОЗУ**.

## Запуск без Docker (локальная разработка)

1. **Бэкенд** (`avito.backend`): `npm ci` → `npm start` (порт **8080**).
2. **Фронтенд** (`avito.trainee`): `npm install` → `npm run dev` (порт **3000**). API по умолчанию: `http://localhost:8080`.
3. **Ollama** установить локально или поднять отдельно; при необходимости задать `VITE_OLLAMA_HOST` в `.env` фронтенда (см. `OllamaController`).
