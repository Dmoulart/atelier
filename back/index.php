<?php

$repoUrl = getenv('REPO_BASE_URL');
$siteUrl = getenv('BASE_URL');
$token = getenv('GH_TOKEN');

if (!$repoUrl || !$token) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error. Wrong setup."]);
    return;
}

header("Access-Control-Allow-Origin: $siteUrl");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header("Access-Control-Allow-Methods: GET, POST, PUT");
    header("Access-Control-Allow-Headers: content-type");
    echo "ok";
    return;
}

if (array_last(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) === 'media') {
    handleMedia();
    return;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["erreur" => "Unauthorized method"]);
    return;
}

$file = file_get_contents('php://input');
if (!$file) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Expected content"]);
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

    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error"]);
    return;
}

$status = curl_getinfo($req, CURLINFO_HTTP_CODE);
header('Content-Type: application/json');

http_response_code($status);

if ($status >= 200 && $status < 300) {
    echo json_encode(["success" => true, "message" => "Page succesfully updated"]);
    return;
}

echo json_encode(["success" => false, "message" => "Github error"]);

return;

function handleMedia(): void
{
    header('Content-Type: application/json');

    $cloud = getenv('CLD_CLOUDNAME');
    $key = getenv('CLD_API_KEY');
    $secret = getenv('CLD_API_SECRET');

    if (!$cloud || !$key || !$secret) {
        respond(500, ["message" => "Server Error. Wrong setup."]);
        return;
    }

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
                    fn ($photo) => "/{$photo['public_id']}.{$photo['format']}",
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

    respond(405, ["message" => "Unauthorized method"]);
}

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
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
