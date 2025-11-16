/*

import { executeQuery } from "../utils/snowflakeConnector.js"; 

// --- Functions needed for VersionTimeline (Reading History) ---

export async function fetchVersions(ideaId) {
    // This is the GET /ideas/:id/versions logic (retrieving the full history)
    const versions = await executeQuery(
        `SELECT VERSION_NUMBER, TEXT, CREATED_AT 
         FROM IDEA_VERSIONS 
         WHERE IDEA_ID = ?
         ORDER BY VERSION_NUMBER DESC`,
        [ideaId]
    );

    // Map Snowflake's uppercase results to clean camelCase for the frontend
    return versions.map(v => ({
        version_number: v.VERSION_NUMBER,
        text: v.TEXT,
        created_at: v.CREATED_AT
    }));
}


// --- Core Utility Export ---

// Export the executeQuery function so ideaRoutes.js can use it for POST /version
export { executeQuery };


// --- Functions for Analytics and Drift (From your snowflakeAnalytics.js) ---

// Renamed from getIdeaTimeline for clarity
export async function getIdeaTimelineAnalytics(ideaId) { 
    return await executeQuery(
        `SELECT * FROM IDEA_ANALYTICS 
         WHERE idea_id = ?
         ORDER BY version_number`,
        [ideaId]
    );
}

// Renamed from getIdeaSemanticDrift
export async function getIdeaSemanticDrift(ideaId) {
    return await executeQuery(
        `SELECT version_number,
                VECTOR_DISTANCE(embedding, 
                    (SELECT embedding FROM IDEA_EMBEDDINGS 
                     WHERE idea_id = ? AND version_number = 1)
                ) AS drift
         FROM IDEA_EMBEDDINGS
         WHERE idea_id = ?
         ORDER BY version_number`,
        [ideaId, ideaId]
    );
}

// Renamed from getIdeaClosestVersions
export async function getIdeaClosestVersions(ideaId, version) {
    return executeQuery(
        `SELECT version_number,
                VECTOR_DISTANCE(embedding,
                    (SELECT embedding FROM IDEA_EMBEDDINGS 
                     WHERE idea_id = ? AND version_number = ?)
                ) AS distance
         FROM IDEA_EMBEDDINGS
         WHERE idea_id = ?
           AND version_number != ?
         ORDER BY distance ASC
         LIMIT 3`,
        [ideaId, version, ideaId, version]
    );
}

*/