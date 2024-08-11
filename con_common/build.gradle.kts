
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

dependencies {
    // Gson
    implementation ("com.google.code.gson:gson:2.8.6")

    // ignite
    implementation("org.apache.ignite:ignite-core:2.16.0")
    implementation("org.apache.ignite:ignite-spring:2.16.0")
}

