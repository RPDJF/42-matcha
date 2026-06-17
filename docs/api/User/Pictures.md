## Upload User Pictures

### Endpoint

```
POST /api/v1/me/pictures
```

### Payload

```json
{
  "pictures": ["file"] // Fichiers image à uploader
}
```

### Réponse

**201 Created**

- Images téléchargées avec succès

**400 Bad Request**

- Fichiers d'image invalides
- Nombre de fichiers dépassé

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

## Delete User Picture

### Endpoint

```
DELETE /api/v1/me/pictures/{index}
```

### Réponse

**200 OK**

- Image supprimée avec succès

**400 Bad Request**

- Index d'image invalide

**401 Unauthorized**

- Utilisateur non authentifié (JWT token requis)

