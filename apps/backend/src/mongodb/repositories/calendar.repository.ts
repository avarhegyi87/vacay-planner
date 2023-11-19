import {
  CalendarEntries,
  CalendarEntryTypeEnum,
  SingleEntry,
} from '@vacay-planner/models';
import CalendarModel from '../models/calendar.model';

class CalendarRepository {
  static async getCalByUserAndYear(
    id: string,
    year: number
  ): Promise<CalendarEntries | null> {
    return CalendarModel.findOne({
      id: `${id}_${year.toString()}`,
    }).exec();
  }

  static async getAllUserDocs(userid: number): Promise<Array<CalendarEntries>> {
    return await CalendarModel.find({
      id: { $regex: new RegExp(`^${userid.toString()}_`) },
    });
  }

  static async addSingleCalendarEntry(
    userid: number,
    entryDate: Date,
    entryType: CalendarEntryTypeEnum
  ): Promise<CalendarEntries | null> {
    let doc = CalendarModel.findOneAndUpdate(
      {
        id: this.getCompositeId(userid, entryDate),
        'entries.entryDate': entryDate,
      },
      { $set: { 'entries.entryType': entryType } }
    );

    if (!doc) {
      const entry: SingleEntry = { entryDate, entryType };
      doc = CalendarModel.findByIdAndUpdate(
        this.getCompositeId(userid, entryDate),
        { $push: { entries: entry } }
      );
    }

    return doc;
  }

  static async deleteSingleCalendarEntry(
    userid: number,
    dateToDelete: Date
  ): Promise<CalendarEntries | null> {
    return CalendarModel.findOneAndUpdate(
      { id: this.getCompositeId(userid, dateToDelete) },
      { $pull: { entries: { $elemMatch: { entryDate: dateToDelete } } } }
    );
  }

  static async getMonhlyCalendarEntries(
    userid: number,
    year: number,
    month: number
  ): Promise<Array<SingleEntry>> {
    try {
      const id: string = `${userid.toString()}_${year.toString()}`;
      let entries: Array<SingleEntry> = [];

      const doc = await CalendarModel.findOne({ id });
      if (doc) {
        entries = doc.entries?.filter(e => {
          const storedDate = new Date(e.entryDate);
          return (
            storedDate.getFullYear() === year &&
            storedDate.getMonth() === month - 1
          );
        });
      }

      return entries;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async updateCalendarEntry(
    userid: number,
    year: number,
    updates: Array<SingleEntry>
  ) {
    const id: string = `${userid.toString()}_${year.toString()}`;

    const existingDoc = await CalendarModel.findOne({ id });

    if (existingDoc) {
      const entries = existingDoc.entries;

      const filteredEntries = entries.filter(entry => {
        const updateWithSameDate = updates.find(update =>
          this.areDatesEqual(entry.entryDate, update.entryDate)
        );
        return !updateWithSameDate;
      });

      const mergedEntries = [...filteredEntries, ...updates];

      const newEntries = mergedEntries.filter(
        entry =>
          entry.entryType !== CalendarEntryTypeEnum.EMPTY ||
          !entry.entryDate ||
          entry.entryDate === null
      );

      newEntries.sort(
        (a, b) =>
          new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
      );

      const updatedDoc = await CalendarModel.findOneAndUpdate(
        { id },
        { $set: { entries: newEntries } }
      );

      return updatedDoc;
    } else {
      const newDoc = await CalendarModel.create({
        id,
        entries: updates,
      });
      return newDoc;
    }
  }

  static getCompositeId(userid: number, date: Date): string {
    return `${userid.toString()}_${date.getFullYear().toString()}`;
  }

  static areDatesEqual(date1: Date, date2: Date): boolean {
    const newDate1: Date = new Date(date1);
    const newDate2: Date = new Date(date2);

    return (
      newDate1.getFullYear() === newDate2.getFullYear() &&
      newDate1.getMonth() === newDate2.getMonth() &&
      newDate1.getDate() === newDate2.getDate()
    );
  }
}

export default CalendarRepository;
