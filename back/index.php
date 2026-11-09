<?php

use Uri\Rfc3986\Uri;

set_exception_handler(function (Throwable $e) {
    error_log($e->getMessage());
    echo $e->getMessage();
    respond(500, ["success" => false, "message" => "Server error"]);
});

$siteUrl = getEnvOrFail('BASE_URL');

header("Access-Control-Allow-Origin: $siteUrl");
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, PUT");
    header("Access-Control-Allow-Headers: content-type");
    respond(200, ["success" => true, "message" => "OK"]);
    return;
}

$url = getRequestUrl();

$routes = [
    "#^\/api\/auth/login$#" => function () {
        handleLogin();
    },
    "#^\/api\/auth/logged$#" => function () {
        if (!checkToken()) {
            return unauthorized();
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            respond(405, ["erreur" => "Unauthorized method"]);
            return;
        }

        respond(200, ["success" => true, "message" => "OK"]);
    },
    "#^\/api\/media$#" => function () {
        if (!checkToken()) {
            return unauthorized();
        }

        handleMedia();
    },
    "#^\/api\/pages\/publish\/.*$#" => function () {
        if (!checkToken()) {
            return unauthorized();
        }

        handlePage();
    }
];

$found = false;

foreach ($routes as $route => $handler) {
    if (preg_match($route, $url->getPath())) {
        call_user_func($handler);
        $found = true;
        break;
    }
}

if (!$found) {
    respond(404, ["success" => false, "message" => "Not found"]);
    return;
}

function handleLogin(): void
{
    $password = getEnvOrFail('API_PASSWORD');
    $hash = password_hash($password, PASSWORD_BCRYPT);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        respond(405, ["erreur" => "Unauthorized method"]);
        return;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body || !isset($body["password"])) {
        respond(422, ["success" => false, "message" => "Invalid request."]);
        return;
    }

    $userPassword = $body["password"];

    $token = createToken();

    if (password_verify($userPassword, $hash)) {
        setcookie(
            'token',
            $token,
            [
                'expires' => time() + 60 * 60,
                'path' => '/',
                'secure' => false,
                'httponly' => true,
                'samesite' => 'Lax'
            ]
        );

        respond(200, ["success" => true, "token" => $token]);

        return;
    } else {
        respond(401, ["success" => false, "token" => "Unauthorized"]);
        return;
    }
}


function handlePage(): void
{
    $repoUrl = getEnvOrFail('REPO_BASE_URL');
    $token = getEnvOrFail('GH_TOKEN');

    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        respond(405, ["erreur" => "Unauthorized method"]);
        return;
    }

    $file = file_get_contents('php://input');
    if (!$file) {
        respond(422, ["success" => false, "message" => "Expected content"]);
        return;
    }

    $page = array_last(explode('/', $_SERVER['REQUEST_URI']));

    $url = "$repoUrl/contents/app/pages/$page.vue";
    $headers = [
        "Authorization: Bearer $token",
        "Accept: application/vnd.github+json",
        "User-Agent: atelier-editor",
    ];

    $get = curl_init("$url?ref=nuxt4");
    curl_setopt_array($get, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers]);
    $sha = json_decode(curl_exec($get), true)['sha'] ?? null;

    $req = curl_init($url);

    curl_setopt_array($req, [
        CURLOPT_CUSTOMREQUEST  => 'PUT',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_POSTFIELDS     => json_encode(array_filter([
            "message" => "[editor] page $page edition",
            "branch"  => "nuxt4",
            "content" => base64_encode($file),
            "sha"     => $sha,
        ])),
    ]);

    $result = curl_exec($req);

    if (!$result) {
        trigger_error(curl_error($req));

        respond(500, ["success" => false, "message" => "Server Error"]);
        return;
    }

    $status = curl_getinfo($req, CURLINFO_HTTP_CODE);

    http_response_code($status);

    if ($status >= 200 && $status < 300) {
        echo json_encode(["success" => true, "message" => "Page succesfully updated"]);
        return;
    }

    echo json_encode(["success" => false, "message" => "Github error"]);
}

