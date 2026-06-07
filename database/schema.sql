CREATE table github_profiles(
id INT auto_increment primary KEY,
username VARCHAR(255) unique,
name VARCHAR(255),
bio TEXT,
public_repos INT,
followers INT,
following INT,
company varchar(255),
location varchar(255),
blog varchar(255),
account_age_years varchar(255),
popularity_score DECIMAL(10,2),
analyzed_at timestamp default current_timestamp
);