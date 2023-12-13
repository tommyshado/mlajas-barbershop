create table clients (
    id serial primary key,
    name text unique
);

create table hair_cuts (
    id serial primary key,
    hair_cut_type text,
    price numeric
);

create table barbers (
    id serial primary key,
    barber_name text unique
);

create table bookings (
    id serial primary key,
    booking_date date,
    booking_time time,
    hair_cut_id int,
    foreign key (hair_cut_id) references hair_cuts(id) on delete cascade,
    client_id int,
    foreign key (client_id) references clients(id) on delete cascade,
    barber_id int,
    foreign key (barber_id) references barbers(id) on delete cascade
);