<?php

/** @var \App\Model\Author[] $authors */
/** @var \App\Service\Router $router */

$title = 'Authors List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Authors List</h1>

    <a href="<?= $router->generatePath('author-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($authors as $author): ?>
            <li><h3><?= $author->getFirstName(); ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('author-show', ['id' => $author->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('author-edit', ['id' => $author->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';