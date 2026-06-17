## Login (Connexion)

### Endpoint

```
POST /api/v1/auth/login
```

### Payload

```json
{
  "clientId": "string",
  "emailAddress": "string",
  "password": "string"
}
```

### Réponse

**200 OK**

```json
{
  "token": "string",
  "sub": "string",
  "data": {
    "userUUID": "string",
    "displayName": "string",
    "firstName": "string",
    "lastName": "string",
    "lastAlive": "number",
    "age": "number",
    "avatar": "string",
    "status": "single" | "couple" | "free",
    "gender": "male" | "female",
    "city": "string",
    "rating": "number",
    "pictures": [
      {
        "id": "string",
        "url": "string"
      }
    ], // URL des images
    "interests": ["string"],
    "biography": "string",
    "sexuality": "heterosexual" | "homosexual" | "bisexual",
    "role": "user" | "administrator",
    "emailAddress": "string",
    "location": {
      "lat": "number",
      "lng": "number"
    }
  },
  "iss": "string",
  "iat": "number",
  "exp": "number"
}
```

**401 Unauthorized**

- Identifiants incorrects
- Utilisateur non trouvé

**403 Forbidden**

- Compte désactivé ou verrouillé

**422**

- Sent or waiting 2FA si enforced

##  Two-Factor Authentication (2FA)

### Endpoint

```
POST /api/v1/auth/2fa
```

### Payload

```json
{
  "clientId": "string",
  "code": "string"
}
```

### Réponse

**200 OK**

```json
{
  "token": "string",
  "sub": "string",
  "data": {
    "userUUID": "string",
    "displayName": "string",
    "firstName": "string",
    "lastName": "string",
    "lastAlive": "number",
    "age": "number",
    "avatar": "string",
    "status": "single" | "couple" | "free",
    "gender": "male" | "female",
    "city": "string",
    "rating": "number",
    "pictures": [
      {
        "id": "string",
        "url": "string"
      }
    ], // URL des images
    "interests": ["string"],
    "biography": "string",
    "sexuality": "heterosexual" | "homosexual" | "bisexual",
    "role": "user" | "administrator",
    "emailAddress": "string",
    "location": {
      "lat": "number",
      "lng": "number"
    }
  },
  "iss": "string",
  "iat": "number",
  "exp": "number"
}
```

**400 Bad Request**

- Code 2FA invalide
- Code 2FA expiré

## Logout

### Endpoint

```
POST /api/v1/auth/logout
```

### Réponse

**200 OK**

- Session terminée avec succès

**401 Unauthorized**

- Utilisateur non authentifié
