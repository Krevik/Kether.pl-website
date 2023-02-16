import { BindsSchema } from "./database";

export const queries = {
	getBindById: (id) => {
		return {
			schema: BindsSchema,
			value: id,
		};
	},
};
