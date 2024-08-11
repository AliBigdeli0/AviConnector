package com.med.con_common.message;


import com.med.con_common.utility.CommonEnvironmentVariables;
import org.apache.ignite.Ignite;
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
		var cfgClient = new ClientConfiguration().setAddresses(CommonEnvironmentVariables.getIgniteAddress());
		igniteClient = Ignition.startClient(cfgClient);

		var cfg = new IgniteConfiguration();
		ignite = Ignition.start(cfg);
	}
	
	public <K, V> void putCache(String cacheName, K key, V value) throws CacheException {
		ClientCache<K, V> cache = igniteClient.getOrCreateCache(cacheName);
		cache.put(key, value);
	}

	public <K, V> V getCache(String cacheName, K key) {
		ClientCache<K, V> cache = igniteClient.getOrCreateCache(cacheName);
		return cache.get(key);
	}

	@Override
	public void close() throws IOException {
		if (igniteClient != null) igniteClient.close();
		if (ignite != null) ignite.close();
	}
}
