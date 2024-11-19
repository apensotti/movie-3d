CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    adult TEXT,
    belongs_to_collection TEXT,
    budget BIGINT,
    genres TEXT,
    homepage TEXT,
    imdb_id VARCHAR(255),
    original_language VARCHAR(255),
    original_title VARCHAR(255),
    overview TEXT,
    popularity DOUBLE,
    poster_path TEXT,
    production_companies TEXT,
    production_countries TEXT,
    release_date TEXT,
    revenue BIGINT,
    runtime DOUBLE,
    spoken_languages TEXT,
    status VARCHAR(255),
    tagline TEXT,
    title VARCHAR(255) NOT NULL,
    video TEXT,
    vote_average DOUBLE,
    vote_count BIGINT,
    cast TEXT,
    crew TEXT,
    keywords TEXT,
    processed_title TEXT
);

-- Load data from CSV file
LOAD DATA INFILE '/var/lib/mysql-files/movies.csv'
INTO TABLE movies
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(adult, belongs_to_collection, budget, genres, homepage, id, imdb_id, original_language, original_title, overview, popularity, poster_path, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, video, vote_average, vote_count, cast, crew, keywords, processed_title);