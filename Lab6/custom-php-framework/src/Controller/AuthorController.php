<?php

namespace App\Controller;

use App\Model\Author;
use App\Service\Router;
use App\Service\Templating;

class AuthorController
{
    public function indexAction(Templating $templating, Router $router): string
    {
        $authors = Author::findAll();
        return $templating->render('author/index.html.php', [
            'authors' => $authors,
            'router' => $router
        ]);
    }

    public function showAction(int $authorId, Templating $templating, Router $router): string
    {
        $author = Author::find($authorId);
        if (!$author) {
            http_response_code(404);
            return "Author not found";
        }

        return $templating->render('author/show.html.php', [
            'author' => $author,
            'router' => $router
        ]);
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): string
    {
        $author = new Author();

        if ($requestPost) {
            $author->fill($requestPost);

            if ($this->validate($author)) {
                $author->save();
                $path = $router->generatePath('author-index');
                $router->redirect($path);
                return '';
            }
        }

        return $templating->render('author/create.html.php', [
            'author' => $author,
            'router' => $router
        ]);
    }

    public function editAction(int $authorId, ?array $requestPost, Templating $templating, Router $router): string
    {
        $author = Author::find($authorId);
        if (!$author) {

            http_response_code(404);
            return "Author not found";
        }

        if ($requestPost) {
            $author->fill($requestPost);

            if ($this->validate($author)) {
                $author->save();
                $path = $router->generatePath('author-index');
                $router->redirect($path);
                return '';
            }
        }

        return $templating->render('author/edit.html.php', [
            'author' => $author,
            'router' => $router
        ]);
    }

    public function deleteAction(int $authorId, Router $router): string
    {
        $author = Author::find($authorId);
        if (!$author) {

            http_response_code(404);
            return "Author not found";
        }


        $author->delete();
        $path = $router->generatePath('author-index');
        $router->redirect($path);
        return '';
    }

    private function validate(Author $author): bool
    {
        $errors = [];

        if (empty($author->getFirstName())) {
            $errors[] = "FirstName cannot be empty.";
        }
        if (empty($author->getAge())) {
            $errors[] = "Age cannot be empty.";
        }

        if (!empty($errors)) {
            foreach ($errors as $error) {
                echo "<p class='error'>{$error}</p>";
            }
            return false;
        }

        return true;
    }
}