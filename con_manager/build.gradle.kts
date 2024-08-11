plugins {
    id("org.springframework.boot") version "3.3.2"
    id("io.spring.dependency-management") version "1.1.6"
}

extra["springCloudVersion"] = "2023.0.3"

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

dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}

dependencies {
    // spring
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // zookeeper
    implementation("org.apache.zookeeper:zookeeper:3.9.2")

    // lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // logger
    implementation("ch.qos.logback:logback-classic")

    // tests
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // common
    implementation(project(":con_common"))

    // job scheduler
    implementation("org.jobrunr:jobrunr:7.2.3")
    implementation ("com.google.code.gson:gson:2.8.6")
    implementation ("org.eclipse:yasson:1.0.8")

    // ignite
    implementation("org.apache.ignite:ignite-core:2.16.0")
    implementation("org.apache.ignite:ignite-spring:2.16.0")
}

tasks.named<JavaExec>("bootRun") {
    val wd = file("${projectDir}/build/")
    workingDir(wd);
    jvmArgs("--add-opens", "java.base/java.nio=ALL-UNNAMED")
}

tasks.withType<Test> {
    jvmArgs("--add-opens", "java.base/java.nio=ALL-UNNAMED")
}
