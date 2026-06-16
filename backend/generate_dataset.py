import pandas as pd

rows=[]

high_fire = [
"building fire",
"house fire",
"gas explosion",
"factory fire",
"chemical explosion",
"major fire",
"warehouse fire",
"forest fire"
]

medium_fire = [
"small fire",
"minor smoke",
"kitchen fire",
"light smoke",
"electrical spark",
"short circuit fire"
]

high_flood = [
"heavy rain flood",
"river overflow",
"severe flood",
"flash flood",
"dam overflow",
"city flooded"
]

low_flood = [
"water logging",
"minor flood",
"small flooding",
"rain water accumulation"
]

for i in range(3000):

    rows.append([
        high_fire[i % len(high_fire)],
        "HIGH"
    ])


for i in range(2000):

    rows.append([
        medium_fire[i % len(medium_fire)],
        "MEDIUM"
    ])


for i in range(3000):

    rows.append([
        high_flood[i % len(high_flood)],
        "HIGH"
    ])


for i in range(2000):

    rows.append([
        low_flood[i % len(low_flood)],
        "LOW"
    ])


df = pd.DataFrame(

rows,

columns=[

"description",

"severity"

]

)

df.to_csv(

"dataset.csv",

index=False

)

print("CSV Created Successfully")

print("Total Rows :",len(df))