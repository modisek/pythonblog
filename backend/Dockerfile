FROM python:3-slim-buster AS builder
RUN apt-get update &&\
    apt-get install -y libpq-dev gcc
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY . /code
FROM python:3-slim-buster
RUN apt-get update && \
    apt-get install -y libpq-dev &&\
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /opt/venv /opt/venv

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=8080"]