const mlajasBarbershop = (db) => {
    const hairCuts = async () => {
        return await db.manyOrNone(`select * from hair_cuts order by id`);
    };

    const makeBooking = async ({ date, time, haircutId, clientName, barberId }) => {
        const bookedSlot = await db.oneOrNone(`select * from bookings where booking_date = $1 
                                               and booking_time = $2 and barber_id = $3`, [date, time, barberId]);

        if (bookedSlot) {
            // case where slot booked
            return null;
        };

        // barber should not be booked more than 3 times a day
        const bookingsPerDay = await db.oneOrNone(`select count(*) from bookings where booking_date = $1
                                                   and barber_id = $2`, [date, barberId]);

        if (bookingsPerDay.count > 5) {
            // made more bookings for a day
            return undefined;
        };

        const clientId = await db.oneOrNone(`insert into clients (name) values ($1) where count(name) <= 2 RETURNING id`, [clientName]);

        if (clientId) {
            await db.none(
                `insert into bookings (booking_date, booking_time, hair_cut_id, client_id, barber_id) 
                 values ($1, $2, $3, $4, $5)`, [date, time, haircutId, clientId.id, barberId]
            );
            return true;
        };
        return false;
    };

    const bookings = async ({ date, time, haircutId }) => {

        if (date && time) {
            // Retrieve all bookings made based on time and date
        };

        if (haircutId) {
            // Retrive all bookings made based on haircut
        };
        
        // Retrieve all bookings made
    };

    const cancelBooking = async (bookingId) => {
        await db.none(`delete from bookings where id = $1`, [bookingId]);
    };

    const cancelAllBookings = async () => {
        await db.none(`delete from bookings`);
    };

    return {
        hairCuts,
        makeBooking,
        bookings,
        cancelBooking,
        cancelAllBookings
    };
};

export default mlajasBarbershop;