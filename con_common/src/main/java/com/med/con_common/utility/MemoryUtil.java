package com.med.con_common.utility;

import com.med.con_common.message.memory.IgniteMemory;
import com.med.con_common.message.memory.Memory;
import com.med.con_common.message.memory.MemoryType;
import com.med.con_common.message.memory.RedisMemory;

public class MemoryUtil {
	public static Memory createMemory(MemoryType type) throws Exception {
		return switch (type) {
			case Ignite -> new IgniteMemory();
			case Redis -> new RedisMemory();
			default -> throw new Exception("the type of requested memory does not defined");
		};
	}
}
