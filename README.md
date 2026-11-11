# L'atelier

Le site web de l'Atelier de Saint-Guénolé.

- **Front** : Nuxt, généré en statique (`bun run generate` → `.output/public`)
- **Back** : `back/index.php`, une petite API pour l'éditeur (connexion, photos, publication)

## Dépendances

### Build (CI GitHub)

- [Bun](https://bun.sh) 1.4.4
- [transient](https://github.com/Dmoulart/transient) (ref `alpha-0.1`) : la CI le clone, le build et le lie (`@transient/nuxt`)

Aucune variable à configurer : les valeurs du front (`BASE_URL`, `BACK_URL`, `CLD_CLOUDNAME`) sont publiques
et ont leurs valeurs de prod par défaut dans `nuxt.config.ts`. En local, le `.env` à la racine les remplace.

### Hébergement (1&1)

- Apache avec `.htaccess` (déjà fournis)
- **PHP 8.5** avec l'extension curl

### Services externes

- **Cloudinary** : stockage des photos (clé + secret API)
- **GitHub** : un token avec le droit d'écriture sur le contenu du repo. L'éditeur commit les pages publiées sur `main`, ce qui relance la CI.

## Arborescence sur le serveur

```
<racine web>/       ← contenu de .output/public
<racine web>/api/   ← back/index.php, back/.htaccess et le .env de prod
```

C'est le seul `.env` de prod : celui de l'API, qui contient les secrets (modèle : `.env.example`).
Il est déposé **une seule fois, à la main** dans `api/`. Il n'est pas versionné et le `.htaccess`
empêche de le télécharger. Points à respecter :

- `ENV="PROD"`
- `BASE_URL` sans slash final : il doit correspondre exactement à l'origine du site
- `REPO_BASE_URL` = `https://api.github.com/repos/<owner>/<repo>`

Si le déploiement synchronise avec suppression (`--delete`), **exclure `api/`**, sinon le back et son `.env` sont effacés.

## Dev local

```sh
bun install
bun run dev
```
