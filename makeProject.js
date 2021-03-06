#!/usr/bin/env node

console.log("Welcome to ES6 Webpack Project Kit");

var fs = require('fs');
const exec = require('child_process').spawnSync;
var config = JSON.parse(fs.readFileSync("project.json", 'utf8'));

var LICENSEFile = `The MIT License (MIT)

Copyright (c) ${(new Date).getFullYear()} ${config.author} https://github.com/${config.gitUser}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;


fs.writeFileSync('LICENSE', LICENSEFile);
exec('git', ['add', 'LICENSE']);

var packageJsonFile = `{
	"name": "${config.packageName}",
	"version": "1.0.0",
	"description": "${config.description}",
	"main": "dist/${config.browserName}.js",
	"scripts": {
		"test": "echo \\\"Error: no test specified\\\" && exit 1",
		"watch": "webpack --watch &",
		"server": "cd dist ; live-server",
		"build": "npm run watch ; npm run server"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/${config.gitUser}/${config.gitRepoName}.git"
	},
	"keywords": ${JSON.stringify(config.keywords)},
	"author": "${config.author} <${config.email}>",
	"license": "MIT",
	"bugs": {
		"url": "https://github.com/${config.gitUser}/${config.gitRepoName}/issues"
	},
	"homepage": "https://github.com/${config.gitUser}/${config.gitRepoName}#readme",
	"devDependencies": {
	}
}
`;

fs.writeFileSync('package.json', packageJsonFile);

exec('npm', ['install', '--save-dev', '--save-exact', 'babel-core']);
exec('npm', ['install', '--save-dev', '--save-exact', 'babel-loader']);
exec('npm', ['install', '--save-dev', '--save-exact', 'babel-preset-es2015']);
exec('npm', ['install', '--save-dev', '--save-exact', 'webpack']);

exec('git', ['add', 'package.json']);


var webpackConfig = `module.exports = {
	entry: {
		"${config.browserName}": "./src/index.js",
		"example": "./example/example.js"
	},
	output: {
		path: "dist",
		filename: "[name].js",
		libraryTarget: 'umd',
		library: "[name]"
	},
	externals: {
		"${config.packageName}": {
			commonjs: '${config.packageName}',
			commonjs2: '${config.packageName}',
			amd: '${config.browserName}',
			root: '${config.browserName}'
		}
	},
	module: {
		loaders: [
			{
				test: /\\.js$/,
				loader: "babel",
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};`;

fs.writeFileSync('webpack.config.js', webpackConfig);
exec('git', ['add', 'webpack.config.js']);


var readMeFile = `# ${config.packageName}
${config.description}

# Installation

\`\`\`
npm install --save ${config.packageName}
\`\`\`

# Usage

\`\`\`
import ${config.browserName} from '${config.packageName}';
${config.browserName}();
\`\`\``;

fs.writeFileSync('README.md', readMeFile);
exec('git', ['add', 'README.md']);


var ignoreFile = `# Logs
logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directory
node_modules

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

/node_modules
.idea`;

fs.writeFileSync('.gitignore', ignoreFile);
exec('git', ['add', '.gitignore']);

var indexFile = `/*

 The MIT License (MIT)
 Copyright (c) ${(new Date).getFullYear()} ${config.author} https://github.com/${config.gitUser}

 */

module.exports = function () {
	console.log("ES6 + Webpack is Working");
	["a", "b"].map((v)=> {
		console.log(v);
	});
};`;

exec('mkdir', ['src']);
fs.writeFileSync('src/index.js', indexFile);
exec('git', ['add', 'src/index.js']);


var exampleFile = `import ${config.browserName} from '${config.packageName}';

${config.browserName}();`;
exec('mkdir', ['example']);
fs.writeFileSync('example/example.js', exampleFile);
exec('git', ['add', 'example/example.js']);


var indexFile = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<script src="${config.browserName}.js"></script>
	<script src="example.js"></script>
	<title>${config.browserName}</title>
</head>
<body>
<h1>See Console Logs</h1>
</body>
</html>`;
exec('mkdir', ['dist']);
fs.writeFileSync('dist/index.html', indexFile);
exec('git', ['add', 'dist/index.html']);

console.log("All Files generated, now generating files");
exec('webpack');
exec('git', ['add', `dist/${config.browserName}.js`]);
exec('git', ['add', 'dist/example.js']);

console.log("Please run , following command to start the server");
console.log("npm run build");
