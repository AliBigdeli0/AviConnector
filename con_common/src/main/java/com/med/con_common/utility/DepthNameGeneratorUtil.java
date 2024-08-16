package com.med.con_common.utility;

public class DepthNameGeneratorUtil {

	private static final int DepthStep = 100; // Assuming DepthStep is defined somewhere

	private static String depthNameGenerator(double depth) {
		int roundedDepth = (int) depth;
		if (roundedDepth < DepthStep) {
			return "0_" + DepthStep;
		}

		int fromDepth = roundedDepth - (roundedDepth % DepthStep);
		return fromDepth + "_" + (fromDepth + DepthStep);
	}

	public static String generateDepthBaseCol(double depth, String wellId) {
		return "depth_" + wellId + "_" + depthNameGenerator(depth);
	}
}