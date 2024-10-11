import { relations } from "drizzle-orm/relations";
import { evaluacion, racha, user, preposttest, session, testinferencia, testreflexion, lectura, categoria_lectura, testobtencioninfo, authenticator, account } from "./schema";

export const rachaRelations = relations(racha, ({one}) => ({
	evaluacion: one(evaluacion, {
		fields: [racha.id_evaluacion],
		references: [evaluacion.id_evaluacion]
	}),
	user: one(user, {
		fields: [racha.id_usuario],
		references: [user.id]
	}),
}));

export const evaluacionRelations = relations(evaluacion, ({one, many}) => ({
	rachas: many(racha),
	preposttests: many(preposttest),
	testinferencias: many(testinferencia),
	testreflexions: many(testreflexion),
	lectura: one(lectura, {
		fields: [evaluacion.id_lectura],
		references: [lectura.id_lectura]
	}),
	user: one(user, {
		fields: [evaluacion.id_usuario],
		references: [user.id]
	}),
	testobtencioninfos: many(testobtencioninfo),
}));

export const userRelations = relations(user, ({many}) => ({
	rachas: many(racha),
	sessions: many(session),
	evaluacions: many(evaluacion),
	lecturas: many(lectura),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const preposttestRelations = relations(preposttest, ({one}) => ({
	evaluacion: one(evaluacion, {
		fields: [preposttest.id_evaluacion],
		references: [evaluacion.id_evaluacion]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const testinferenciaRelations = relations(testinferencia, ({one}) => ({
	evaluacion: one(evaluacion, {
		fields: [testinferencia.id_evaluacion],
		references: [evaluacion.id_evaluacion]
	}),
}));

export const testreflexionRelations = relations(testreflexion, ({one}) => ({
	evaluacion: one(evaluacion, {
		fields: [testreflexion.id_evaluacion],
		references: [evaluacion.id_evaluacion]
	}),
}));

export const lecturaRelations = relations(lectura, ({one, many}) => ({
	evaluacions: many(evaluacion),
	categoria_lectura: one(categoria_lectura, {
		fields: [lectura.id_categoria],
		references: [categoria_lectura.id_categoria]
	}),
	user: one(user, {
		fields: [lectura.id_usuario],
		references: [user.id]
	}),
}));

export const categoria_lecturaRelations = relations(categoria_lectura, ({many}) => ({
	lecturas: many(lectura),
}));

export const testobtencioninfoRelations = relations(testobtencioninfo, ({one}) => ({
	evaluacion: one(evaluacion, {
		fields: [testobtencioninfo.id_evaluacion],
		references: [evaluacion.id_evaluacion]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));