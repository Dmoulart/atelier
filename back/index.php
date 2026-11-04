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
    header("Access-Control-Allow-Methods: PUT");
    header("Access-Control-Allow-Headers: content-type");
    echo "ok";
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

echo json_encode(["success" => true, "message" => "Page succesfully updated"]);
return;
