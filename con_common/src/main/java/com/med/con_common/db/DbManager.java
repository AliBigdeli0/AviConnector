package com.med.con_common.db;

import com.google.gson.Gson;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DbManager implements Closeable {
	MongoClient client = null;
	MongoDatabase db = null;

	public DbManager() {
		init();
	}

	public void init() {
		client = MongoClients.create(CommonEnvironmentVariables.getMongoDbConnectionString());
		db = client.getDatabase(CommonEnvironmentVariables.getMongoDbName());
	}

	public List<DbWell> readWells() {
		var wells_col = db.getCollection(Constants.MONGO_WELL_NAME);
		var wells_docs = wells_col.find();
		var retWells = new ArrayList<DbWell>();

		for (var wellDoc : wells_docs) {
			var jsonData = wellDoc.toJson();
			var well = new Gson().fromJson(jsonData, DbWell.class);
			retWells.add(well);
		}

		return retWells;
	}

	@Override
	public void close() throws IOException {
		if (client != null) client.close();
	}
}
