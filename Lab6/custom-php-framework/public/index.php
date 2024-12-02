<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    // Посты
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'author-index':
    case null:
        $controller = new \App\Controller\AuthorController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'author-create':
        $controller = new \App\Controller\AuthorController();
        $view = $controller->createAction($_REQUEST['author'] ?? null, $templating, $router);
        break;
    case 'author-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AuthorController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['author'] ?? null, $templating, $router);
        break;
    case 'author-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AuthorController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'author-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AuthorController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}