<?php
/** @var \App\Model\Author $author */
?>

<div class="form-group">
    <label for="first-name">FirstName</label>
    <input type="text" id="first-name" name="author[firstName]" value="<?= $author->getFirstName(); ?>">
</div>

<div class="form-group">
    <label for="last-name">LastName</label>
    <input type="text" id="last-name" name="author[lastName]" value="<?= $author->getLastName(); ?>">
</div>

<div class="form-group">
    <label for="age">Age</label>
    <input type="number" id="age" name="author[age]" value="<?= $author->getAge(); ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>