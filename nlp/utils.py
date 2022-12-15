import spacy
nlp = spacy.load('en_core_web_sm')


def tokenizer(doc):
    return [t.lemma_ for t in nlp(doc) if not t.is_space and not t.is_punct and t.is_alpha]
