import { MemoryStore } from 'express-session';
import { Token } from 'keycloak-connect';
import KeycloakConnect = require('keycloak-connect');

export class KeycloakService {
  private keycloak: KeycloakConnect.Keycloak;
  private memoryStore: MemoryStore;
  private token: Token;

  constructor() {
    this.initKeycloak();
  }

  public initKeycloak(): KeycloakConnect.Keycloak {
    if (this.keycloak) {
      // $log.warn('Trying to init Keycloak again!');
      return this.keycloak;
    } else {
      // $log.info('Initializing Keycloak...');
      this.memoryStore = new MemoryStore();
      // this.keycloak = new KeycloakConnect(
      //   { store: this.memoryStore },

      //   {
      //     realm: 'CAMPAIGN_REALM',
      //     'auth-server-url': 'http://localhost:8080/auth/',
      //     'ssl-required': 'external',
      //     resource: 'CAMPAIGN_CLIENT',
      //     credentials: {
      //       secret: 'ba8d8925-b924-4302-8691-e93b5e51c885',
      //     },
      //     'confidential-port': 0,
      //     'policy-enforcer': {},
      //   },
      // );

      const keycloak = new KeycloakConnect({
        // Keycloak configuration options
        realm: 'your-realm',
        'auth-server-url': 'https://your-keycloak-url/auth',
        'ssl-required': 'external',
        resource: 'your-client-id',
        'public-client': true,
        'confidential-port': 0,
      });
      return this.keycloak;
    }
  }

  public getKeycloakInstance(): KeycloakConnect.Keycloak {
    return this.keycloak;
  }

  public getMemoryStore(): MemoryStore {
    return this.memoryStore;
  }

  public getToken(): Token {
    return this.token;
  }

  public setToken(token: Token): void {
    this.token = token;
  }
}
