import json
import mysql.connector

def transpose(m):
    return [[m[j][i] for j in range(len(m))] for i in range(len(m[0]))] 

cnx = mysql.connector.connect(user='root', password='',
                              host='127.0.0.1',
                              database='covid')

cursor = cnx.cursor()
cursor.execute("SELECT * FROM country_info")
countries = cursor.fetchall()

data = []
for i in countries:
    data.append({
        'name': i[0],
        'code': i[1],
        'population': i[2],
        'firstCase': i[3]
    })
    cursor.execute("SELECT cases, deaths FROM complete_data WHERE country_name = '{}' ORDER BY date".format(i[0]))
    aux = cursor.fetchall()
    aux = transpose(aux)
    data[-1]["cases"] = aux[0]
    data[-1]["deaths"] = aux[1]

with open('dashboard/data.js', 'w') as f:
    json.dump(data, f)

with open('dashboard/data.js', 'r') as f:
    data = "data = " +  f.readline()

with open('dashboard/data.js', 'w') as f:
    f.write(data)