import { schema } from "normalizr";
import createDB from "react-use-database";

export const BindsSchema = new schema.Entity("Binds");

export let [DatabaseProvider, useDB] = createDB([BindsSchema], {
	defaultEntities: {
		Binds: {
			1: {
				id: 1,
				author: "Nexus",
				text: "mocny zapach kiełbasy nie daje mi spokoju",
			},
		},
	},
});
