FROM python:3.6.8

WORKDIR /nlp

COPY . .

RUN pip install .

RUN pip install tensorflow==1.15.0

RUN python ./setup.py
