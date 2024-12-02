<?php

/** @var \App\Model\Author $author */
/** @var \App\Service\Router $router */

$title = "Edit Author {$author->getFirstName()} ({$author->getLastName()})";
$bodyClass = 'edit';

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('author-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="author-edit">
        <input type="hidden" name="id" value="<?= $author->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('author-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('author-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="author-delete">
                <input type="hidden" name="id" value="<?= $author->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';