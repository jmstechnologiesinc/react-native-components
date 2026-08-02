// Pure logic of the menu schedule editor. No react-native imports, so it can be tested in node.
//
// The shape is the one the backend persists (functions/inventory/schedule.js):
//   { monday: [{ startTime: "09:00", endTime: "17:00" }], ... }
//
//  - A day missing from the map is a closed day.
//  - An empty map means "always open".
//  - endTime <= startTime means the range crosses midnight.

// Presentation order, starting on Monday. The backend indexes by getDay(), which starts on
// Sunday, but that is its own business: here we only paint.
export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DEFAULT_RANGE = { startTime: '09:00', endTime: '17:00' };

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isValidTime = (value) => TIME_PATTERN.test(value);

export const toMinutes = (value) => {
    const [hours, minutes] = String(value).split(':');

    return Number(hours) * 60 + Number(minutes);
};

const MINUTES_IN_DAY = 24 * 60;
const SLOT_MINUTES = 15;

const toHHMM = (minutes) =>
    `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// Nobody opens at 17:03. 15 min slots, which is what Uber's TimePicker offers.
export const TIME_SLOTS = Array.from({ length: MINUTES_IN_DAY / SLOT_MINUTES }, (_slot, index) =>
    toHHMM(index * SLOT_MINUTES)
);

// Schedules imported from Uber use an inclusive end ("10:29", "16:59", "03:59"), which lands on no
// 15 min slot. When the stored value is not in the list it is inserted in its place instead of
// being dropped, so opening the picker neither hides it nor silently rewrites it.
export const timeSlotsFor = (value) => {
    if (!isValidTime(value) || TIME_SLOTS.includes(value)) {
        return TIME_SLOTS;
    }

    const minutes = toMinutes(value);
    const next = TIME_SLOTS.findIndex((slot) => toMinutes(slot) > minutes);
    const at = next === -1 ? TIME_SLOTS.length : next;

    return [...TIME_SLOTS.slice(0, at), value, ...TIME_SLOTS.slice(at)];
};

const withDay = (schedule, day, ranges) => {
    const next = { ...(schedule || {}) };

    if (ranges.length === 0) {
        delete next[day];
    } else {
        next[day] = ranges;
    }

    return next;
};

export const rangesOf = (schedule, day) => (schedule || {})[day] || [];

export const withRangeAdded = (schedule, day) =>
    withDay(schedule, day, [...rangesOf(schedule, day), { ...DEFAULT_RANGE }]);

export const withRangeRemoved = (schedule, day, index) =>
    withDay(
        schedule,
        day,
        rangesOf(schedule, day).filter((_range, i) => i !== index)
    );

export const withRangeUpdated = (schedule, day, index, field, value) =>
    withDay(
        schedule,
        day,
        rangesOf(schedule, day).map((range, i) => (i === index ? { ...range, [field]: value } : range))
    );

// Used to block the save button: the backend would reject these schedules anyway, and it is better
// to say so before the call.
export const invalidRanges = (schedule) => {
    const results = [];

    for (const day of DAYS_OF_WEEK) {
        rangesOf(schedule, day).forEach((range, index) => {
            if (!isValidTime(range.startTime) || !isValidTime(range.endTime)) {
                results.push({ day, index, reason: 'format' });
            } else if (range.startTime === range.endTime) {
                results.push({ day, index, reason: 'zeroLength' });
            }
        });
    }

    return results;
};

export const hasInvalidRanges = (schedule) => invalidRanges(schedule).length > 0;

export const isRangeInvalid = (schedule, day, index) =>
    invalidRanges(schedule).some((entry) => entry.day === day && entry.index === index);
