package com.med.con_common.message;


import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.ConsoleHelper;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.IgniteException;
import org.apache.ignite.Ignition;
import org.apache.ignite.configuration.IgniteConfiguration;
import org.apache.ignite.spi.discovery.tcp.TcpDiscoverySpi;
import org.apache.ignite.spi.discovery.tcp.ipfinder.multicast.TcpDiscoveryMulticastIpFinder;
import org.slf4j.Logger;

import javax.cache.CacheException;
import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class IgniteManager implements Closeable {
	Ignite ignite;

	public void init(Logger log) throws IgniteException {
		final int TIMEOUTS = 8000;

		final var host = getIgniteAddress().split(":")[0];
		final var addressColl = List.of(host + ":47100..47101");
		ConsoleHelper.logIfVerbose(log, "ignite discovery port is {}", addressColl);

		final var cfg = new IgniteConfiguration();
		cfg.setClientMode(true);

		final var spi = new TcpDiscoverySpi();
		final var ipFinder = new TcpDiscoveryMulticastIpFinder();
		ipFinder.setAddresses(addressColl);
		spi.setIpFinder(ipFinder);

		cfg.setDiscoverySpi(spi);

		ignite = Ignition.start(cfg);
		ConsoleHelper.logIfVerbose(log, "ignite has created!");
	}

	public void reinit(Logger log) throws IOException {
		close();
		init(log);
	}

	public <K, V> void putCache(String cacheName, K key, V value) throws CacheException {
		final IgniteCache<K, V> cache = ignite.getOrCreateCache(cacheName);
		cache.put(key, value);
	}

	public <K, V> V getCache(String cacheName, K key) {
		final IgniteCache<K, V> cache = ignite.getOrCreateCache(cacheName);
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
		final IgniteCache<Integer, String> cache = ignite.getOrCreateCache(well.getJobName());
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
		return ignite.cacheNames().stream().toList();
	}

	@Override
	public void close() throws IOException {
		if (ignite != null) ignite.close();
	}
}
