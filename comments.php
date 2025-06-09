<?php
header('Content-Type: application/json');
$comments_file = 'comments.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos enviados (seguridad: limpiamos entrada)
    $input = json_decode(file_get_contents('php://input'), true);
    $name = htmlspecialchars(trim($input['name'] ?? ''));
    $text = htmlspecialchars(trim($input['text'] ?? ''));
    $date = date('Y-m-d H:i');

    if ($name && $text) {
        // Leer comentarios existentes
        $comments = file_exists($comments_file) ? json_decode(file_get_contents($comments_file), true) : [];
        // Nuevo comentario al principio
        array_unshift($comments, [
            'name' => $name,
            'text' => $text,
            'date' => $date
        ]);
        // Guardar el array actualizado
        file_put_contents($comments_file, json_encode($comments, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Falta nombre o texto']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Leer y devolver los comentarios
    if (file_exists($comments_file)) {
        echo file_get_contents($comments_file);
    } else {
        echo json_encode([]);
    }
    exit;
}

// Si no es GET o POST, error:
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);