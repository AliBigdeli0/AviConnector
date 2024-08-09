package com.med.con_manager.zkeeper;

import com.med.con_manager.utility.EnvironmentVariables;
import lombok.extern.slf4j.Slf4j;
import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ZKeeperManage {

	public ZKeeperManage(EnvironmentVariables environmentVariables) {
		this.environmentVariables = environmentVariables;
	}

	EnvironmentVariables environmentVariables;

	public void init() {
		ZooKeeper zooKeeper = null;
		try {
			zooKeeper = new ZooKeeper(environmentVariables.getZookeeperAddress(), environmentVariables.getZookeeperSessionTimeout(), new Watcher() {
				@Override
				public void process(WatchedEvent watchedEvent) {
					log.info("new event received: {}", watchedEvent);
				}
			});

			log.info("wait for milliseconds...");
			Thread.sleep(5000);

			String path = "/well";
			var dataBytes = "test data from here".getBytes();

			if (zooKeeper.exists(path, false) == null) {
				zooKeeper.create(path, dataBytes, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
				log.info("ZNode created : the path is '{}'", path);
			} else {
				log.error("the path '{}' already exist", path);
			}

			var stat = new Stat();
			var receivedBytes = zooKeeper.getData(path, false, stat);

			log.info("the data received: {}", new String(receivedBytes));

			zooKeeper.delete(path, -1);

			log.info("ZNode deleted!");
		} catch (Exception ex) {
			log.error(ex.getMessage());
		} finally {
			if (zooKeeper != null) {
				try {
					zooKeeper.close();
				} catch (Exception ex) {
					log.error(ex.getMessage());
				}
			}
		}
	}
}
