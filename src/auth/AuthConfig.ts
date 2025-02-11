// src/auth/AuthConfig.ts
import base64 from 'base-64';

export const BASE_URL = 'https://api.skolengo.com/api/v1/bff-sko-app';

// Décodage des valeurs encodées en base64
export const OID_CLIENT_ID = base64.decode('U2tvQXBwLlByb2QuMGQzNDkyMTctOWE0ZS00MWVjLTlhZjktZGY5ZTY5ZTA5NDk0');
export const OID_CLIENT_SECRET = base64.decode('N2NiNGQ5YTgtMjU4MC00MDQxLTlhZTgtZDU4MDM4NjkxODNm');
export const REDIRECT_URI = 'skoapp-prod://sign-in-callback';

/**
 * Objet de configuration inspiré de scolengo-api.
 * Il regroupe les informations d’authentification (tokenSet)
 * et celles spécifiques à l’établissement (school).
 */
export const mySkolengoConfig = {
  tokenSet: {
    access_token: '<access_token_here>',
    id_token: '<id_token_here>',
    refresh_token: 'RT-<refresh_token_here>',
    token_type: 'bearer',
    expires_at: 1234567890,
    scope: 'openid',
  },
  school: {
    id: 'SKO-E-<school_id>',
    name: '<school_name>',
    addressLine1: '<school_address>',
    addressLine2: null,
    addressLine3: null,
    zipCode: '<school_zip_code>',
    city: '<school_city>',
    country: 'France',
    homePageUrl: '<cas_login_url>',
    emsCode: '<school_ems_code>',
    emsOIDCWellKnownUrl: '<school_ems_oidc_well_known_url>',
  },
};