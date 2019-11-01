from pymongo import MongoClient
from lib.encoding import sentence_embeddings

print('Initializing mongo connection ...')

client = MongoClient()
db = client.kibo
phenotypes = db.phenotypes

for phenotype in phenotypes.find():
    HPOId = phenotype['HPOId']
    name = phenotype['name']
    description = phenotype['description']
    print(f'encoding phenotype {HPOId}')
    embeddings = sentence_embeddings(name).tolist() + sentence_embeddings(description).tolist()
    phenotypes.update_one({
        'HPOId': HPOId
    }, {
        '$set': {
            'embeddings': embeddings
        }
    })
