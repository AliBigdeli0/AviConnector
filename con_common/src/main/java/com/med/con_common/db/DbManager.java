package com.med.con_common.db;

import com.google.gson.Gson;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
			retWells.add(DbWell.toDbWell(wellDoc));
		}

		return retWells;
	}

	public DbWell readWellWithId(String id) {
		var well_col = db.getCollection(Constants.MONGO_WELL_NAME);
		var filter = Filters.eq("ID", id);
		var document = well_col.find(filter).first();
		return DbWell.toDbWell(Objects.requireNonNull(document));
	}

	@Override
	public void close() throws IOException {
		if (client != null) client.close();
	}
}
