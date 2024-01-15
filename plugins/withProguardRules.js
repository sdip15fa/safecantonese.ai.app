
const { createRunOncePlugin,  withAppBuildGradle } = require("@expo/config-plugins");
const pkg = require("../package.json");

const withProguardRules = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addProguardRules(config.modResults.contents);
    } else {
      throw new Error(
        "Cannot add to maven gradle because the project build.gradle is not groovy"
      );
    }
    return config;
  });
};

function addProguardRules(buildGradleContent) {
  const RE_EXISTS = /my-proguard-rules\.pro/g;
  if (RE_EXISTS.test(buildGradleContent)) {
    return buildGradleContent;
  }

  const RE_ENTRY = /proguardFiles getDefaultProguardFile\("proguard-android.txt"\),\s?"proguard-rules.pro"/;

  if (!RE_ENTRY.test(buildGradleContent)) {
    throw new Error(
      "Cannot add to maven gradle because the proguard regex could not find the entrypoint row"
    );
  }

  return buildGradleContent.replace(
    RE_ENTRY,
    `proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            // Project-specific additions to proguard
            def myProguardRulesPath = new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../plugins/proguard-rules.pro")
            proguardFile(myProguardRulesPath)
            
            `
  );
}

module.exports = createRunOncePlugin(
  withProguardRules,
  `${pkg.name}-withProguardRules`,
  pkg.version
);