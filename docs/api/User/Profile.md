## Get User Profile

### Endpoint

```
GET /api/v1/me/profile
```

### Réponse

**200 OK**

```json
{
  "uuid": "string",
  "emailAddress": "string",
  "firstName": "string",
  "lastName": "string",
  "lastAlive": "number",
  "age": "number",
  "avatar": "string",
  "status": "single" | "couple" | "free",
  "gender": "frontend" | "backend" | "fullstack",
  "interestedIn": [ "frontend" | "backend" | "fullstack" ],
  "city": "string",
  "rating": "number",
  "pictures": [
    {
      "id": "string",
      "url": "string"
    }
  ],
  "interests": ["string"],
  "biography": "string",
  "role": "user" | "administrator",
  "location": {
    "lat": "number",
    "lng": "number"
  }
}
```

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

## Update User Profile

### Endpoint

```
PATCH /api/v1/me/profile
```

### Payload

```json
{
  "emailAddress": "string",
  "displayName": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "age": "number",
  "gender": "male" | "female",
  "biography": "string",
  "sexuality": "heterosexual" | "homosexual" | "bisexual",
  "city": "string",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "interests": ["string"]
}
```

### Réponse

**200 OK**

- Profil mis à jour avec succès

**400 Bad Request**

- Données de mise à jour invalides
- Adresse email déjà utilisée

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)
