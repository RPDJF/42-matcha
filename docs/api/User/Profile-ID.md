## Get User Profile by ID

### Endpoint

```
GET /api/v1/users/{userId}/profile
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
