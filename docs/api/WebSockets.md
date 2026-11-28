## WebSocket Connections

### Structure des Messages

Chaque message WebSocket a un champ `type` qui définit le type d'action à effectuer :

- **Type:** `presence` - indique que le message concerne le suivi de la présence utilisateur

### 1. presence - Présence Utilisateurs

L'application utilise des connexions WebSocket pour le suivi en temps réel de la présence des utilisateurs. Savoir s'ils sont connectés.

#### Communication Client -> Serveur

Lorsqu'un client envoie un message de présence au serveur, il utilise le type `presence` avec un payload contenant :

- **action**: définit l'opération à effectuer sur les utilisateurs suivis
- **userUUIDs**: tableau des identifiants des utilisateurs concernés

##### Actions possibles :

Le serveur reçoit le payload complet suivant :

```json
{
  "type": "presence",
  "payload": {
    "action": "append" | "reset" | "remove",
    "userUUIDs": ["string"]
  }
}
```

- **`reset`**: remplace la liste actuelle des utilisateurs suivis par la nouvelle liste fournie
- **`append`**: ajoute les utilisateurs de la liste à la liste actuelle
- **`remove`**: supprime les utilisateurs spécifiés de la liste actuelle

#### Communication Serveur -> Client

Au subscribe de nouveaux users et lors des mises à jour de présence des utilisateurs :

- **Type:** `presence`
- **Payload:**
  ```json
  {
    "userUUID": "string",
    "presence": "online" | "offline" | "away",
    "lastSeenAt": "1781257910"
  }
  ```
