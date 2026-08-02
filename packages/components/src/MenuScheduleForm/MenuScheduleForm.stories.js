import React, { useState } from 'react';

import MenuScheduleForm from './MenuScheduleForm';

export default {
    title: 'packages/MenuScheduleForm',
};

const WEEKDAY_LUNCH_AND_DINNER = {
    monday: [{ startTime: '11:00', endTime: '15:00' }],
    tuesday: [{ startTime: '11:00', endTime: '15:00' }],
    wednesday: [
        { startTime: '11:00', endTime: '15:00' },
        { startTime: '18:00', endTime: '23:00' },
    ],
    // Imported from Uber with an inclusive end and crossing midnight, the two cases the editor
    // has to keep intact.
    friday: [{ startTime: '18:00', endTime: '02:59' }],
};

export const Default = () => {
    const [schedule, setSchedule] = useState(WEEKDAY_LUNCH_AND_DINNER);

    return <MenuScheduleForm schedule={schedule} onChange={setSchedule} />;
};

// An empty map is a menu on sale at any hour: every day reads as closed until hours are added.
export const AlwaysOpen = () => {
    const [schedule, setSchedule] = useState({});

    return <MenuScheduleForm schedule={schedule} onChange={setSchedule} />;
};

// A zero-length range is what the backend rejects, so the row shows its error inline.
export const WithInvalidRange = () => {
    const [schedule, setSchedule] = useState({ monday: [{ startTime: '09:00', endTime: '09:00' }] });

    return <MenuScheduleForm schedule={schedule} onChange={setSchedule} />;
};
