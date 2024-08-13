package com.med.con_common.message;


import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.IgniteException;
import org.apache.ignite.Ignition;
import org.apache.ignite.client.ClientCache;
import org.apache.ignite.client.IgniteClient;
import org.apache.ignite.configuration.ClientConfiguration;
import org.apache.ignite.configuration.IgniteConfiguration;

import javax.cache.CacheException;
import java.io.Closeable;
import java.io.IOException;


public class IgniteManager implements Closeable {
	IgniteClient igniteClient;
	Ignite ignite;

	public void init() throws IgniteException {
		final int TIMEOUTS = 2000;

		var cfgClient = new ClientConfiguration().setAddresses(getIgniteAddress());
		cfgClient.setTimeout(TIMEOUTS);
		igniteClient = Ignition.startClient(cfgClient);

		var cfg = new IgniteConfiguration();
		cfg.setClientMode(true);
		ignite = Ignition.start(cfg);
	}

	public void reinit() throws IOException {
		close();
		init();
	}

	public <K, V> void putCache(String cacheName, K key, V value) throws CacheException {
		ClientCache<K, V> cache = igniteClient.getOrCreateCache(cacheName);
		cache.put(key, value);
	}

	public <K, V> V getCache(String cacheName, K key) {
		ClientCache<K, V> cache = igniteClient.getOrCreateCache(cacheName);
		return cache.get(key);
	}

	public boolean isOffline(DbWell well) {
		try {
			return sizeOfMemory(well) < 0;
		} catch (Exception ex) {
			return true;
		}
	}

	public String getIgniteAddress() {
		return CommonEnvironmentVariables.getIgniteAddress();
	}

	public long sizeOfMemory(DbWell well) {
		ClientCache<Integer, String> cache = igniteClient.getOrCreateCache(well.getJobName());
		return cache.size();
	}

	public void pushTimeToMemory(DbTime newTimeData, DbWell well) throws IOException {
		IgniteCache<Integer, String> cache = ignite.getOrCreateCache(well.getJobName());
		cache.put(cache.size() + 1, newTimeData.toJson());

//		while (cache.size() >= CommonEnvironmentVariables.getDataCacheSize()) {
//			var key = cache.iterator().next().getKey();
//			cache.remove(key);
//		}
	}

	@Override
	public void close() throws IOException {
		if (igniteClient != null) igniteClient.close();
		if (ignite != null) ignite.close();
	}
}
