<?php
/** @var \App\Model\Author $author */
/** @var \App\Service\Router $router */

$title = "{$author->getFirstName()} ({$author->getLastName()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $author->getFirstName() ?></h1>
    <article>
        <?= $author->getLastName();?>
    </article>
    <h2> - - -</h2>
    <article>
        <?= $author->getAge();?> y.o.
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('author-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('author-edit', ['id'=> $author->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';