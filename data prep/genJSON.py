#!/usr/bin/python3
import pandas as pd
import json
import urllib.request
import datetime
from datetime import timedelta

now = datetime.datetime.now()

try:
    urllib.request.urlretrieve("https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-{}-{}-{}.xlsx".format(str(now.year).zfill(4), str(now.month).zfill(2), str((now + timedelta(days=1)).day).zfill(2)), "/home/rodrigo/homepage/covid/data_prep/ecdc_data.xslx")
except:
    try:
        urllib.request.urlretrieve("https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-{}-{}-{}.xlsx".format(str(now.year).zfill(4), str(now.month).zfill(2), str(now.day).zfill(2)), "/home/rodrigo/homepage/covid/data_prep/ecdc_data.xslx")
    except:
        urllib.request.urlretrieve("https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-{}-{}-{}.xlsx".format(str(now.year).zfill(4), str(now.month).zfill(2), str((now - timedelta(days=1)).day).zfill(2)), "/home/rodrigo/homepage/covid/data_prep/ecdc_data.xslx")

data = pd.read_excel('/home/rodrigo/homepage/covid/data_prep/ecdc_data.xslx')
data = pd.DataFrame(data.values[:, [0, 4, 5, 6]], columns=['date', 'cases', 'deaths', 'country'])
data = data.sort_values('date').reset_index(drop=True)
data["country"] = data["country"].str.replace("_", " ")

countries = pd.read_csv('/home/rodrigo/homepage/covid/data_prep/countries.csv', delimiter=';')

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

with open('/home/rodrigo/homepage/covid/data.js', 'w') as f:
    json.dump(output, f)

with open('/home/rodrigo/homepage/covid/data.js', 'r') as f:
    data = "data = " +  f.readline()

with open('/home/rodrigo/homepage/covid/data.js', 'w') as f:
    f.write(data)