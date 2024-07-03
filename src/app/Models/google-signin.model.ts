export interface GoogleUser {
  getBasicProfile(): GoogleUserProfile;
  getAuthResponse(): { id_token: string };
}

export interface GoogleUserProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}
