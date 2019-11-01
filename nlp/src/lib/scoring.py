import scipy.spatial
from pymongo import MongoClient
from lib.encoding import sentence_embeddings

client = MongoClient()
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

def compute_scores(parent_hpoid, search, threshold):
    scores = []
    search_embedding = sentence_embeddings(search).tolist()
    gen = phenotypes.find({'parents': parent_hpoid}) if parent_hpoid else phenotypes.find()
    for phenotype in phenotypes.find():
        if not phenotype['embeddings']:
            continue
        distances = list(map(lambda x: embeddings_distance(search_embedding, x), phenotype['embeddings']))
        distance = sum(distances)/len(distances)
        score = 1/distance

        if score > threshold:
            scores.append((score, phenotype['HPOId']))
    
    return scores