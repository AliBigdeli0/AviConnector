package com.med.con_common.message;


import com.med.con_common.utility.CommonEnvironmentVariables;
import org.apache.ignite.IgniteException;
import org.apache.ignite.Ignition;
import org.apache.ignite.client.ClientCache;
import org.apache.ignite.client.IgniteClient;
import org.apache.ignite.configuration.ClientConfiguration;

import java.io.Closeable;
import java.io.IOException;


public class IgniteManager implements Closeable {
	IgniteClient ignite;

	public void init() throws IgniteException {
		var cfg = new ClientConfiguration();
		cfg.setAddresses(CommonEnvironmentVariables.getIgniteAddress());
		ignite = Ignition.startClient(cfg);
	}

	public <K, V> void putCache(String cacheName, K key, V value) {
		createCacheIfNotExist(cacheName);
		ClientCache<K, V> cache = ignite.cache(cacheName);
		cache.put(key, value);
	}

	private void createCacheIfNotExist(String cacheName) {
		if (ignite.cacheNames().stream().noneMatch(cn -> cn.equals(cacheName))) {
			ignite.createCache(cacheName);
		}
	}

	public <K, V> V getCache(String cacheName, K key) {
		createCacheIfNotExist(cacheName);
		ClientCache<K, V> cache = ignite.getOrCreateCache(cacheName);
		return cache.get(key);
	}

	@Override
	public void close() throws IOException {
		if (ignite != null) ignite.close();
	}
}
