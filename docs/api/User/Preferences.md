## Update User Preferences

### Endpoint

```
PATCH /api/v1/me/preferences
```

### Payload

```json
{
  "minAge": "number",
  "maxAge": "number",
  "location": "string",
  "distance": "number",
  "sexuality": "heterosexual" | "homosexual" | "bisexual"
}
```

### Réponse

**200 OK**

- Préférences mises à jour avec succès

**400 Bad Request**

- Données de préférences invalides

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

## Get User Preferences

### Endpoint

```
GET /api/v1/me/preferences
```

### Réponse

**200 OK**

```json
{
  "minAge": "number",
  "maxAge": "number",
  "location": "string",
  "distance": "number",
  "sexuality": "heterosexual" | "homosexual" | "bisexual"
}
```

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

