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
import org.apache.ignite.spi.discovery.tcp.TcpDiscoverySpi;
import org.apache.ignite.spi.discovery.tcp.ipfinder.multicast.TcpDiscoveryMulticastIpFinder;

import javax.cache.CacheException;
import java.io.Closeable;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IgniteManager implements Closeable {
	IgniteClient igniteClient;
	Ignite ignite;

	public void init() throws IgniteException {
		final int TIMEOUTS = 2000;

		var cfgClient = new ClientConfiguration().setAddresses(getIgniteAddress());
		cfgClient.setTimeout(TIMEOUTS);
		igniteClient = Ignition.startClient(cfgClient);
		System.out.println("======> ignite client has created!");

		var cfg = new IgniteConfiguration();
		cfg.setClientMode(true);
		var spi = new TcpDiscoverySpi();

		// Configure IP finder.
		var ipFinder = new TcpDiscoveryMulticastIpFinder();
		var host = getIgniteAddress().split(":")[0];
		ipFinder.setAddresses(Collections.singletonList(host + ":47500..47509"));
		spi.setIpFinder(ipFinder);

		cfg.setDiscoverySpi(spi);

		ignite = Ignition.start(cfg);
		System.out.println("======> ignite has created!");
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
		final ClientCache<Integer, String> cache = igniteClient.getOrCreateCache(well.getJobName());
		return cache.size();
	}

	public void pushTimeToMemory(final DbTime newTimeData, final DbWell well) throws IOException {
		final IgniteCache<Integer, String> cache = ignite.getOrCreateCache(well.getJobName());
		cache.put(cache.size() + 1, newTimeData.toJson());
	}

	public List<DbTime> readAllCache(final DbWell well) {
		final IgniteCache<Integer, String> cache = ignite.getOrCreateCache(well.getJobName());
		final var it = cache.iterator();
		final List<DbTime> list = new ArrayList<>();

		while (it.hasNext()) {
			final var kv = it.next();
			list.add(DbTime.from(kv.getValue()));
			cache.remove(kv.getKey());
		}

		return list;
	}

	public List<String> getCacheNames() {
		return igniteClient.cacheNames().stream().toList();
	}

	@Override
	public void close() throws IOException {
		if (igniteClient != null) igniteClient.close();
		if (ignite != null) ignite.close();
	}

}
