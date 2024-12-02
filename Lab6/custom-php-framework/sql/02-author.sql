create table author
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    firstName text not null,
    lastName text not null,
    age integer not null
);
