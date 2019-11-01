import np
import nltk
import scipy.spatial
from bert_serving.client import BertClient
from string import punctuation
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from autocorrect import Speller

LANGUAGE = 'english'
LANGUAGE_CODE = 'en'
spell = Speller(lang=LANGUAGE_CODE)
bc = BertClient()
stopword = stopwords.words(LANGUAGE)

def strip_punctuation(text):
    return ''.join(c for c in text if c not in punctuation)

def remove_stop_words(text):
    word_tokens = nltk.word_tokenize(text)
    return ' '.join([word for word in word_tokens if word not in stopword])

def lemmatize(text):
    wordnet_lemmatizer = WordNetLemmatizer()
    word_tokens = nltk.word_tokenize(text)
    lemmatized_word = [wordnet_lemmatizer.lemmatize(word) for word in word_tokens]
    return ' '.join(lemmatized_word)

def stem(text):
    snowball_stemmer = SnowballStemmer(LANGUAGE)
    word_tokens = nltk.word_tokenize(text)
    stemmed_word = [snowball_stemmer.stem(word) for word in word_tokens]
    return ' '.join(stemmed_word)

def spellcheck(text):
    return ' '.join([spell(w) for w in (nltk.word_tokenize(text))])

def clean_text(text):
    return spellcheck(stem(lemmatize(remove_stop_words(strip_punctuation(text.lower())))))


def sentence_embeddings(text):
    if not text:
        return np.array([])
    return bc.encode(
        list(filter(None, list(map(
            lambda x: clean_text(x),
            text.split('.')
        ))))
    )
    
def distance(sentence1, sentence2):
    sentence_embeddings_1 = sentence_embeddings(sentence1)
    sentence_embeddings_2 = sentence_embeddings(sentence2)
    distances = []
    for s1 in sentence_embeddings_1:
        for s2 in sentence_embeddings_2:
            distances.append(scipy.spatial.distance.cosine(s1, s2))
                
    return np.mean(distances)
