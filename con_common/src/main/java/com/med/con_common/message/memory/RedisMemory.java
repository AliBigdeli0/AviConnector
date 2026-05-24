package com.med.con_common.message.memory;

import com.google.gson.Gson;
import com.med.con_common.model.DbTime;
import com.med.con_common.model.DbWell;
import com.med.con_common.utility.CommonEnvironmentVariables;
import com.med.con_common.utility.ConsoleHelper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.params.ScanParams;

import java.io.IOException;
import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class RedisMemory implements Memory{

	private JedisPool jedisPool;
	private final Gson jsonHelper = new Gson();

	@Override
	public void init(Logger log) throws Exception {
		var uri = URI.create(CommonEnvironmentVariables.getRedisAddress());

		ConsoleHelper.logIfVerbose(log, "going to initialize redis in address '{}'.", uri.toString());

		var poolConfig = new JedisPoolConfig();
		poolConfig.setMaxTotal(0xfff);
		poolConfig.setMaxIdle(0xfff);
		poolConfig.setMinIdle(0xff);

		jedisPool = new JedisPool(poolConfig, uri.getHost(), uri.getPort());
		ConsoleHelper.logIfVerbose(log, "redis has been initialization success!");
	}

	@Override
	public void reinit(Logger log) throws Exception {
		this.close();
		init(log);
	}

	@Override
	public <K, V> void putCache(String cacheName, K key, V value) throws Exception {
		try (Jedis jedis = jedisPool.getResource()) {
			var redisKey = String.format("%s:%s", cacheName, key.toString());
			jedis.set(redisKey, jsonHelper.toJson(value));
		}
	}

	@Override
	public <K, V> V getCache(String cacheName, K key, Class<V> type) throws Exception {
		var redisKey = String.format("%s:%s", cacheName, key);
		try (var jedis = jedisPool.getResource()) {
			var value = jedis.get(redisKey);
			return jsonHelper.fromJson(value, type);
		}
	}

	@Override
	public boolean isOffline(DbWell well) {
		try (var jedis = jedisPool.getResource()) {
			var response = jedis.ping();
			return !response.equals("PONG");
		}
	}

	@Override
	public long sizeOfMemory(DbWell well) {
		try (var jedis = jedisPool.getResource()) {
			var match = well.getJobName() + ":*";
			return readFromRedis(jedis, match).size();
		}
	}

	@Override
	public void pushTimeToMemory(DbTime newTimeData, DbWell well) throws IOException {
		var uid = UUID.randomUUID();
		var key = String.format("%s:%s", well.getJobName(), uid);
		try (var jedis = jedisPool.getResource()) {
			jedis.set(key, newTimeData.toJson());
		}
	}

	@Override
	public List<DbTime> readAllCacheAndRemove(DbWell well) {
		try (var jedis = jedisPool.getResource()) {
			var match = well.getJobName() + ":*";
			Set<String> keys = readFromRedis(jedis, match);
			try {
				return keys.stream().map(key -> {
					var value = jedis.get(key);
					return DbTime.from(value);
				}).toList();
			} finally {
				removeFromRedis(jedis, keys);
			}
		}
	}

	private void removeFromRedis(Jedis jedis, Set<String> keys) {
		for (String key : keys) {
			jedis.del(key);
		}
	}

	private static @NotNull Set<String> readFromRedis(Jedis jedis, String match) {
		String cursor = "0";
		Set<String> keys = new HashSet<>();
		var scanParams = new ScanParams().match(match);

		do {
			var scanResult = jedis.scan(cursor, scanParams);
			cursor = scanResult.getCursor();
			keys.addAll(scanResult.getResult());
		} while (!cursor.equals("0"));

		return keys;
	}

	@Override
	public List<String> getCacheNames() {
		try (var jedis = jedisPool.getResource()) {
			return readFromRedis(jedis, "*").stream().toList();
		}
	}

	@Override
	public void close() throws IOException {
		if (jedisPool != null) jedisPool.close();
	}
}