function handleMedia(): void
{

    $cloud = getEnvOrFail('CLD_CLOUDNAME');
    $key = getEnvOrFail('CLD_API_KEY');
    $secret = getEnvOrFail('CLD_API_SECRET');

    $api = "https://api.cloudinary.com/v1_1/$cloud";
    $folder = 'gallery';
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $photos = [];
            $cursor = '';
            do {
                $query = http_build_query(["prefix" => "$folder/", "max_results" => 500, "next_cursor" => $cursor]);
                [$status, $json] = cloudinary("$api/resources/image/upload?$query", [CURLOPT_USERPWD => "$key:$secret"]);
                if ($status !== 200) {
                    respond(502, ["message" => "Cloudinary error"]);
                    return;
                }
                array_push($photos, ...array_map(
                    fn($photo) => "/{$photo['public_id']}.{$photo['format']}",
                    $json['resources'],
                ));
                $cursor = $json['next_cursor'] ?? '';
            } while ($cursor);
            respond(200, ["photos" => $photos]);
            return;

        case 'POST':
            // the public id is built here: a signature can only ever create a new photo in the folder
            $name = preg_replace('/[^a-zA-Z0-9_-]+/', '-', pathinfo($body['filename'] ?? '', PATHINFO_FILENAME));
            $subfolder = trim(preg_replace('/[^a-zA-Z0-9_\/-]+/', '', $body['folder'] ?? ''), '/');
            $target = $subfolder ? "$folder/$subfolder" : $folder;
            $params = [
                "asset_folder" => $target,
                "overwrite" => "false",
                "public_id" => "$target/" . ($name ?: 'photo') . '-' . bin2hex(random_bytes(3)),
                "timestamp" => time(),
            ];
            respond(200, [
                "url" => "$api/image/upload",
                "fields" => [...$params, "api_key" => $key, "signature" => sign($params, $secret)],
            ]);
            return;
    }

    respond(405, ["success" => false, "message" => "Unauthorized method"]);
}

function respond(int $status, array|string $data): void
{
    http_response_code($status);
    if (is_array($data)) {
        echo json_encode($data);
    } else {
        echo $data;
    }
}

/** @param array<string, string|int> $params must be sorted by key */
function sign(array $params, string $secret): string
{
    return sha1(urldecode(http_build_query($params)) . $secret);
}

function cloudinary(string $url, array $options): array
{
    $req = curl_init($url);
    curl_setopt_array($req, $options + [CURLOPT_RETURNTRANSFER => true]);
    $result = curl_exec($req);

    return [curl_getinfo($req, CURLINFO_HTTP_CODE), json_decode($result ?: '', true)];
}

function getEnvOrFail(string $key): string
{
    $value = getenv($key);
    if (!isset($value)) {
        throw new Exception("Expected defined env value");
    }
    return $value;
}

function getRequestUrl()
{
    return Uri::parse($_SERVER['REQUEST_URI']);
}

function hashPayload(array $payload)
{
    return hash_hmac('sha256', json_encode($payload), getEnvOrFail("TOKEN_KEY"));
}

function createToken()
{
    $payload = [
        "user" => "editor",
        "exp" => time() + 60 * 60,
    ];

    $signature = hashPayload($payload);

    return base64_encode(json_encode($payload)) . "." . $signature;
}


function checkToken()
{
    $headers = getallheaders();

    $token = null;

    if (isset($_COOKIE['token'])) {
        $token = $_COOKIE['token'];
    } else {
        foreach ($headers as $name => $value) {
            if ($name === 'Authorization') {
                $parts = explode(' ', $value);

                if (count($parts) < 2) {
                    return false;
                }

                [$bearer, $jwt] = $parts;

                if (trim($bearer) !== "Bearer") {
                    return false;
                }

                $token =  trim($jwt);
            }
        }
    }

    if (!isset($token)) {
        return false;
    }

    $payload = readToken($token);

    if (isset($payload)) {
        return true;
    }

    return false;
}

function readToken(string $token)
{
    $parts = explode('.', $token);

    if (count($parts) !== 2) {
        return null;
    }

    [$encodedPayload, $signature] = $parts;
    $payload = json_decode(base64_decode($encodedPayload), true);

    if (!isset($payload, $payload["exp"], $payload["user"])) {
        return null;
    }

    if (!hash_equals($signature, hashPayload($payload))) {
        return null;
    }

    if ($payload["exp"] <= time()) {
        return null;
    }

    return $payload;
}

function unauthorized()
{
    respond(401, ["success" => false, "message" => "Unauthorized"]);
}
