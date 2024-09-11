package com.med.con_common.db;

import com.med.con_common.model.DbComment;
import com.med.con_common.model.DbDepth;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.Constants;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.BsonDocument;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
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

	public List<String> readAllWellsTimeCollection(String wellId) {
		var retList = new ArrayList<String>();

		for (var coll : db.listCollectionNames()) {
			if (coll.startsWith(String.format("c_%s_", wellId))) retList.add(coll);
		}

		return retList;
	}

	public List<DbTime> readAllCollection(String colName) throws Exception {
		final var timeCol = db.getCollection(colName, BsonDocument.class);
		final var retList = new ArrayList<DbTime>();

		for (var doc : timeCol.find()) {
			retList.add(DbTime.toDbTime(doc));
		}

		return retList;
	}

	public void insertComment(DbComment comment) throws IOException {
		final var commentCol = db.getCollection(comment.generateCollectionName(), BsonDocument.class);
		commentCol.insertOne(comment.toBsonDocument());
	}

	public void bulkTimeDb(List<DbTime> timeData) throws IOException {
		final var bulkToInsert = new HashMap<String, List<BsonDocument>>();
		separateTimeDbByColName(timeData, bulkToInsert);
		insertBulkTimeDb(bulkToInsert);
	}

	private void insertBulkTimeDb(HashMap<String, List<BsonDocument>> bulkToInsert) {
		for (var colName : bulkToInsert.keySet()) {
			final var collection = db.getCollection(colName, BsonDocument.class);
			collection.insertMany(bulkToInsert.get(colName));
		}
	}

	private static void separateTimeDbByColName(List<DbTime> timeData, HashMap<String, List<BsonDocument>> bulkToInsert) throws IOException {
		for (var timeDb : timeData) {
			final var collectionName = timeDb.collectionName();
			final var bsonDocument = timeDb.toBsonDocument();

			if (!bulkToInsert.containsKey(collectionName)) {
				bulkToInsert.put(collectionName, new ArrayList<>());
			}

			bulkToInsert.get(collectionName).add(bsonDocument);
		}
	}

	public void insertDepth(DbDepth dbDepth) throws IOException {
		final var colName = dbDepth.collectionName();
		final var col = db.getCollection(colName, BsonDocument.class);
		col.insertOne(dbDepth.toBsonDocument());
	}

	@Override
	public void close() throws IOException {
		if (client != null) client.close();
	}
}
