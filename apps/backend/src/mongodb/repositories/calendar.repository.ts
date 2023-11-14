import {
  CalendarEntries,
  CalendarEntryType,
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
    entryType: CalendarEntryType
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

  static async updateCalendarEntry(
    userid: number,
    year: number,
    updates: Array<SingleEntry>
  ) {
    const id: string = `${userid.toString()}_${year.toString()}`;

    const updatedDoc = await CalendarModel.findOneAndUpdate(
      { id },
      {
        $addToSet: {
          entries: {
            $each: updates.filter(
              update => update.entryType !== CalendarEntryType.remove
            ),
          },
        },
      }
    );

    const entriesToRemove = updates.filter(
      entry => entry.entryType === CalendarEntryType.remove
    );
    if (updatedDoc && entriesToRemove) {
      await updatedDoc.updateOne({
        $pull: {
          entries: {
            $or: entriesToRemove.map(entry => ({ entryDate: entry.entryDate })),
          },
        },
      });
    }

    return updatedDoc;
  }

  static getCompositeId(userid: number, date: Date): string {
    return `${userid.toString()}_${date.getFullYear().toString()}`;
  }
}

export default CalendarRepository;
