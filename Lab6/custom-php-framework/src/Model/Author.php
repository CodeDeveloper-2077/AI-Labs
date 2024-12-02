<?php
namespace App\Model;

use App\Service\Config;

class Author
{
    private ?int $id = null;
    private ?string $firstName = null;
    private ?string $lastName = null;
    private ?int $age = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Author
    {
        $this->id = $id;
        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): Author
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): Author
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(?int $age): Author
    {
        $this->age = $age;
        return $this;
    }

    public static function fromArray(array $array): Author
    {
        $author = new self();
        $author->fill($array);

        return $author;
    }

    public function fill(array $array): Author
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['firstName'])) {
            $this->setFirstName($array['firstName']);
        }
        if (isset($array['lastName'])) {
            $this->setLastName($array['lastName']);
        }
        if (isset($array['age'])) {
            $this->setAge($array['age']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM author';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $authors = [];
        $authorsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($authorsArray as $authorArray) {
            $authors[] = self::fromArray($authorArray);
        }

        return $authors;
    }

    public static function find($id): ?Author
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM author WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $authorArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$authorArray) {
            return null;
        }

        return self::fromArray($authorArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO author (firstName, lastName, age) VALUES (:firstName, :lastName, :age)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'firstName' => $this->getFirstName(),
                'lastName' => $this->getLastName(),
                'age' => $this->getAge(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE author SET firstName = :firstName, lastName = :lastName, age = :age WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'firstName' => $this->getFirstName(),
                'lastName' => $this->getLastName(),
                'age' => $this->getAge(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM author WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setFirstName(null);
        $this->setLastName(null);
        $this->setAge(null);
    }
}