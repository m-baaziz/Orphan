#!/bin/bash

bert-serving-start -model_dir ./models/bert/uncased_L-12_H-768_A-12/ -num_worker=4 -max_seq_len=500 -graph_tmp_dir=./models/tmp &
python server.py
