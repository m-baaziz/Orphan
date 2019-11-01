import os
import logging
from flask import Flask, request, abort, jsonify
from lib.scoring import compute_scores

logging.basicConfig(level=logging.NOTSET)
LOGGER = logging.getLogger(__name__)

app = Flask(__name__)

DEFAULT_THRESHOLD = 0

@app.errorhandler(400)
def invalid_request(e):
    return jsonify(error=str(e)), 400

@app.route('/scores', methods=['GET'])
def hello_world():
    try:
        threshold = float(request.args.get('threshold', DEFAULT_THRESHOLD))
    except Exception as e:
        abort(400, description="invalid threshold parameter")

    search = request.args.get('search')
    parent_hpoid = request.args.get('parentHPOId')

    if not search:
        abort(400, description="search parameter is missing in query string")

    scores = compute_scores(parent_hpoid, search, threshold)
    scores = sorted(scores, key=lambda x: -x[0])
    scores = list(map(lambda x: {'HPOId': x[1], 'score': x[0]}, scores))
    print('SCORES: ', scores)

    return jsonify({
        'scores': scores
    })

if __name__ == '__main__':
    app.run()