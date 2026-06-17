## Get Onboarding Status

### Endpoint

```
GET /api/v1/users/onboarding
```

### Réponse

**200 OK**

```json
{
  "isOnboarded": false,
  "missingSteps": ["pictures", "interests"]
}
```

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

## Onboarding

### Endpoint

```
POST /api/v1/users/onboarding
```

### Payload

```json
{
  "pictures": ["file"], // Fichiers image à uploader
  "basicInformation": {
    "firstName": "string",
    "lastName": "string",
    "age": "number",
    "gender": "male" | "female",
    "biography": "string"
  },
  "interests": ["string"],
  "preferences": {
    "minAge": "number",
    "maxAge": "number",
    "location": "string",
    "distance": "number",
    "sexuality": "heterosexual" | "homosexual" | "bisexual"
  }
}
```

### Réponse

**201 Created**

- Ressource créée avec succès

**400 Bad Request**

- Données de profil invalides
- Nombre de photos insuffisant
- Informations de préférences incorrectes

**409 Conflict**

- L'utilisateur a déjà effectué l'onboarding
