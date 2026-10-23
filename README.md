# Treino Academia

App de treinos de academia em preto e branco, com API Java e app mobile Expo.

|Pasta|Descrição|
|---|---|
|`api/`|API REST em Java (Spring Boot 3 + JPA + banco H2)|
|`mobile/`|App Expo (React Native + TypeScript), tema preto e branco|

## Rodar a API

```bash
cd api
./mvnw.cmd spring-boot:run
```

- Porta: `http://localhost:8080`
- Console do banco H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/treinosdb`, usuário `sa`, senha vazia)
- Dados ficam salvos no arquivo `api/data/treinosdb.mv.db`

## Rodar o app

```bash
cd mobile
npx expo start
```

- `w` abre no navegador
- Escaneie o QR code com o app **Expo Go** no celular (mesmo Wi-Fi do PC), ou tecle `a` para emulador

### Configurar endereço da API

Em `mobile/src/config.ts`:

- Celular (Expo Go): `http://SEU_IP:8080` — descubra seu IP com `ipconfig` (campo IPv4)
- Emulador Android: `http://10.0.2.2:8080`

## Principais endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET/POST | `/api/treinos` | Lista / cria treino |
| GET/PUT/DELETE | `/api/treinos/{id}` | Detalha / edita / exclui treino |
| POST | `/api/treinos/{id}/exercicios` | Adiciona exercício ao treino |
| GET | `/api/exercicios` | Lista todos os exercícios |
| PUT/DELETE | `/api/exercicios/{id}` | Edita / exclui exercício |
| PATCH | `/api/exercicios/{id}/imagem` | Define a URL da imagem do exercício |

Cada exercício tem o campo `imagemUrl` no banco — a imagem é definida pelo próprio usuário (pelo app ou pela API), sem precisar mexer no código.
