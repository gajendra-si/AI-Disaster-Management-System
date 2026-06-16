import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer

from sklearn.naive_bayes import MultinomialNB

import pickle


df = pd.read_csv(

"dataset.csv"

)


vectorizer = CountVectorizer()


X = vectorizer.fit_transform(

df["description"]

)


y = df["severity"]


model = MultinomialNB()


model.fit(X,y)


pickle.dump(

model,

open(

"model.pkl",

"wb"

)

)


pickle.dump(

vectorizer,

open(

"vectorizer.pkl",

"wb"

)

)


print(

"Model Saved Successfully"

)

print(

"Training Samples :",

len(df)

)