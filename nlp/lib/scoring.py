import os
import scipy.spatial
from pymongo import MongoClient
from lib.encoding import sentence_embeddings

client = MongoClient(os.getenv('DB_HOST', 'localhost'))
db = client.kibo
phenotypes = db.phenotypes

def embeddings_distance(emb1, emb2):
    return scipy.spatial.distance.cosine(emb1, emb2)

def sentences_distance(sentence1, sentence2):
    sentence_embeddings_1 = sentence_embeddings(sentence1)
    sentence_embeddings_2 = sentence_embeddings(sentence2)
    distances = []
    for s1 in sentence_embeddings_1:
        for s2 in sentence_embeddings_2:
            distances.append(embeddings_distance(s1, s2))
                
    return np.mean(distances)

def normalize_scores(scores):
    min_value = min(scores)[0]
    max_value = max(scores)[0]
    return list(map(lambda x: (100 * (x[0] - min_value) / (max_value - min_value), x[1]), scores))

def compute_scores(parent_hpoid, search, threshold):
    scores = []
    search_embeddings = sentence_embeddings(search).tolist()
    gen = phenotypes.find({'parents': parent_hpoid}) if parent_hpoid else phenotypes.find()
    for phenotype in phenotypes.find():
        if not phenotype['embeddings']:
            continue
        distances = []
        for search_embedding in search_embeddings:
            distances += list(map(lambda x: embeddings_distance(search_embedding, x), phenotype['embeddings']))
        distance = min(distances)
        score = (1 - distance) * 100
        scores.append((score, phenotype['HPOId']))
    
    normalized_scores = normalize_scores(scores)
    filtered_scores = []
    for score in normalized_scores:
        if score[0] > threshold:
            filtered_scores.append(score)
    
    return filtered_scores