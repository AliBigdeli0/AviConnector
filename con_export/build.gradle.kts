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
    implementation("org.springframework.boot:spring-boot-starter-logging")

    // lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // witsml
    implementation("com.hashmapinc.tempus:WitsmlObjects:1.1.48.1")

    // common
    implementation(project(":con_common"))

    // Mongodb
    implementation("org.mongodb:mongodb-driver-sync:5.1.3")
    implementation("org.mongodb:bson:5.1.3")

    // tests
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")

    // XMl serializer
    implementation("javax.xml.bind:jaxb-api:2.3.1")
    implementation("org.glassfish.jaxb:jaxb-runtime:2.3.1")

    // Colored Output
    implementation("org.fusesource.jansi:jansi:2.4.1")
}

tasks.register<Copy>("moveJars") {
    from(configurations.runtimeClasspath.get().asFileTree.matching { include("*.jar") })
    into(layout.buildDirectory.dir("lib_export"))
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

    classpath = files(layout.buildDirectory.dir("lib_export")) + sourceSets["main"].runtimeClasspath

    mainClass.set("com.med.con_export.ConExport")

    finalizedBy("moveJars")
}

tasks.test {
    useJUnitPlatform()
}