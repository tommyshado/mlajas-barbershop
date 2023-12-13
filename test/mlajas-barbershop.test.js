import assert from "assert";
import pgPromise from "pg-promise";

// service import
import mlajasBarbershop from "../services/mlajas-barbershop.js";

// TODO configure this to work.
const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST || "postgres://xpjmzeis:0X_fgEfUzNTepNI-DtLv8w1fgSCwppSm@cornelius.db.elephantsql.com/xpjmzeis";

const config = {
    connectionString: DATABASE_URL_TEST,
};

const pgp = pgPromise();
const db = pgp(config);

// service instance
const barbershop = mlajasBarbershop(db);

describe("Barbershop Booking System", function () {
    this.timeout(10000);

    const haircutIds = {
        lowFade: {
            id: 1,
            price: 50.00
        },
        highFade: {
            id: 2,
            price: 75.00
        },
        brushCut: {
            id: 3,
            price: 35.00
        },
        cheeseKop: {
            id: 4,
            price: 25
        },
        mohawk: {
            id: 5,
            price: 85
        }
    };

    const barberIds = {
        mlaja: 1,
        myobi: 2
    };

    beforeEach(async () => {
        await db.none(`truncate table bookings restart identity cascade`);
    });

    it("should be able to list all haircuts", async () => {
        const haircuts = await barbershop.hairCuts();

        assert.deepEqual([{}, {}, {}, {}, {}], haircuts);
    });

    it("should be able to make a booking", async () => {
        const booking = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.brushCut.id, 
            clientName: "London", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking);

        const bookingsMade = await barbershop.bookings();

        assert.equal(1, bookingsMade.length);

    });

    it("should be able to find all bookings made", async () => {
        const booking1 = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.lowFade.id, 
            clientName: "London", 
            barberId: barberIds.myobi
        };

        await barbershop.makeBooking(booking1);

        const booking2 = { 
            date: '2023-12-25', 
            time: '10:30', 
            haircutId: haircutIds.cheeseKop.id, 
            clientName: "Othalive", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking2);

        const booking3 = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.mohawk, 
            clientName: "Katleho", 
            barberId: barberIds.myobi 
        };

        await barbershop.makeBooking(booking3);

        const bookingsMade = await barbershop.bookings();

        assert.equal(3, bookingsMade.length);
    });

    it("should be able to find all bookings made for haircut", async () => {
        const booking1 = { 
            date: '2023-12-29', 
            time: '14:35', 
            haircutId: haircutIds.lowFade.id, 
            clientName: "London", 
            barberId: barberIds.myobi
        };

        await barbershop.makeBooking(booking1);

        const booking2 = { 
            date: '2024-01-12', 
            time: '12:30', 
            haircutId: haircutIds.cheeseKop.id, 
            clientName: "Othalive", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking2);

        const bookingsMade = await barbershop.bookings({haircutId: haircutIds.cheeseKop.id});

        assert.equal(1, bookingsMade.length);
    });

    it("should be able to find all bookings made given date and time", async () => {
        const booking1 = { 
            date: '2023-12-29', 
            time: '14:35', 
            haircutId: haircutIds.lowFade.id, 
            clientName: "London", 
            barberId: barberIds.myobi
        };

        await barbershop.makeBooking(booking1);

        const booking2 = { 
            date: '2024-01-12', 
            time: '12:30', 
            haircutId: haircutIds.cheeseKop.id, 
            clientName: "Othalive", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking2);

        const booking3 = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.mohawk, 
            clientName: "Katleho", 
            barberId: barberIds.myobi 
        };

        await barbershop.makeBooking(booking3);

        const bookingsMade = await barbershop.bookings({date: booking3.date, time: booking3.time});

        assert.equal(1, bookingsMade.length);
    });

    it("should be able to cancel a booking", async () => {
        const booking1 = { 
            date: '2023-12-29', 
            time: '14:35', 
            haircutId: haircutIds.lowFade.id, 
            clientName: "London", 
            barberId: barberIds.myobi
        };

        await barbershop.makeBooking(booking1);

        const booking2 = { 
            date: '2024-01-12', 
            time: '12:30', 
            haircutId: haircutIds.cheeseKop.id, 
            clientName: "Othalive", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking2);

        const booking3 = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.mohawk, 
            clientName: "Katleho", 
            barberId: barberIds.myobi 
        };

        await barbershop.makeBooking(booking3);

        let bookingsMade = await barbershop.bookings();

        await barbershop.cancelBooking(bookingsMade[0].id);

        bookingsMade = await barbershop.bookings();

        assert.equal(2, bookingsMade.length);
    });

    it("should be able to cancel all bookings", async () => {
        const booking1 = { 
            date: '2023-12-29', 
            time: '14:35', 
            haircutId: haircutIds.lowFade.id, 
            clientName: "London", 
            barberId: barberIds.myobi
        };

        await barbershop.makeBooking(booking1);

        const booking2 = { 
            date: '2024-01-12', 
            time: '12:30', 
            haircutId: haircutIds.cheeseKop.id, 
            clientName: "Othalive", 
            barberId: barberIds.mlaja 
        };

        await barbershop.makeBooking(booking2);

        const booking3 = { 
            date: '2023-12-18', 
            time: '14:30', 
            haircutId: haircutIds.mohawk, 
            clientName: "Katleho", 
            barberId: barberIds.myobi 
        };

        await barbershop.makeBooking(booking3);

        
        await barbershop.cancelAllBookings();
        
        const bookingsMade = await barbershop.bookings();

        assert.equal(0, bookingsMade.length);
    });
    
    after(db.$pool.end);
});