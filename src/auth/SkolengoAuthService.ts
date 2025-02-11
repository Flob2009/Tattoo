// src/auth/SkolengoAuthService.ts
import * as AuthSession from 'expo-auth-session';
import { OID_CLIENT_ID, OID_CLIENT_SECRET, REDIRECT_URI } from './AuthConfig';

/**
 * Récupère le document de découverte pour OIDC (généralement .well-known/openid-configuration)
 * @param wellKnownUrl L’URL fournie par l’école, ex: https://xxx/.well-known/openid-configuration
 */
export async function fetchDiscoveryDocument(wellKnownUrl: string): Promise<AuthSession.DiscoveryDocument> {
  const discovery = await AuthSession.fetchDiscoveryAsync(wellKnownUrl);
  return discovery;
}

/**
 * Crée une URL d’authentification en utilisant Expo AuthSession
 */
export async function createAuthUrl(
  discoveryDoc: AuthSession.DiscoveryDocument
): Promise<string> {
  const authRequest = new AuthSession.AuthRequest({
    clientId: OID_CLIENT_ID,
    clientSecret: OID_CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'code',
  });

  const authUrl = await authRequest.makeAuthUrlAsync(discoveryDoc);
  return authUrl;
}

/**
 * Échange le code d’autorisation contre un token
 */
export async function exchangeCodeForToken(
  code: string,
  discoveryDoc: AuthSession.DiscoveryDocument
): Promise<AuthSession.TokenResponse> {
  return await AuthSession.exchangeCodeAsync(
    {
      clientId: OID_CLIENT_ID,
      clientSecret: OID_CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
      code,
    },
    discoveryDoc
  );
}

/**
 * Récupère les informations utilisateur depuis l’endpoint /userinfo
 */
export async function fetchUserInfo(accessToken: string, userInfoEndpoint: string) {
  const response = await fetch(userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Impossible de récupérer les informations utilisateur');
  }
  return await response.json();
}