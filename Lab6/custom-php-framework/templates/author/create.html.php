<?php

/** @var \App\Model\Author $author */
/** @var \App\Service\Router $router */

$title = 'Create Author';
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Create Author</h1>
    <form action="<?= $router->generatePath('author-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="author-create">
    </form>
    <a href="<?= $router->generatePath('author-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';