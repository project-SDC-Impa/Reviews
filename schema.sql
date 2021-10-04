-- \c sdc

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS characteristic_reviews;

CREATE TABLE reviews (
"id" SERIAL PRIMARY KEY,
"product_id" INTEGER,
"rating" INTEGER,
"date" BIGINT NULL,
"summary" VARCHAR,
"body" VARCHAR,
"recommend" BOOLEAN,
"reported" BOOLEAN,
"reviewer_name" VARCHAR,
"reviewer_email" VARCHAR,
"response" VARCHAR,
"helpfulness" INTEGER NULL
);

CREATE TABLE photos (
"id" SERIAL PRIMARY KEY,
"review_id" INTEGER,
"url" VARCHAR
);

CREATE TABLE characteristics (
"id" SERIAL PRIMARY KEY,
"product_id" INTEGER,
"name" VARCHAR
);

CREATE TABLE characteristic_reviews (
"id" SERIAL PRIMARY KEY,
"review_id" INTEGER,
"characteristic_id" INTEGER,
"value" INTEGER
);

-- DROP TABLE IF EXISTS products;
-- CREATE TABLE products (
-- "id" SERIAL PRIMARY KEY,
-- "name" VARCHAR,
-- "slogan" VARCHAR,
-- "description" VARCHAR,
-- "category" VARCHAR,
-- "default_price" INTEGER
-- );

ALTER TABLE photos ADD CONSTRAINT photos_review_id_fkey FOREIGN KEY (review_id) references reviews(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_characterstic_id_fkey FOREIGN KEY (characterstic_id) REFERENCES characteristics(id);


COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/stormihashimoto/Desktop/data/reviews.csv' DELIMITER ',' CSV HEADER;

COPY photos(id, review_id, url) FROM '/Users/stormihashimoto/Desktop/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

COPY characteristics(id, product_id, name) FROM '/Users/stormihashimoto/Desktop/data/characteristics.csv' DELIMITER ',' CSV HEADER;

COPY characteristic_reviews(id, review_id, characteristic_id, value) FROM '/Users/stormihashimoto/Desktop/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX idx_review_id ON reviews USING btree (product_id);
CREATE INDEX idx_characteristics_id ON characteristics USING btree (product_id);
CREATE INDEX idx_characteristic_reviews_id ON characteristic_reviews USING btree (review_id);
CREATE INDEX idx_reviews_photos_id ON photos USING btree (review_id);