## Get User Profile by ID

### Endpoint

```
GET /api/v1/users/{userId}/profile
```

### Réponse

**200 OK**

```json
{
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
}
```

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)
