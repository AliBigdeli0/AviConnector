package com.med.con_common.message.memory;

import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import org.slf4j.Logger;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

public interface Memory extends Closeable {
	void init(Logger log) throws Exception;
	void reinit(Logger log) throws Exception;
	<K, V> void putCache(String cacheName, K key, V value) throws Exception;
	<K, V> V getCache(String cacheName, K key);
	boolean isOffline(DbWell well);
	long sizeOfMemory(DbWell well);
	void pushTimeToMemory(final DbTime newTimeData, final DbWell well) throws IOException;
	List<DbTime> readAllCache(final DbWell well);
	List<String> getCacheNames();
}
