import pandas as pd
import json

data = pd.read_excel('covid.xlsx')
data = pd.DataFrame(data.values[:, [0, 4, 5, 6]], columns=['date', 'cases', 'deaths', 'country'])
data = data.sort_values('date').reset_index(drop=True)
data["country"] = data["country"].str.replace("_", " ")

countries = pd.read_csv('countries.csv', delimiter=';')

cases = pd.pivot_table(data, values="cases", index = 'country', columns = 'date', aggfunc=sum).fillna(0)
deaths = pd.pivot_table(data, values="deaths", index = 'country', columns = 'date', aggfunc=sum).fillna(0)

countries2 = data['country'].unique()
countries2.sort()

output = []

for (name, group, population) in countries.values:
    if name in countries2:
        output.append({
            "name": name,
            "population": population,
            "group": group,
            "cases": list(cases.loc[cases.index == name].values[0]),
            "deaths": list(deaths.loc[cases.index == name].values[0])
        })

with open('../data.js', 'w') as f:
    json.dump(output, f)

with open('../data.js', 'r') as f:
    data = "data = " +  f.readline()

with open('../data.js', 'w') as f:
    f.write(data)