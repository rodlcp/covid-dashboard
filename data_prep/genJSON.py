import pandas as pd
import json
import urllib.request
import datetime
import os
from datetime import timedelta

path = "data_prep"

urllib.request.urlretrieve("https://covid19.who.int/WHO-COVID-19-global-data.csv", os.path.join(path, 'data.csv'))

data = pd.read_csv(os.path.join(path, 'data.csv'))
countries = pd.read_csv(os.path.join(path, 'countries.csv'))[['cca2', 'cca3', 'pop2022']]

grouped_data = data.groupby(['Country_code', 'Country', 'WHO_region']).aggregate({
    'New_cases': list, 
    'New_deaths': list
}).reset_index()

final_data = pd.merge(grouped_data, countries, left_on='Country_code', right_on='cca2', how = 'inner').drop(columns=['Country_code', 'cca2'])

final_data.rename(columns = {
    'cca3': 'country_code',
    'Country': 'name',
    'pop2022': 'population',
    'New_cases': 'cases',
    'New_deaths': 'deaths',
    'WHO_region': 'group'
}, inplace = True)

mainCountries = pd.DataFrame(["BRA", "CHN", "FRA", "DEU", "IND", "IRN", "ITA", "KOR", "ESP", "GBR", "USA"], columns=['country_code'])
aux = pd.merge(final_data, mainCountries)
aux['group'] = 'Main Countries'

final_data = pd.concat([final_data, aux])
final_data['population'] = (final_data['population'] * 1000).astype(int)
final_data['country_code'] = final_data['country_code'].str.lower()

final_data.to_json(os.path.join(path, '..', 'data.js'), orient='records')

with open(os.path.join(path, '..', 'data.js'), 'r') as f:
    data = "data = " +  f.readline()

with open(os.path.join(path, '..', 'data.js'), 'w') as f:
    f.write(data)