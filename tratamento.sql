-- primeiro é necessário importar os dados do xlsx para o banco de dados
-- o xlsx pode ser encontrado em 
-- https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide

CREATE TABLE data_covid19 AS
SELECT 
    concat(lpad(year, 4, '0'), lpad(month, 2, '0'), lpad(day, 2, '0')) date,
    replace(`Countriesandterritories`, '_', ' ') country_name,
    `CountryterritoryCode` country_code,
    `PopData2018` population,
    cases,
    deaths
FROM 
    `table 1`;

CREATE TABLE dates AS
SELECT
    date
FROM
    data_covid19
GROUP BY
    date;

ALTER TABLE `dates` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);

CREATE TABLE country_info AS
SELECT
    country_name,
    country_code,
    population,
    0 as first_case
FROM
    data_covid19
WHERE
    cases > 0
GROUP BY
    country_name,
    country_code,
    population;

ALTER TABLE `country_info` ADD PRIMARY KEY( `country_name`);
ALTER TABLE `country_info` CHANGE `population` `population` INT NULL DEFAULT NULL;

CREATE TABLE complete_data AS
SELECT
    t.date,
    t.country_name,
    IFNULL(s.cases, 0) cases,
    IFNULL(s.deaths, 0) deaths
FROM
(
    SELECT
        t.date,
        s.country_name
    FROM
        dates t
    CROSS JOIN
        country_info s
) t
LEFT JOIN
    data_covid19 s
ON
    t.date = s.date
    AND t.country_name = s.country_name;

ALTER TABLE `complete_data` ADD PRIMARY KEY( `date`, `country_name`);
ALTER TABLE `complete_data` CHANGE `date` `date` INT NULL DEFAULT NULL;

CREATE TABLE aggregated_data AS
SELECT 
    t.date,
    t.country_name,
    SUM(s.cases) cases,
    SUM(s.deaths) deaths
FROM
    complete_data t
INNER JOIN
    complete_data s
ON
    t.date >= s.date
    AND t.country_name = s.country_name
GROUP BY
    t.date,
    t.country_name;

ALTER TABLE `aggregated_data` ADD PRIMARY KEY(`date`, `country_name`);

CREATE TABLE first_case AS
SELECT
    t.country_name,
    s.id
FROM
(
    SELECT 
        country_name, 
        MIN(date) date
    FROM 
        aggregated_data
    WHERE
        cases > 0
    GROUP BY
        country_name
) t
INNER JOIN
    dates s
ON
    t.date = s.date;

UPDATE country_info, first_case SET country_info.first_case = first_case.id - 1 WHERE country_info.country_name = first_case.country_name;