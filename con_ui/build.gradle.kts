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
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.6.0")

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

    // gson
    implementation ("com.google.code.gson:gson:2.8.6")

    // ignite
    implementation("org.apache.ignite:ignite-core:2.16.0")
    implementation("org.apache.ignite:ignite-spring:2.16.0")

    // Mongodb
    implementation("org.mongodb:mongodb-driver-sync:5.1.3")
    implementation("org.mongodb:bson:5.1.3")

    // Redis
    implementation("redis.clients:jedis:5.1.4")
}

tasks.register<Copy>("moveJars") {
    from(configurations.runtimeClasspath.get().asFileTree.matching { include("*.jar") })
    into(layout.buildDirectory.dir("lib_ui"))
}

tasks.named("build") {
    finalizedBy("moveJars");
}

tasks.named("jar") {
    finalizedBy("moveJars");
}

tasks.named<JavaExec>("bootRun") {
    val wd = file("${projectDir}/build/")
    workingDir(wd)

    classpath = files(layout.buildDirectory.dir("lib_ui")) + sourceSets["main"].runtimeClasspath
    mainClass.set("com.med.con_ui.ConUI")

}

tasks.withType<Test> {
    jvmArgs("--add-opens", "java.base/java.nio=ALL-UNNAMED")
}
