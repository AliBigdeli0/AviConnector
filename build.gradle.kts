allprojects {
	group = "com.med"
	version = "1.0.0"

	repositories {
		mavenCentral()
	}

	tasks.withType<Test> {
		useJUnitPlatform()
	}
}

subprojects {
	apply(plugin = "java")
}