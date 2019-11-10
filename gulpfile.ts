const {src, dest, task, series, parallel} = require("gulp");
type CB = (err?: any) => any;
const {task: shellTask} = require("gulp-shell");

const {rollup} = require("rollup");
const {uglify: rollupUglify} = require("rollup-plugin-uglify");
const rollupBabel = require("rollup-plugin-babel");
const rollupSourcemaps = require("rollup-plugin-sourcemaps");
const rollupNodeResolve = require("rollup-plugin-node-resolve");

const {camelCase, capitalize, template} = require("lodash");
const {resolve: resolve_, extname, dirname, basename} = require("path");
const {readFileSync} = require("fs");

const resolve = (...segments: string[]) => resolve_(__dirname, ...segments);
const withExt = (file: string, ext: string = "") => file.slice(0, -extname(file).length) + ext;

const pkg = require("./package.json");
const tsc = require("./tsconfig.json");
const nyc = JSON.parse(readFileSync(resolve(".nycrc")).toString("utf8"));
const babelrc = JSON.parse(readFileSync(resolve(".babelrc")).toString("utf8"));

const dirs = {
  entryTs:      resolve(dirname(pkg.entry)),
  entryJs:      resolve(tsc.compilerOptions.outDir),
  output:       resolve(dirname(pkg.main)),
  docs:         resolve("docs"),
  temp:         resolve("temp"),
  coverage:     resolve(nyc["report-dir"]),
  nycTemp:      resolve(".nyc_output"),
  nodeModules:  resolve("node_modules"),
};

const outBase = withExt(basename(pkg.main));

const files = {
  entryTs:      resolve(pkg.entry),
  entryDts:     resolve(dirs.entryJs, withExt(basename(pkg.entry), ".d.ts")),
  entryJs:      resolve(dirs.entryJs, withExt(basename(pkg.entry), ".js")),

  outputCjs:    resolve(dirs.output, withExt(outBase, ".cjs.js")),
  outputUmd:    resolve(dirs.output, withExt(outBase, ".js")),
  outputMin:    resolve(dirs.output, withExt(outBase, ".min.js")),
  outputEsm:    resolve(dirs.output, withExt(outBase, ".esm.js")),
  outputIife:   resolve(dirs.output, withExt(outBase, ".iife.js")),
  outputDts:    resolve(dirs.output, pkg.types),
};

const externals = Object.keys(pkg.dependencies || {});
const globals = externals.reduce((all, name) => Object.assign(all, {[name]: camelCase(name)}), {});
const banner = template(readFileSync("build/banner.txt"))(pkg);
const onwarn = () => {};

const rollupInput: import("rollup").InputOptions = {
  input: files.entryJs,
  external: externals,
  plugins: [rollupNodeResolve(), rollupSourcemaps()],
  onwarn,
};
const rollupOutput: import("rollup").OutputOptions = {
  exports: "named",
  name: capitalize(camelCase(pkg.name)),
  globals,
  sourcemap: true,
  banner,
};

const rollupTask = (output: import("rollup").OutputOptions = {}, input: import("rollup").InputOptions = {}) => {
  return async () => {
    input  = Object.assign({}, rollupInput,  input);
    output = Object.assign({}, rollupOutput, output);
    if (input.plugins !== rollupInput.plugins) input.plugins!.unshift(...rollupInput.plugins!);
    const bundle = await rollup(input);
    return bundle.write(output);
  }
};

const cleanTask = (dir: string | string[]) => (cb: CB) => require("rimraf")(dir, cb);



task("clean:ts",   cleanTask(dirs.entryJs));
task("clean:dts",  cleanTask(dirs.temp));
task("clean:out",  cleanTask(dirs.output));
task("clean:docs", cleanTask(dirs.docs));
task("clean:node", cleanTask(dirs.nodeModules));
task("clean:meta", cleanTask("./{AUTHORS,CHANGELOG}.md"));
task("clean:nyc",  cleanTask(dirs.nycTemp));
task("clean:cov",  cleanTask(dirs.coverage));
task("clean:intermediate", parallel(
  task("clean:ts"),
  task("clean:dts"),
));
task("clean", parallel(
  task("clean:ts"),
  task("clean:dts"),
  task("clean:out"),
  task("clean:docs"),
  task("clean:nyc"),
  task("clean:cov"),
));
task("clean:all", parallel(
  task("clean:ts"),
  task("clean:dts"),
  task("clean:out"),
  task("clean:docs"),
  task("clean:node"),
  task("clean:meta"),
));

task("build:ts",      shellTask("ttsc -p ."));
task("build:dts",     shellTask("api-extractor run --local"));
task("build:docs",    shellTask("api-documenter markdown -i <%= output %> -o <%= docs %>", {templateData: dirs}));
task("build:bundle:cjs",  rollupTask({ format: "cjs",  file: files.outputCjs  }));
task("build:bundle:esm",  rollupTask({ format: "esm",  file: files.outputEsm  }));
task("build:bundle:umd",  rollupTask({ format: "umd",  file: files.outputUmd  }, { plugins: [rollupBabel(babelrc)] }));
task("build:bundle:min",  rollupTask({ format: "umd",  file: files.outputMin  }, { plugins: [rollupBabel(babelrc), rollupUglify()] }));
task("build:bundle:iife", rollupTask({ format: "iife", file: files.outputIife }, { plugins: [rollupBabel(babelrc), rollupUglify()] }));
task("build:bundle", parallel(
  task("build:bundle:cjs"),
  task("build:bundle:esm"),
  task("build:bundle:umd"),
  task("build:bundle:min"),
  task("build:bundle:iife"),
));
task("build", series(
  task("build:ts"),
  parallel(
    task("build:bundle"),
    series(task("build:dts"), task("build:docs")),
  ),
  task("clean:intermediate")
));

task("lint",           shellTask("tslint -p tsconfig.json"));
task("lint:fix",       shellTask("tslint --fix -p tsconfig.json"));

task("test",           shellTask("jasmine --config=jasmine.json"));
task("test:nyc",       shellTask("nyc jasmine --config=jasmine.json"));
task("test:cov", series(
  task("test:nyc"),
  task("clean:nyc"),
));

task("meta:authors",   shellTask("ngm authors --md --out AUTHORS.md"));
task("meta:changelog", shellTask("ngm changelog --md --out CHANGELOG.md --ignore changelog --ignore authors"));
task("meta", parallel(
  task("meta:authors"),
  task("meta:changelog"),
));

task("default", shellTask("gulp --tasks"));
