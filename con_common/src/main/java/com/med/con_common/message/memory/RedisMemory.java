package com.med.con_common.message.memory;

import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.List;

public class RedisMemory implements Memory{
	@Override
	public void init(Logger log) throws Exception {

	}

	@Override
	public void reinit(Logger log) throws Exception {

	}

	@Override
	public <K, V> void putCache(String cacheName, K key, V value) throws Exception {

	}

	@Override
	public <K, V> V getCache(String cacheName, K key) {
		return null;
	}

	@Override
	public boolean isOffline(DbWell well) {
		return false;
	}

	@Override
	public long sizeOfMemory(DbWell well) {
		return 0;
	}

	@Override
	public void pushTimeToMemory(DbTime newTimeData, DbWell well) throws IOException {

	}

	@Override
	public List<DbTime> readAllCache(DbWell well) {
		return List.of();
	}

	@Override
	public List<String> getCacheNames() {
		return List.of();
	}

	@Override
	public void close() throws IOException {

	}
}
