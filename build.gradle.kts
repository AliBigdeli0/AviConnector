plugins {
	java
	id("org.springframework.boot") version "3.3.2"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "com.med"
version = "1.0.0"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

extra["springCloudVersion"] = "2023.0.3"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-activemq")
//	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
//	implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
//	implementation("org.springframework.cloud:spring-cloud-starter-zookeeper-config")

	// lombok
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// logger
//	implementation("ch.qos.logback:logback-classic")

	//tests
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

dependencyManagement {
	imports {
		mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks {
	val fatJar by creating(Jar::class) {
		archiveBaseName.set("${project.name}-all")

		archiveVersion.set(project.version.toString())

		from(sourceSets.main.get().output)

		dependsOn(configurations.runtimeClasspath)
		from({
			configurations.runtimeClasspath.get().filter {it.name.endsWith("jar")}
		})

		manifest {
			attributes["Main-Class"] = "com.med.Main"
		}
	}
	build {
		dependsOn(fatJar)
	}
}
