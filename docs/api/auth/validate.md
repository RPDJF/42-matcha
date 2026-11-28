### Endpoint

```
POST /api/v1/auth/validate
```

### Payload

```json
{
    "otpCode": "string"
}
```
Note: Includes HTTP-only session_id cookie.

### Réponse

**201 Created**

```json
{
  "token": "string",
  "sub": "string",
  "iss": "string",
  "iat": "number",
  "exp": "number"
}
```

**400 Bad Request**
- otpCode is not a 6-digit string

**404 Not Found**
- session_id does not exist

**422 Unprocessable Entity**
- otpCode doesn't match session_id
