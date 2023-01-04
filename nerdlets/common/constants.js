export const DEV = window.location.href.startsWith('https://dev-one.');
export const STAGING = window.location.href.startsWith('https://staging');
export const CROSS_ACCOUNT_CHUNK_SIZE = 5; // current limit to how many accounts NRQL can query within
export const CHUNK_SIZE = 25; //  entity guid search limitexport
export const ENTITY_MAX = 1000; // arbirtrary limit imposed to keep UI performant
