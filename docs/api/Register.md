### Endpoint

```
POST /api/v1/auth/register
```

### Payload

```json
{
  "clientId": "string",
  "displayName": "string",
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

**400 Bad Request**

- Le mot de passe est vide ou invalide
- L'adresse email n'est pas valide
- Les champs requis ne sont pas remplis

**409 Conflict**

- L'adresse email est déjà utilisée
