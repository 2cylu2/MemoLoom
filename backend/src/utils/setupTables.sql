/*

-- Version history table
CREATE TABLE IF NOT EXISTS IDEA_VERSIONS (
    idea_id STRING,
    version_number INT,
    text STRING,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS IDEA_ANALYTICS (
    idea_id STRING,
    version_number INT,
    word_count INT,
    char_count INT,
    delta_words INT,
    delta_chars INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Embedding table
CREATE TABLE IF NOT EXISTS IDEA_EMBEDDINGS (
    idea_id STRING,
    version_number INT,
    embedding VECTOR(FLOAT, 1536)
);
*/