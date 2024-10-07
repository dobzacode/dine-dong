# FROM python:3.12.4-slim-bullseye as base

# ENV PYTHONUNBUFFERED 1
# WORKDIR /build

# FROM base as poetry
# RUN pip install poetry==1.8.2
# COPY poetry.lock pyproject.toml ./
# RUN poetry export -o /requirements.txt --without-hashes

# FROM base as common
# COPY --from=poetry /requirements.txt .

# RUN python -m venv /venv
# ENV PATH="/venv/bin:$PATH"
# RUN pip install -r requirements.txt

# RUN pip install uvicorn[standard]

# # Copy the rest of app
# COPY app app
# COPY alembic alembic
# COPY alembic.ini .
# COPY pyproject.toml .
# COPY init.sh .

# RUN addgroup --gid 1001 --system uvicorn && \
#     adduser --gid 1001 --shell /bin/false --disabled-password --uid 1001 uvicorn

# RUN chown -R uvicorn:uvicorn /build
# CMD bash init.sh && \
#     runuser -u uvicorn -- /venv/bin/uvicorn app.main:app --app-dir /build --host 0.0.0.0 --port 8000 --workers 2 --loop uvloop
# EXPOSE 8000

FROM public.ecr.aws/sam/build-python3.10

RUN pip install poetry==1.8.3