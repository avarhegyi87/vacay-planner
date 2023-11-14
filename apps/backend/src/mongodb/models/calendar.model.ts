import {
  AllowedHolidays,
  SingleEntry,
  CalendarEntries,
} from '@vacay-planner/models';
import { Schema } from 'mongoose';
import mongoose from '../../config/mongodb-config';

const AllowedHolidaysSchema = new Schema<AllowedHolidays>({
  year: Number,
  holidays: Number,
});

const SingleEntrySchema = new Schema<SingleEntry>({
  entryDate: { type: Date, required: true, unique: true },
  entryType: { type: String, required: true },
});

const CalendarEntriesSchema = new Schema<CalendarEntries & Document>({
  id: String,
  allowedHolidays: [AllowedHolidaysSchema],
  entries: [SingleEntrySchema], // [] as SingleEntry[],
});

const CalendarModel = mongoose.model<CalendarEntries & Document>('UserEntries', CalendarEntriesSchema);

export default CalendarModel;
