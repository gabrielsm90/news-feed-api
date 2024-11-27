FROM python:3.12-slim

ENV PYTHONPATH=/app

WORKDIR /app

COPY poetry.lock pyproject.toml /app/

RUN pip install poetry

RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-root

COPY . /app

CMD ["python", "./src/main.py"]
