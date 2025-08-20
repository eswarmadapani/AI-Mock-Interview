import { pgTable, text, varchar, serial, timestamp, integer, decimal } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    mockId: varchar('mockId').notNull(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').notNull()
});

export const UserAnswers = pgTable('userAnswers', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockIdRef').notNull(),
    question: text('question').notNull(),
    userAnswer: text('userAnswer').notNull(),
    geminiFeedback: text('geminiFeedback'),
    rating: decimal('rating', { precision: 3, scale: 1 }),
    audioUrl: text('audioUrl'),
    videoUrl: text('videoUrl'),
    gmailRecordingId: text('gmailRecordingId'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow()
});
