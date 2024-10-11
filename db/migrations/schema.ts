import {
  pgTable,
  integer,
  varchar,
  foreignKey,
  date,
  text,
  boolean,
  timestamp,
  numeric,
  primaryKey,
  unique
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const categoria_lectura = pgTable('categoria_lectura', {
  id_categoria: integer('id_categoria').primaryKey().notNull(),
  nombre_categoria: varchar('nombre_categoria', { length: 80 }).notNull()
});

export const racha = pgTable('racha', {
  id_racha: integer('id_racha').primaryKey().notNull(),
  fecha_rach: date('fecha_rach').notNull(),
  id_usuario: text('id_usuario')
    .notNull()
    .references(() => user.id),
  id_evaluacion: integer('id_evaluacion')
    .notNull()
    .references(() => evaluacion.id_evaluacion)
});

export const preposttest = pgTable('preposttest', {
  id_test_p: integer('id_test_p').primaryKey().notNull(),
  pre_post: varchar('pre_post', { length: 255 }).notNull(),
  id_usuario: text('id_usuario').references(() => user.id),
  id_evaluacion: integer('id_evaluacion')
    .notNull()
    .references(() => evaluacion.id_evaluacion)
});

export const session = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey().notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'string' }).notNull()
});

export const testinferencia = pgTable('testinferencia', {
  id_test_inter: integer('id_test_inter').primaryKey().notNull(),
  pregunta: varchar('pregunta', { length: 255 }).notNull(),
  feedback: varchar('feedback', { length: 500 }),
  respuesta: varchar('respuesta', { length: 200 }),
  acierto: boolean('acierto'),
  res_correc: varchar('res_correc', { length: 500 }),
  id_evaluacion: integer('id_evaluacion')
    .notNull()
    .references(() => evaluacion.id_evaluacion)
});

export const testreflexion = pgTable('testreflexion', {
  id_test_refle: integer('id_test_refle').primaryKey().notNull(),
  pregunta: varchar('pregunta', { length: 255 }).notNull(),
  feedback: varchar('feedback', { length: 500 }),
  respuesta: varchar('respuesta', { length: 300 }),
  acierto: boolean('acierto'),
  res_correc: varchar('res_correc', { length: 500 }),
  id_evaluacion: integer('id_evaluacion')
    .notNull()
    .references(() => evaluacion.id_evaluacion)
});

export const evaluacion = pgTable('evaluacion', {
  id_evaluacion: integer('id_evaluacion').primaryKey().notNull(),
  fecha_evaluacion: date('fecha_evaluacion'),
  puntaje: numeric('puntaje', { precision: 4, scale: 2 }),
  retroalimentacion: varchar('retroalimentacion', { length: 500 }),
  id_usuario: text('id_usuario').references(() => user.id),
  id_lectura: integer('id_lectura')
    .notNull()
    .references(() => lectura.id_lectura)
});

export const user = pgTable('user', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  email: text('email').notNull(),
  password: text('password'),
  name_tutor: text('name_tutor'),
  fecha_nacimiento: text('fecha_nacimiento'),
  email_tutor: varchar('email_tutor', { length: 80 }),
  image: text('image'),
  emailVerified: timestamp('emailVerified', { mode: 'string' })
});

export const lectura = pgTable('lectura', {
  id_lectura: integer('id_lectura').primaryKey().notNull(),
  nombre_lectura: varchar('nombre_lectura', { length: 80 }).notNull(),
  lecturas3: varchar('lecturas3', { length: 80 }).notNull(),
  id_usuario: text('id_usuario').references(() => user.id),
  id_categoria: integer('id_categoria')
    .notNull()
    .references(() => categoria_lectura.id_categoria)
});

export const testobtencioninfo = pgTable('testobtencioninfo', {
  id_test_oi: integer('id_test_oi').primaryKey().notNull(),
  pregunta: varchar('pregunta', { length: 255 }).notNull(),
  res_selec: varchar('res_selec', { length: 80 }),
  res_correc: varchar('res_correc', { length: 80 }).notNull(),
  op_1: varchar('op_1', { length: 255 }).notNull(),
  op_2: varchar('op_2', { length: 255 }).notNull(),
  op_3: varchar('op_3', { length: 255 }).notNull(),
  op_4: varchar('op_4', { length: 255 }).notNull(),
  feedback: varchar('feedback', { length: 500 }),
  acierto: boolean('acierto'),
  id_evaluacion: integer('id_evaluacion')
    .notNull()
    .references(() => evaluacion.id_evaluacion)
});

export const authenticator = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports')
  },
  (table) => {
    return {
      authenticator_userId_credentialID_pk: primaryKey({
        columns: [table.credentialID, table.userId],
        name: 'authenticator_userId_credentialID_pk'
      }),
      authenticator_credentialID_unique: unique(
        'authenticator_credentialID_unique'
      ).on(table.credentialID)
    };
  }
);

export const account = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  (table) => {
    return {
      account_provider_providerAccountId_pk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: 'account_provider_providerAccountId_pk'
      })
    };
  }
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)