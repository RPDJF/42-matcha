### Endpoint

```
POST /api/v1/auth/register
```

### Payload

```json
{
    "emailAddress": "string",
    "password": "string",
    "birthDate": "Unix Miliseconds"
}
```

### Réponse

**202 Accepted**

```json
{}
```

Note: HTTP-Only cookie with 6 minutes of alive time, used for confirmation.

**400 Bad Request**

- Le mot de passe est vide ou invalide
- L'adresse email n'est pas valide
- Les champs requis ne sont pas remplis

**409 Conflict**

- L'adresse email est déjà utilisée
